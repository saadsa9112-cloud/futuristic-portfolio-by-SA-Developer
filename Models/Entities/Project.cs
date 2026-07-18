using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(500)]
        public string Subtitle { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? Technologies { get; set; } // Comma-separated tags (e.g. "C#, ASP.NET, EF Core")

        [Url]
        public string? GitHubLink { get; set; }

        [Url]
        public string? LiveDemo { get; set; }

        public string? DocumentationPdfPath { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Published"; // "Draft" or "Published"

        public bool FeaturedOption { get; set; }

        public int DisplayOrder { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        public string ThumbnailPath { get; set; } = "/images/placeholder.png";

        public int? CategoryId { get; set; }
        public virtual Category? Category { get; set; }

        // Details Case Study Section
        public string? Challenges { get; set; }
        public string? Solutions { get; set; }
        public string? ArchitectureDescription { get; set; }
        public string? DatabaseDesignDescription { get; set; }
        public string? TimelineDescription { get; set; }

        // Navigation
        public virtual ICollection<ProjectImage> ProjectImages { get; set; } = new List<ProjectImage>();
        public virtual ICollection<ProjectVideo> ProjectVideos { get; set; } = new List<ProjectVideo>();
        
        // Counter fields
        public int ViewCount { get; set; }
    }
}
