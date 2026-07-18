using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Blog
    {
        public int Id { get; set; }

        [Required]
        [StringLength(250)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(250)]
        public string Slug { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? ImagePath { get; set; }

        // SEO Meta Fields
        [StringLength(200)]
        public string? MetaTitle { get; set; }

        [StringLength(500)]
        public string? MetaDescription { get; set; }

        public string? Tags { get; set; } // Comma-separated tags (e.g. "WebDev, Dotnet")

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        public int? CategoryId { get; set; }
        public virtual Category? Category { get; set; }
        
        // Counter field
        public int ViewCount { get; set; }
    }
}
