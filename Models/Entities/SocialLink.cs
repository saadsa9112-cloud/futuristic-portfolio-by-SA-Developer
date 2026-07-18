using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class SocialLink
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string PlatformName { get; set; } = string.Empty;

        [Required]
        [Url]
        public string Url { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string IconClass { get; set; } = "fab fa-github";
    }
}
