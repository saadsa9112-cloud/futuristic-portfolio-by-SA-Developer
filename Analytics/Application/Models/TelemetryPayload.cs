using System;

namespace FuturisticPortfolio.Analytics.Application.Models
{
    public class TelemetryPayload
    {
        public Guid VisitorCookieId { get; set; }
        public Guid SessionCookieId { get; set; }
        
        public string PagePath { get; set; } = string.Empty;
        public string PageTitle { get; set; } = string.Empty;
        public string? QueryString { get; set; }
        public string? ReferrerUrl { get; set; }
        
        public string? Language { get; set; }
        public string? ScreenResolution { get; set; }
        public int ViewportWidth { get; set; }
        public int ViewportHeight { get; set; }
        public int LoadTimeMilliseconds { get; set; }

        public string IpAddress { get; set; } = string.Empty;
        public string? UserAgent { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // Routing indicators
        public bool IsPageview { get; set; }
        public bool IsHeartbeat { get; set; }
        public bool IsEvent { get; set; }

        // Event specific fields
        public string? EventName { get; set; }
        public string? EventCategory { get; set; }
        public string? TargetElementId { get; set; }
        public string? TargetText { get; set; }
        public string? TargetUrl { get; set; }
        public decimal? EventValue { get; set; }
        public string? MetadataJson { get; set; }
    }
}
