using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Certificate
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string Organization { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        [Required]
        public string ImagePath { get; set; } = "/images/placeholder.png";

        public string? PdfPath { get; set; }
    }
}
