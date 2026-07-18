using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Education
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Institution { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Degree { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}
