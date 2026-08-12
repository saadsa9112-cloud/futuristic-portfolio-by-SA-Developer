using System;
using System.Threading.Tasks;
using FuturisticPortfolio.Analytics.Application.Models;
using FuturisticPortfolio.Analytics.Infrastructure.Background;
using FuturisticPortfolio.Analytics.Infrastructure.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Analytics.API
{
    [ApiController]
    [Route("api/telemetry")]
    [EnableCors("AllowAllOrigins")]
    public class TelemetryController : ControllerBase
    {
        private readonly ITelemetryQueue _queue;
        private readonly IAnalyticsSettingsService _settingsService;
        private const string VisitorCookieKey = "_hms_visitor_id";
        private const string SessionCookieKey = "_hms_session_id";

        public TelemetryController(ITelemetryQueue queue, IAnalyticsSettingsService settingsService)
        {
            _queue = queue;
            _settingsService = settingsService;
        }

        [HttpOptions("{*path}")]
        public IActionResult OptionsHandler()
        {
            Response.Headers["Access-Control-Allow-Origin"] = "*";
            Response.Headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
            Response.Headers["Access-Control-Allow-Headers"] = "Content-Type, bypass-tunnel-reminder, ngrok-skip-browser-warning";
            return Ok();
        }

        [HttpPost("pageview")]
        public async Task<IActionResult> LogPageView([FromBody] ClientTelemetryRequest request)
        {
            var settings = await _settingsService.GetSettingsAsync();
            if (!settings.EnableTracking)
            {
                return Ok(new { status = "Disabled" });
            }

            var (visitorId, sessionId) = EstablishCookies();

            var payload = new TelemetryPayload
            {
                VisitorCookieId = visitorId,
                SessionCookieId = sessionId,
                PagePath = request.PagePath ?? "/",
                PageTitle = request.PageTitle ?? "Untitled",
                QueryString = request.QueryString,
                ReferrerUrl = request.ReferrerUrl,
                Language = request.Language,
                ScreenResolution = request.ScreenResolution,
                ViewportWidth = request.ViewportWidth,
                ViewportHeight = request.ViewportHeight,
                LoadTimeMilliseconds = request.LoadTime,
                IpAddress = GetClientIpAddress(),
                UserAgent = Request.Headers.UserAgent.ToString(),
                Timestamp = DateTime.UtcNow,
                IsPageview = true
            };

            _queue.Enqueue(payload);
            return Ok(new { status = "Queued" });
        }

        [HttpPost("event")]
        public async Task<IActionResult> LogEvent([FromBody] ClientTelemetryRequest request)
        {
            var settings = await _settingsService.GetSettingsAsync();
            if (!settings.EnableTracking || !settings.EnableEventTracking)
            {
                return Ok(new { status = "Disabled" });
            }

            var (visitorId, sessionId) = EstablishCookies();

            var payload = new TelemetryPayload
            {
                VisitorCookieId = visitorId,
                SessionCookieId = sessionId,
                PagePath = request.PagePath ?? "/",
                PageTitle = request.PageTitle ?? "Untitled",
                IpAddress = GetClientIpAddress(),
                UserAgent = Request.Headers.UserAgent.ToString(),
                Timestamp = DateTime.UtcNow,
                IsEvent = true,
                EventName = request.EventName ?? "Unknown Event",
                EventCategory = request.EventCategory ?? "Custom",
                TargetElementId = request.TargetElementId,
                TargetText = request.TargetText,
                TargetUrl = request.TargetUrl,
                EventValue = request.EventValue,
                MetadataJson = request.MetadataJson
            };

            _queue.Enqueue(payload);
            return Ok(new { status = "Queued" });
        }

        [HttpPost("heartbeat")]
        public async Task<IActionResult> LogHeartbeat([FromBody] ClientTelemetryRequest request)
        {
            var settings = await _settingsService.GetSettingsAsync();
            if (!settings.EnableTracking)
            {
                return Ok(new { status = "Disabled" });
            }

            var (visitorId, sessionId) = EstablishCookies();

            var payload = new TelemetryPayload
            {
                VisitorCookieId = visitorId,
                SessionCookieId = sessionId,
                PagePath = request.PagePath ?? "/",
                PageTitle = request.PageTitle ?? "Untitled",
                IpAddress = GetClientIpAddress(),
                UserAgent = Request.Headers.UserAgent.ToString(),
                Timestamp = DateTime.UtcNow,
                IsHeartbeat = true
            };

            _queue.Enqueue(payload);
            return Ok(new { status = "Queued" });
        }

        private (Guid visitorId, Guid sessionId) EstablishCookies()
        {
            // 1. Establish Long-lived Visitor Cookie (1 Year)
            Guid visitorId;
            if (Request.Cookies.TryGetValue(VisitorCookieKey, out var visitorCookieStr) && Guid.TryParse(visitorCookieStr, out var parsedVisitorId))
            {
                visitorId = parsedVisitorId;
            }
            else
            {
                visitorId = Guid.NewGuid();
                var cookieOptions = new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddYears(1),
                    HttpOnly = false, // Set to false so JS telemetry script can read it if needed
                    Secure = Request.IsHttps,
                    SameSite = SameSiteMode.Lax
                };
                Response.Cookies.Append(VisitorCookieKey, visitorId.ToString(), cookieOptions);
            }

            // 2. Establish Sliding Session Cookie (30 Minutes)
            Guid sessionId;
            if (Request.Cookies.TryGetValue(SessionCookieKey, out var sessionCookieStr) && Guid.TryParse(sessionCookieStr, out var parsedSessionId))
            {
                sessionId = parsedSessionId;
            }
            else
            {
                sessionId = Guid.NewGuid();
            }

            // Always update session cookie to slide the expiration window (30 mins)
            var sessionOptions = new CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddMinutes(30),
                HttpOnly = false,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax
            };
            Response.Cookies.Append(SessionCookieKey, sessionId.ToString(), sessionOptions);

            return (visitorId, sessionId);
        }

        private string GetClientIpAddress()
        {
            // Check Cloudflare header first
            if (Request.Headers.TryGetValue("CF-Connecting-IP", out var cfIp) && !string.IsNullOrWhiteSpace(cfIp))
            {
                return cfIp.ToString().Trim();
            }

            // Check X-Real-IP
            if (Request.Headers.TryGetValue("X-Real-IP", out var realIp) && !string.IsNullOrWhiteSpace(realIp))
            {
                return realIp.ToString().Trim();
            }

            // Check X-Forwarded-For header for reverse proxies / Localtunnel / Ngrok
            if (Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedIp) && !string.IsNullOrWhiteSpace(forwardedIp))
            {
                var ips = forwardedIp.ToString().Split(',');
                foreach (var ip in ips)
                {
                    var cleanIp = ip.Trim();
                    if (!string.IsNullOrEmpty(cleanIp) && cleanIp != "::1" && cleanIp != "127.0.0.1" && !cleanIp.StartsWith("192.168."))
                    {
                        return cleanIp;
                    }
                }
                return ips[0].Trim();
            }

            return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        }

        public class ClientTelemetryRequest
        {
            public string? PagePath { get; set; }
            public string? PageTitle { get; set; }
            public string? QueryString { get; set; }
            public string? ReferrerUrl { get; set; }
            public string? Language { get; set; }
            public string? ScreenResolution { get; set; }
            public int ViewportWidth { get; set; }
            public int ViewportHeight { get; set; }
            public int LoadTime { get; set; }

            // Event fields
            public string? EventName { get; set; }
            public string? EventCategory { get; set; }
            public string? TargetElementId { get; set; }
            public string? TargetText { get; set; }
            public string? TargetUrl { get; set; }
            public decimal? EventValue { get; set; }
            public string? MetadataJson { get; set; }
        }
    }
}
