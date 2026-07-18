using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class ActivityLog
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Action { get; set; } = string.Empty; // e.g. "Add Project", "Update About"

        public string? Details { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string IpAddress { get; set; } = string.Empty;
    }
}
