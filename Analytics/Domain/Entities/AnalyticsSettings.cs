using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class AnalyticsSettings
    {
        public int Id { get; set; }

        public bool EnableTracking { get; set; } = true;

        public bool EnableGeoLookup { get; set; } = true;

        public bool EnableEventTracking { get; set; } = true;

        public bool EnableHeatmaps { get; set; } = false;

        public bool IgnoreAdminUsers { get; set; } = true;

        public bool IgnoreLocalhost { get; set; } = false;

        public bool IgnoreBots { get; set; } = true;

        public int QueueBatchSize { get; set; } = 10;

        public int FlushIntervalSeconds { get; set; } = 5;

        [StringLength(100)]
        public string? GoogleAnalyticsId { get; set; }

        [StringLength(100)]
        public string? MicrosoftClarityId { get; set; }

        // Data Lifecycle Policies
        public int RetentionDays { get; set; } = 90;

        [Required]
        [StringLength(50)]
        public string RetentionAction { get; set; } = "Archive"; // Archive, Compress, Delete, ExportBeforeDelete

        [StringLength(500)]
        public string ArchiveFolderPath { get; set; } = "App_Data/Analytics/Archive";
    }
}
