using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Visitor
    {
        public int Id { get; set; }

        [StringLength(100)]
        public string IpAddress { get; set; } = string.Empty;

        public string? UserAgent { get; set; }

        public DateTime VisitDate { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string PagePath { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Country { get; set; } = "Unknown";

        public int TimeSpentSeconds { get; set; } = 0;
    }
}
