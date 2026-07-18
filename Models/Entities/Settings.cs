using System.ComponentModel.DataAnnotations;

namespace FuturisticPortfolio.Models.Entities
{
    public class Settings
    {
        public int Id { get; set; }

        // General Site Info
        [Required]
        [StringLength(100)]
        public string SiteName { get; set; } = "Futuristic Portfolio";
        public string? LogoPath { get; set; }
        public string? FaviconPath { get; set; }
        public string Theme { get; set; } = "dark"; // "dark" or "light"
        public string PrimaryColorHex { get; set; } = "#a855f7"; // Neon theme main color
        public string? FooterText { get; set; } = "© 2026 Developer Portfolio. All rights reserved.";

        // SEO Info
        public string? MetaTitle { get; set; } = "Futuristic Developer Portfolio";
        public string? MetaDescription { get; set; } = "Premium Portfolio of a Senior Software Architect and Developer.";
        public string? GoogleAnalyticsId { get; set; }

        // About Me Section
        public string? AboutPicturePath { get; set; }
        public string? Biography { get; set; } // Rich HTML text
        public int YearsOfExperience { get; set; } = 5;
        public string? EducationShort { get; set; }
        public string? Journey { get; set; } // Long text
        public string? Goals { get; set; } // Long text
        public string? CvFilePath { get; set; } // Download CV file path

        // Contact Info (for display and SMTP)
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactAddress { get; set; }
        public string? OpenStreetMapEmbedUrl { get; set; }

        // SMTP Email Settings (for replying to messages)
        public string? SmtpHost { get; set; }
        public int SmtpPort { get; set; } = 587;
        public string? SmtpUsername { get; set; }
        public string? SmtpPassword { get; set; }
        public bool SmtpEnableSsl { get; set; } = true;
        
        // CV Download Counter
        public int CvDownloadCount { get; set; }
    }
}
