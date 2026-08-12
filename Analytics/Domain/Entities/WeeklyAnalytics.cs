using System;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class WeeklyAnalytics
    {
        public int Id { get; set; }
        public DateTime WeekStartDate { get; set; }
        public int UniqueVisitorsCount { get; set; }
        public int TotalPageViews { get; set; }
        public int TotalEvents { get; set; }
        public int AvgSessionDurationSeconds { get; set; }
        public double BounceRate { get; set; }
    }
}
