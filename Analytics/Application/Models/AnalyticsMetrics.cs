using System;

namespace FuturisticPortfolio.Analytics.Application.Models
{
    public static class AnalyticsMetrics
    {
        public static int QueueSize { get; set; }
        public static int Capacity { get; set; } = 10000;
        public static long DlqSize { get; set; }
        public static DateTime? LastFlush { get; set; }
        public static double ProcessingRate { get; set; } // items per second
        public static long DroppedEvents { get; set; }
        public static long RetryCount { get; set; }
        public static string WorkerStatus { get; set; } = "Initializing";
        public static long TotalProcessed { get; set; }
        public static DateTime StartedAt { get; } = DateTime.UtcNow;
    }
}
