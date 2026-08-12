using System;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class MonthlyAnalytics
    {
        public int Id { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int UniqueVisitorsCount { get; set; }
        public int TotalPageViews { get; set; }
        public int TotalEvents { get; set; }
        public int AvgSessionDurationSeconds { get; set; }
        public double BounceRate { get; set; }
    }
}
