using System;
using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class PageVisit
    {
        public int Id { get; set; }

        [Required]
        public int VisitorSessionId { get; set; }
        public VisitorSession VisitorSession { get; set; } = null!;

        [Required]
        [StringLength(500)]
        public string PagePath { get; set; } = string.Empty;

        [Required]
        [StringLength(250)]
        public string PageTitle { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? QueryString { get; set; }

        public int StatusCode { get; set; }

        public DateTime EntryTime { get; set; } = DateTime.UtcNow;

        public int DurationSeconds { get; set; }

        public int LoadTimeMilliseconds { get; set; }

        public int ViewportWidth { get; set; }

        public int ViewportHeight { get; set; }

        public bool IsEntryPage { get; set; }

        public bool IsExitPage { get; set; }
    }
}
