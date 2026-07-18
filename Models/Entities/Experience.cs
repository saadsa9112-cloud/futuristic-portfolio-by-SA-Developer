using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Experience
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Company { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Role { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public bool IsCurrent { get; set; }
    }
}
