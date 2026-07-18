using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // "Project" or "Blog"

        // Navigation properties
        public virtual ICollection<Project>? Projects { get; set; }
        public virtual ICollection<Blog>? Blogs { get; set; }
    }
}
