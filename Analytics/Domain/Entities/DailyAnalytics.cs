using System;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class DailyAnalytics
    {
        public int Id { get; set; }
        public DateTime TargetDate { get; set; }
        public int UniqueVisitorsCount { get; set; }
        public int TotalPageViews { get; set; }
        public int TotalEvents { get; set; }
        public int AvgSessionDurationSeconds { get; set; }
        public double BounceRate { get; set; }
    }
}
