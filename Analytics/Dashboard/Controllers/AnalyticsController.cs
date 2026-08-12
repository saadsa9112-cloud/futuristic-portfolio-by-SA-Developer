using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using FuturisticPortfolio.Analytics.Application.Models;
using FuturisticPortfolio.Analytics.Domain.Entities;
using FuturisticPortfolio.Analytics.Infrastructure.Services;
using FuturisticPortfolio.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FuturisticPortfolio.Analytics.Dashboard.Controllers
{
    // Adjust route as /Admin/Analytics for clean CMS navigation
    [Route("Admin/Analytics")]
    public class AnalyticsController : Controller
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IAnalyticsSettingsService _settingsService;

        public AnalyticsController(ApplicationDbContext dbContext, IAnalyticsSettingsService settingsService)
        {
            _dbContext = dbContext;
            _settingsService = settingsService;
        }

        [HttpGet("")]
        public async Task<IActionResult> Index(
            [FromQuery] string? dateRange,
            [FromQuery] string? deviceType,
            [FromQuery] string? country,
            [FromQuery] string? browser)
        {
            // Parse Date Boundaries
            var startDate = DateTime.UtcNow.AddDays(-30); // Default to last 30 days
            var endDate = DateTime.UtcNow;

            if (!string.IsNullOrEmpty(dateRange))
            {
                var parts = dateRange.Split('-');
                if (parts.Length == 2 && 
                    DateTime.TryParse(parts[0].Trim(), out var start) && 
                    DateTime.TryParse(parts[1].Trim(), out var end))
                {
                    startDate = start.Date;
                    endDate = end.Date.AddDays(1).AddSeconds(-1);
                }
                else
                {
                    startDate = dateRange switch
                    {
                        "today" => DateTime.UtcNow.Date,
                        "yesterday" => DateTime.UtcNow.AddDays(-1).Date,
                        "week" => DateTime.UtcNow.AddDays(-7).Date,
                        "month" => DateTime.UtcNow.AddDays(-30).Date,
                        "year" => DateTime.UtcNow.AddDays(-365).Date,
                        _ => DateTime.UtcNow.AddDays(-30).Date
                    };
                }
            }

            // Build Query
            var query = _dbContext.VisitorSessions
                .Include(vs => vs.VisitorTrack)
                .Include(vs => vs.PageVisits)
                .Include(vs => vs.VisitorEvents)
                .Where(vs => vs.StartedAt >= startDate && vs.StartedAt <= endDate);

            // Filter Application
            if (!string.IsNullOrEmpty(deviceType))
            {
                query = query.Where(vs => vs.VisitorTrack.DeviceType == deviceType);
            }
            if (!string.IsNullOrEmpty(country))
            {
                query = query.Where(vs => vs.VisitorTrack.Country == country);
            }
            if (!string.IsNullOrEmpty(browser))
            {
                query = query.Where(vs => vs.VisitorTrack.BrowserFamily == browser);
            }

            var sessions = await query.ToListAsync();

            // Calculate KPIs
            var totalPageViews = sessions.Sum(s => s.PagesVisitedCount);
            var uniqueVisitors = sessions.GroupBy(s => s.VisitorTrackId).Count();
            var returningVisitors = sessions.Count(s => s.VisitorTrack.FirstVisitDate < s.StartedAt.AddMinutes(-5));
            var bounceCount = sessions.Count(s => s.IsBounce);
            var bounceRate = sessions.Count > 0 ? (double)bounceCount / sessions.Count * 100 : 0.0;
            var avgDuration = sessions.Count > 0 ? sessions.Average(s => s.VisitDurationSeconds) : 0.0;

            // Get Online Count (active in past 5 minutes)
            var fiveMinsAgo = DateTime.UtcNow.AddMinutes(-5);
            var onlineCount = await _dbContext.VisitorSessions
                .CountAsync(vs => vs.LastActivityAt >= fiveMinsAgo);

            var model = new AnalyticsDashboardViewModel
            {
                TotalUniqueVisitors = uniqueVisitors,
                TotalPageViews = totalPageViews,
                ActiveOnlineVisitors = onlineCount,
                ReturningVisitorsCount = returningVisitors,
                BounceRatePercentage = bounceRate,
                AverageSessionDurationSeconds = avgDuration,
                StartDate = startDate,
                EndDate = endDate
            };

            // 1. Chart: Daily Trend
            model.DailyVisitorTrend = sessions
                .GroupBy(s => s.StartedAt.Date)
                .OrderBy(g => g.Key)
                .Select(g => new ChartDataPoint
                {
                    Label = g.Key.ToString("MM/dd"),
                    Value = g.Count()
                }).ToList();

            // 2. Chart: Device distribution
            model.DeviceDistribution = sessions
                .GroupBy(s => s.VisitorTrack.DeviceType)
                .Select(g => new ChartDataPoint { Label = g.Key ?? "Unknown", Value = g.Count() })
                .ToList();

            // 3. Chart: OS Distribution
            model.OperatingSystemDistribution = sessions
                .GroupBy(s => s.VisitorTrack.OperatingSystem ?? "Unknown")
                .Select(g => new ChartDataPoint { Label = g.Key, Value = g.Count() })
                .ToList();

            // 4. Chart: Browser Distribution
            model.BrowserDistribution = sessions
                .GroupBy(s => s.VisitorTrack.BrowserFamily ?? "Unknown")
                .Select(g => new ChartDataPoint { Label = g.Key, Value = g.Count() })
                .ToList();

            // 5. Chart: Traffic Sources
            model.TopTrafficSources = sessions
                .GroupBy(s => s.IsDirectVisit ? "Direct" : (s.SearchEngine ?? s.ReferralDomain ?? "Referral"))
                .Select(g => new ChartDataPoint { Label = g.Key, Value = g.Count() })
                .OrderByDescending(dp => dp.Value)
                .Take(5)
                .ToList();

            // 6. Table: Top Pages
            var allVisits = sessions.SelectMany(s => s.PageVisits).ToList();
            model.MostViewedPages = allVisits
                .GroupBy(v => v.PagePath)
                .Select(g => new TopItemMetric
                {
                    Name = g.Key,
                    Count = g.Count(),
                    Percentage = allVisits.Count > 0 ? (double)g.Count() / allVisits.Count * 100 : 0
                })
                .OrderByDescending(tp => tp.Count)
                .Take(8)
                .ToList();

            // 7. Table: Top Projects Clicked
            var allEvents = sessions.SelectMany(s => s.VisitorEvents).ToList();
            model.MostViewedProjects = allEvents
                .Where(e => e.EventName.Contains("Project") || e.EventName.Contains("Case Study"))
                .GroupBy(e => e.TargetText ?? e.TargetUrl ?? "Project Link")
                .Select(g => new TopItemMetric { Name = g.Key, Count = g.Count() })
                .OrderByDescending(e => e.Count)
                .Take(8)
                .ToList();

            // 8. Table: Top Locations
            model.TopCountries = sessions
                .GroupBy(s => s.VisitorTrack.Country ?? "Unknown")
                .Select(g => new TopItemMetric
                {
                    Name = g.Key,
                    Count = g.Count(),
                    Percentage = sessions.Count > 0 ? (double)g.Count() / sessions.Count * 100 : 0
                })
                .OrderByDescending(l => l.Count)
                .Take(5)
                .ToList();

            // 9. Table: Latest Sessions Grid
            model.LatestSessions = sessions
                .OrderByDescending(s => s.StartedAt)
                .Take(20)
                .Select(s => new LatestVisitorSessionInfo
                {
                    SessionCookieId = s.SessionCookieId,
                    VisitorCookieId = s.VisitorTrack.VisitorCookieId.ToString().Substring(0, 8) + "...",
                    Country = s.VisitorTrack.Country ?? "Unknown",
                    City = s.VisitorTrack.City ?? "Unknown",
                    DeviceType = s.VisitorTrack.DeviceType,
                    Browser = s.VisitorTrack.BrowserFamily ?? "Unknown",
                    StartedAt = s.StartedAt,
                    DurationSeconds = s.VisitDurationSeconds,
                    PagesVisited = s.PagesVisitedCount,
                    EventsTriggered = s.EventsTriggeredCount,
                    IsBounce = s.IsBounce
                }).ToList();

            // Lists for UI filter selectors
            ViewBag.Countries = await _dbContext.VisitorTracks.Select(vt => vt.Country).Where(c => c != null).Distinct().ToListAsync();
            ViewBag.Browsers = await _dbContext.VisitorTracks.Select(vt => vt.BrowserFamily).Where(b => b != null).Distinct().ToListAsync();

            return View(model);
        }

        [HttpGet("Health")]
        public IActionResult Health()
        {
            // Health Diagnostics Model
            var gcMemory = GC.GetTotalMemory(false) / 1024 / 1024; // MB
            ViewBag.GcMemoryUsage = gcMemory;

            return View();
        }

        [HttpGet("Settings")]
        public async Task<IActionResult> Settings()
        {
            var settings = await _settingsService.GetSettingsAsync();
            return View(settings);
        }

        [HttpPost("Settings")]
        public async Task<IActionResult> Settings(AnalyticsSettings model)
        {
            if (ModelState.IsValid)
            {
                await _settingsService.UpdateSettingsAsync(model);
                TempData["SuccessMessage"] = "Analytics Configuration updated successfully.";
                return RedirectToAction(nameof(Settings));
            }
            return View(model);
        }

        [HttpGet("Export/Csv")]
        public async Task<IActionResult> ExportCsv()
        {
            var sessions = await _dbContext.VisitorSessions
                .Include(vs => vs.VisitorTrack)
                .OrderByDescending(vs => vs.StartedAt)
                .Take(500)
                .ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("SessionID,VisitorID,StartedAt,Duration(s),PageViews,Events,Bounce,Device,Browser,Country,City,Referrer,Source,Campaign");

            foreach (var s in sessions)
            {
                csv.AppendLine($"{s.SessionCookieId},{s.VisitorTrack.VisitorCookieId},{s.StartedAt:yyyy-MM-dd HH:mm:ss},{s.VisitDurationSeconds},{s.PagesVisitedCount},{s.EventsTriggeredCount},{s.IsBounce},{s.VisitorTrack.DeviceType},{s.VisitorTrack.BrowserFamily},{s.VisitorTrack.Country},{s.VisitorTrack.City},{s.ReferralDomain},{s.UtmSource},{s.UtmCampaign}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            return File(bytes, "text/csv", $"Analytics_Export_{DateTime.UtcNow:yyyyMMdd}.csv");
        }

        [HttpGet("Export/Json")]
        public async Task<IActionResult> ExportJson()
        {
            var sessions = await _dbContext.VisitorSessions
                .Include(vs => vs.VisitorTrack)
                .Include(vs => vs.PageVisits)
                .Include(vs => vs.VisitorEvents)
                .OrderByDescending(vs => vs.StartedAt)
                .Take(200)
                .ToListAsync();

            var options = new JsonSerializerOptions { WriteIndented = true, ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles };
            var json = JsonSerializer.Serialize(sessions, options);
            var bytes = Encoding.UTF8.GetBytes(json);

            return File(bytes, "application/json", $"Analytics_Export_{DateTime.UtcNow:yyyyMMdd}.json");
        }
    }
}
