using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Skill
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Range(0, 100)]
        public int Percentage { get; set; }

        [StringLength(100)]
        public string IconClass { get; set; } = "fas fa-code"; // e.g. "fab fa-html5"

        [StringLength(50)]
        public string ColorHex { get; set; } = "#a855f7"; // Neon hex (e.g. purple, blue, cyan)

        public int DisplayOrder { get; set; }
    }
}
