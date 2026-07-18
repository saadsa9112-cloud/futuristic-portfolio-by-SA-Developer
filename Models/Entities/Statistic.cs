using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Statistic
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        public int Value { get; set; }

        [StringLength(100)]
        public string IconClass { get; set; } = "fas fa-chart-line";

        public int DisplayOrder { get; set; }
    }
}
