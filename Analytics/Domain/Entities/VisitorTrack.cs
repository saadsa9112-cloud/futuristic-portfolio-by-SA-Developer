using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Analytics.Domain.Entities
{
    public class VisitorTrack
    {
        public int Id { get; set; }

        [Required]
        public Guid VisitorCookieId { get; set; }

        [Required]
        [StringLength(100)]
        public string IpAddress { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Country { get; set; }

        [StringLength(100)]
        public string? City { get; set; }

        [StringLength(100)]
        public string? Region { get; set; }

        [StringLength(50)]
        public string? Latitude { get; set; }

        [StringLength(50)]
        public string? Longitude { get; set; }

        [StringLength(100)]
        public string? TimeZone { get; set; }

        [Required]
        [StringLength(50)]
        public string DeviceType { get; set; } = "Desktop";

        [StringLength(100)]
        public string? OperatingSystem { get; set; }

        [StringLength(50)]
        public string? OSVersion { get; set; }

        [StringLength(100)]
        public string? BrowserFamily { get; set; }

        [StringLength(50)]
        public string? BrowserVersion { get; set; }

        [StringLength(100)]
        public string? Engine { get; set; }

        [StringLength(50)]
        public string? EngineVersion { get; set; }

        [StringLength(50)]
        public string? Language { get; set; }

        [StringLength(50)]
        public string? ScreenResolution { get; set; }

        public DateTime FirstVisitDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<VisitorSession> Sessions { get; set; } = new List<VisitorSession>();
    }
}
