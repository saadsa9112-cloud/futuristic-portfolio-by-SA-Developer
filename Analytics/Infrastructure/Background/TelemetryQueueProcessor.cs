using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using FuturisticPortfolio.Analytics.Application.Hubs;
using FuturisticPortfolio.Analytics.Application.Models;
using FuturisticPortfolio.Analytics.Domain.Entities;
using FuturisticPortfolio.Analytics.Infrastructure.Services;
using FuturisticPortfolio.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace FuturisticPortfolio.Analytics.Infrastructure.Background
{
    public class TelemetryQueueProcessor : BackgroundService
    {
        private readonly ITelemetryQueue _queue;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IIpLookupService _ipLookupService;
        private readonly IUserAgentService _userAgentService;
        private readonly IBotDetectionService _botDetectionService;
        private readonly IAnalyticsSettingsService _settingsService;
        private readonly IHubContext<AnalyticsHub> _hubContext;
        private readonly ILogger<TelemetryQueueProcessor> _logger;
        private readonly string _dlqPath;

        public TelemetryQueueProcessor(
            ITelemetryQueue queue,
            IServiceScopeFactory scopeFactory,
            IIpLookupService ipLookupService,
            IUserAgentService userAgentService,
            IBotDetectionService botDetectionService,
            IAnalyticsSettingsService settingsService,
            IHubContext<AnalyticsHub> hubContext,
            ILogger<TelemetryQueueProcessor> logger)
        {
            _queue = queue;
            _scopeFactory = scopeFactory;
            _ipLookupService = ipLookupService;
            _userAgentService = userAgentService;
            _botDetectionService = botDetectionService;
            _settingsService = settingsService;
            _hubContext = hubContext;
            _logger = logger;
            _dlqPath = Path.Combine(Directory.GetCurrentDirectory(), "App_Data", "Analytics", "dlq.json");

            // Ensure DLQ folder exists
            var directory = Path.GetDirectoryName(_dlqPath);
            if (directory != null && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }
            UpdateDlqMetrics();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Analytics Telemetry Queue Background Processor Started.");
            AnalyticsMetrics.WorkerStatus = "Running";

            var batch = new List<TelemetryPayload>();
            var lastFlushTime = DateTime.UtcNow;

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var settings = await _settingsService.GetSettingsAsync();
                    if (!settings.EnableTracking)
                    {
                        await Task.Delay(2000, stoppingToken);
                        continue;
                    }

                    try
                    {
                        var size = _queue.GetSize();
                        if (size > 0 || batch.Count > 0)
                        {
                            // Dequeue if items exist
                            if (size > 0)
                            {
                                var item = await _queue.DequeueAsync(stoppingToken);
                                batch.Add(item);
                            }
                        }
                        else
                        {
                            // Sleep short if queue empty to prevent CPU spinning
                            await Task.Delay(500, stoppingToken);
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        break;
                    }

                    var timeSinceLastFlush = DateTime.UtcNow - lastFlushTime;

                    // Flush batch if capacity reached or time limit elapsed
                    if (batch.Count >= settings.QueueBatchSize || (batch.Count > 0 && timeSinceLastFlush.TotalSeconds >= settings.FlushIntervalSeconds))
                    {
                        var startProcessTime = DateTime.UtcNow;
                        await ProcessBatchAsync(batch);
                        
                        var duration = (DateTime.UtcNow - startProcessTime).TotalSeconds;
                        AnalyticsMetrics.ProcessingRate = duration > 0 ? batch.Count / duration : batch.Count;
                        AnalyticsMetrics.TotalProcessed += batch.Count;
                        AnalyticsMetrics.LastFlush = DateTime.UtcNow;

                        batch.Clear();
                        lastFlushTime = DateTime.UtcNow;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception encountered in Telemetry Queue processor loop.");
                    AnalyticsMetrics.WorkerStatus = "Degraded";
                }
            }

            AnalyticsMetrics.WorkerStatus = "Stopped";
            _logger.LogInformation("Analytics Telemetry Queue Background Processor Stopped.");
        }

        private async Task ProcessBatchAsync(List<TelemetryPayload> payloads)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var settings = await _settingsService.GetSettingsAsync();

            var tracksToSave = new List<VisitorTrack>();
            var sessionsToSave = new List<VisitorSession>();
            var visitsToSave = new List<PageVisit>();
            var eventsToSave = new List<VisitorEvent>();

            foreach (var payload in payloads)
            {
                // 1. Bot Filtering Check
                var isHeadless = payload.MetadataJson != null && payload.MetadataJson.Contains("\"headless\":true");
                if (settings.IgnoreBots && _botDetectionService.IsBot(payload.UserAgent, payload.IpAddress, isHeadless))
                {
                    continue;
                }

                // 2. Localhost Filtering Check
                if (settings.IgnoreLocalhost && (payload.IpAddress == "127.0.0.1" || payload.IpAddress == "::1" || payload.IpAddress.StartsWith("192.168.")))
                {
                    continue;
                }

                // 3. Resolve Geolocation details
                IpLocationResult? geoResult = null;
                if (settings.EnableGeoLookup)
                {
                    geoResult = await _ipLookupService.LookupAsync(payload.IpAddress);
                }

                // 4. Resolve Device & Browser details
                var uaResult = _userAgentService.Parse(payload.UserAgent);

                // 5. Mask IP address to satisfy privacy policy / GDPR
                var maskedIp = MaskIpAddress(payload.IpAddress);

                // 6. Find or Create Visitor Record
                var visitor = await dbContext.VisitorTracks
                    .Include(vt => vt.Sessions)
                    .FirstOrDefaultAsync(vt => vt.VisitorCookieId == payload.VisitorCookieId)
                    ?? tracksToSave.FirstOrDefault(vt => vt.VisitorCookieId == payload.VisitorCookieId);

                if (visitor == null)
                {
                    visitor = new VisitorTrack
                    {
                        VisitorCookieId = payload.VisitorCookieId,
                        IpAddress = maskedIp,
                        Country = geoResult?.Country ?? "Unknown",
                        City = geoResult?.City ?? "Unknown",
                        Region = geoResult?.Region ?? "Unknown",
                        Latitude = geoResult?.Latitude ?? "0.0",
                        Longitude = geoResult?.Longitude ?? "0.0",
                        TimeZone = geoResult?.TimeZone ?? "UTC",
                        DeviceType = uaResult.DeviceType,
                        OperatingSystem = uaResult.OperatingSystem,
                        OSVersion = uaResult.OSVersion,
                        BrowserFamily = uaResult.BrowserFamily,
                        BrowserVersion = uaResult.BrowserVersion,
                        Engine = uaResult.Engine,
                        EngineVersion = uaResult.EngineVersion,
                        Language = payload.Language ?? "en-US",
                        ScreenResolution = payload.ScreenResolution ?? "Unknown",
                        FirstVisitDate = DateTime.UtcNow
                    };
                    tracksToSave.Add(visitor);
                }

                // 7. Find or Create Session Record
                var session = await dbContext.VisitorSessions
                    .Include(vs => vs.PageVisits)
                    .FirstOrDefaultAsync(vs => vs.SessionCookieId == payload.SessionCookieId)
                    ?? sessionsToSave.FirstOrDefault(vs => vs.SessionCookieId == payload.SessionCookieId);

                if (session == null)
                {
                    // Detect traffic channel
                    var isDirect = string.IsNullOrEmpty(payload.ReferrerUrl) || payload.ReferrerUrl == "direct";
                    string? referralDomain = null;
                    string? searchEngine = null;
                    string? socialMedia = null;

                    if (!isDirect && !string.IsNullOrEmpty(payload.ReferrerUrl))
                    {
                        try
                        {
                            var uri = new Uri(payload.ReferrerUrl);
                            referralDomain = uri.Host;
                            
                            // Detect standard search engine domains
                            if (referralDomain.Contains("google.")) searchEngine = "Google";
                            else if (referralDomain.Contains("bing.")) searchEngine = "Bing";
                            else if (referralDomain.Contains("yahoo.")) searchEngine = "Yahoo";
                            else if (referralDomain.Contains("duckduckgo.")) searchEngine = "DuckDuckGo";

                            // Detect standard social platforms
                            if (referralDomain.Contains("facebook.com") || referralDomain.Contains("fb.com")) socialMedia = "Facebook";
                            else if (referralDomain.Contains("linkedin.com")) socialMedia = "LinkedIn";
                            else if (referralDomain.Contains("t.co") || referralDomain.Contains("twitter.com") || referralDomain.Contains("x.com")) socialMedia = "X (Twitter)";
                            else if (referralDomain.Contains("reddit.com")) socialMedia = "Reddit";
                            else if (referralDomain.Contains("t.me") || referralDomain.Contains("telegram")) socialMedia = "Telegram";
                        }
                        catch
                        {
                            referralDomain = payload.ReferrerUrl;
                        }
                    }

                    // Parse UTM campaigns from query string
                    string? utmSource = null, utmMedium = null, utmCampaign = null, utmContent = null, utmTerm = null;
                    if (!string.IsNullOrEmpty(payload.QueryString))
                    {
                        var qs = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(payload.QueryString);
                        if (qs.TryGetValue("utm_source", out var src)) utmSource = src;
                        if (qs.TryGetValue("utm_medium", out var med)) utmMedium = med;
                        if (qs.TryGetValue("utm_campaign", out var cam)) utmCampaign = cam;
                        if (qs.TryGetValue("utm_content", out var con)) utmContent = con;
                        if (qs.TryGetValue("utm_term", out var trm)) utmTerm = trm;
                    }

                    session = new VisitorSession
                    {
                        VisitorTrack = visitor,
                        SessionCookieId = payload.SessionCookieId,
                        StartedAt = payload.Timestamp,
                        LastActivityAt = payload.Timestamp,
                        ReferrerUrl = payload.ReferrerUrl,
                        ReferralDomain = referralDomain,
                        IsDirectVisit = isDirect,
                        SearchEngine = searchEngine,
                        SocialMediaPlatform = socialMedia,
                        UtmSource = utmSource,
                        UtmMedium = utmMedium,
                        UtmCampaign = utmCampaign,
                        UtmContent = utmContent,
                        UtmTerm = utmTerm,
                        IsBounce = true
                    };
                    sessionsToSave.Add(session);
                }

                // 8. Process Page Views
                if (payload.IsPageview)
                {
                    var isFirstPage = session.PagesVisitedCount == 0;
                    
                    // Mark previous page as IsExitPage = false
                    foreach (var pv in session.PageVisits)
                    {
                        pv.IsExitPage = false;
                    }

                    var pageVisit = new PageVisit
                    {
                        VisitorSession = session,
                        PagePath = payload.PagePath,
                        PageTitle = payload.PageTitle,
                        QueryString = payload.QueryString,
                        StatusCode = 200, // Default success code
                        EntryTime = payload.Timestamp,
                        LoadTimeMilliseconds = payload.LoadTimeMilliseconds,
                        ViewportWidth = payload.ViewportWidth,
                        ViewportHeight = payload.ViewportHeight,
                        IsEntryPage = isFirstPage,
                        IsExitPage = true
                    };

                    visitsToSave.Add(pageVisit);
                    session.PagesVisitedCount++;
                    session.LastActivityAt = payload.Timestamp;
                    
                    if (session.PagesVisitedCount > 1)
                    {
                        session.IsBounce = false; // Visiting more than 1 page voids bounce status
                    }
                }

                // 9. Process Custom Action Events
                if (payload.IsEvent && !string.IsNullOrEmpty(payload.EventName) && settings.EnableEventTracking)
                {
                    var visitorEvent = new VisitorEvent
                    {
                        VisitorSession = session,
                        EventName = payload.EventName,
                        EventCategory = payload.EventCategory ?? "Custom",
                        PagePath = payload.PagePath,
                        TargetElementId = payload.TargetElementId,
                        TargetText = payload.TargetText,
                        TargetUrl = payload.TargetUrl,
                        Value = payload.EventValue,
                        MetadataJson = payload.MetadataJson,
                        Timestamp = payload.Timestamp
                    };

                    eventsToSave.Add(visitorEvent);
                    session.EventsTriggeredCount++;
                    session.LastActivityAt = payload.Timestamp;
                    session.IsBounce = false; // Triggering any interactive event voids bounce status
                }

                // 10. Process Heartbeat Time Updates
                if (payload.IsHeartbeat)
                {
                    session.LastActivityAt = payload.Timestamp;
                    session.VisitDurationSeconds = (int)(payload.Timestamp - session.StartedAt).TotalSeconds;

                    // Update time spent on the last active page visit
                    var lastPage = session.PageVisits.OrderByDescending(pv => pv.EntryTime).FirstOrDefault();
                    if (lastPage == null)
                    {
                        // Fallback: check db context
                        lastPage = await dbContext.PageVisits
                            .Where(pv => pv.VisitorSessionId == session.Id)
                            .OrderByDescending(pv => pv.EntryTime)
                            .FirstOrDefaultAsync();
                    }

                    if (lastPage != null)
                    {
                        lastPage.DurationSeconds = (int)(payload.Timestamp - lastPage.EntryTime).TotalSeconds;
                    }
                }
            }

            // Save records to database with resilience policy
            if (tracksToSave.Count > 0 || sessionsToSave.Count > 0 || visitsToSave.Count > 0 || eventsToSave.Count > 0)
            {
                var success = await SaveToDatabaseWithRetryAsync(dbContext, tracksToSave, sessionsToSave, visitsToSave, eventsToSave);
                if (success)
                {
                    // Push live stats to dashboard via SignalR
                    try
                    {
                        var liveCount = await dbContext.VisitorSessions
                            .Where(vs => vs.LastActivityAt >= DateTime.UtcNow.AddMinutes(-5))
                            .CountAsync();

                        await _hubContext.Clients.All.SendAsync("ReceiveLiveAnalytics", new
                        {
                            LiveVisitorsCount = liveCount,
                            EventName = eventsToSave.LastOrDefault()?.EventName ?? "Page View",
                            PagePath = visitsToSave.LastOrDefault()?.PagePath ?? "/"
                        });
                    }
                    catch
                    {
                        // Fail silently on Hub network anomalies
                    }
                }
                else
                {
                    // If DB fails persistently, write payloads to Dead Letter Queue (DLQ) file
                    await WriteToDeadLetterQueueAsync(payloads);
                }
            }
        }

        private async Task<bool> SaveToDatabaseWithRetryAsync(
            ApplicationDbContext dbContext,
            List<VisitorTrack> tracks,
            List<VisitorSession> sessions,
            List<PageVisit> visits,
            List<VisitorEvent> events)
        {
            var retries = 3;
            var delay = 1000; // 1 second backoff

            for (int i = 0; i < retries; i++)
            {
                try
                {
                    if (tracks.Count > 0) dbContext.VisitorTracks.AddRange(tracks);
                    if (sessions.Count > 0) dbContext.VisitorSessions.AddRange(sessions);
                    if (visits.Count > 0) dbContext.PageVisits.AddRange(visits);
                    if (events.Count > 0) dbContext.VisitorEvents.AddRange(events);

                    await dbContext.SaveChangesAsync();
                    return true; // Successfully saved
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Save operation to database failed. Retry {RetryCount} of {MaxRetries}...", i + 1, retries);
                    AnalyticsMetrics.RetryCount++;
                    await Task.Delay(delay);
                    delay *= 2; // Exponential backoff
                }
            }

            // Alert admin via SignalR about SQL Offline outage
            try
            {
                await _hubContext.Clients.All.SendAsync("ReceiveAnalyticsAlert", new
                {
                    Type = "SQL Offline",
                    Message = "Database is currently down. Writing data batch to Dead Letter Queue backup file.",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch { }

            return false;
        }

        private async Task WriteToDeadLetterQueueAsync(List<TelemetryPayload> payloads)
        {
            try
            {
                var dlqJson = JsonSerializer.Serialize(payloads);
                // Thread-safe async file appending
                await File.AppendAllTextAsync(_dlqPath, dlqJson + Environment.NewLine);
                UpdateDlqMetrics();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to write database batch payload to Dead Letter Queue backup file.");
            }
        }

        private void UpdateDlqMetrics()
        {
            try
            {
                if (File.Exists(_dlqPath))
                {
                    var fileInfo = new FileInfo(_dlqPath);
                    AnalyticsMetrics.DlqSize = fileInfo.Length;
                }
                else
                {
                    AnalyticsMetrics.DlqSize = 0;
                }
            }
            catch
            {
                // Fail silently
            }
        }

        private string MaskIpAddress(string ipAddress)
        {
            if (string.IsNullOrEmpty(ipAddress)) return "Unknown";
            
            // IPv4 Masking (192.168.1.123 -> 192.168.1.xxx)
            if (ipAddress.Contains("."))
            {
                var parts = ipAddress.Split('.');
                if (parts.Length == 4)
                {
                    return $"{parts[0]}.{parts[1]}.{parts[2]}.xxx";
                }
            }
            // IPv6 Masking (fe80::1ff:fe23:4567:890a -> fe80::1ff:fe23:xxxx:xxxx)
            else if (ipAddress.Contains(":"))
            {
                var parts = ipAddress.Split(':');
                if (parts.Length > 2)
                {
                    return string.Join(':', parts.Take(parts.Length - 2)) + ":xxxx:xxxx";
                }
            }

            return "Masked";
        }
    }
}
