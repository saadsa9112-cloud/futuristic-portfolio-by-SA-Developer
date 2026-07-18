using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Testimonial
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string ClientName { get; set; } = string.Empty;

        [StringLength(100)]
        public string ClientTitle { get; set; } = string.Empty; // e.g. "CEO at TechCorp"

        [Required]
        [StringLength(1000)]
        public string Feedback { get; set; } = string.Empty;

        public string ClientImagePath { get; set; } = "/images/default-avatar.png";

        [Range(1, 5)]
        public int Rating { get; set; } = 5;
    }
}
