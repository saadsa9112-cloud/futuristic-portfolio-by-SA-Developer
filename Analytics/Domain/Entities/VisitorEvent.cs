using System;
using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class VisitorEvent
    {
        public int Id { get; set; }

        [Required]
        public int VisitorSessionId { get; set; }
        public VisitorSession VisitorSession { get; set; } = null!;

        [Required]
        [StringLength(150)]
        public string EventName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string EventCategory { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string PagePath { get; set; } = string.Empty;

        [StringLength(250)]
        public string? TargetElementId { get; set; }

        [StringLength(500)]
        public string? TargetText { get; set; }

        [StringLength(1000)]
        public string? TargetUrl { get; set; }

        public decimal? Value { get; set; }

        public string? MetadataJson { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
