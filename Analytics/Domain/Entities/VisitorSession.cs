using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class VisitorSession
    {
        public int Id { get; set; }

        [Required]
        public int VisitorTrackId { get; set; }
        public VisitorTrack VisitorTrack { get; set; } = null!;

        [Required]
        public Guid SessionCookieId { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? EndedAt { get; set; }

        public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;

        public int VisitDurationSeconds { get; set; }

        public int PagesVisitedCount { get; set; }

        public int EventsTriggeredCount { get; set; }

        public bool IsBounce { get; set; } = true;

        [StringLength(1000)]
        public string? ReferrerUrl { get; set; }

        [StringLength(250)]
        public string? ReferralDomain { get; set; }

        public bool IsDirectVisit { get; set; }

        [StringLength(150)]
        public string? SearchEngine { get; set; }

        [StringLength(150)]
        public string? SocialMediaPlatform { get; set; }

        [StringLength(150)]
        public string? UtmSource { get; set; }

        [StringLength(150)]
        public string? UtmMedium { get; set; }

        [StringLength(150)]
        public string? UtmCampaign { get; set; }

        [StringLength(250)]
        public string? UtmContent { get; set; }

        [StringLength(250)]
        public string? UtmTerm { get; set; }

        // Navigation properties
        public ICollection<PageVisit> PageVisits { get; set; } = new List<PageVisit>();
        public ICollection<VisitorEvent> VisitorEvents { get; set; } = new List<VisitorEvent>();
    }
}
