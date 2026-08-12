using System;
using System.Collections.Generic;

namespace FuturisticPortfolio.Analytics.Application.Models
{
    public class AnalyticsDashboardViewModel
    {
        // KPI Totals
        public int TotalUniqueVisitors { get; set; }
        public int TotalPageViews { get; set; }
        public int ActiveOnlineVisitors { get; set; }
        public int ReturningVisitorsCount { get; set; }
        public double BounceRatePercentage { get; set; }
        public double AverageSessionDurationSeconds { get; set; }

        // Date boundaries
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // Chart Data Lists
        public List<ChartDataPoint> DailyVisitorTrend { get; set; } = new();
        public List<ChartDataPoint> DeviceDistribution { get; set; } = new();
        public List<ChartDataPoint> BrowserDistribution { get; set; } = new();
        public List<ChartDataPoint> OperatingSystemDistribution { get; set; } = new();
        public List<ChartDataPoint> TopTrafficSources { get; set; } = new();

        // Tables Data Lists
        public List<TopItemMetric> MostViewedPages { get; set; } = new();
        public List<TopItemMetric> MostViewedProjects { get; set; } = new();
        public List<TopItemMetric> TopCountries { get; set; } = new();
        public List<TopItemMetric> TopCities { get; set; } = new();
        public List<LatestVisitorSessionInfo> LatestSessions { get; set; } = new();
    }

    public class ChartDataPoint
    {
        public string Label { get; set; } = string.Empty;
        public double Value { get; set; }
    }

    public class TopItemMetric
    {
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }

    public class LatestVisitorSessionInfo
    {
        public Guid SessionCookieId { get; set; }
        public string VisitorCookieId { get; set; } = string.Empty;
        public string Country { get; set; } = "Unknown";
        public string City { get; set; } = "Unknown";
        public string DeviceType { get; set; } = "Desktop";
        public string Browser { get; set; } = "Chrome";
        public DateTime StartedAt { get; set; }
        public int DurationSeconds { get; set; }
        public int PagesVisited { get; set; }
        public int EventsTriggered { get; set; }
        public bool IsBounce { get; set; }
    }
}
