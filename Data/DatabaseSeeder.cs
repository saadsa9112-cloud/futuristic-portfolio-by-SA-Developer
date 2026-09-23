using FuturisticPortfolio.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FuturisticPortfolio.Data
{
    public static class DatabaseSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();

            // 1. Apply Migrations if pending
            if ((await context.Database.GetPendingMigrationsAsync()).Any())
            {
                await context.Database.MigrateAsync();
            }

            // 2. Seed Admin Role
            const string adminRole = "Admin";
            if (!await roleManager.RoleExistsAsync(adminRole))
            {
                await roleManager.CreateAsync(new IdentityRole(adminRole));
            }

            // 3. Seed Admin User (Non-destructive)
            const string adminEmail = "saad.sa9112@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "Hafiz Muhammad Saad (HMS Developer)",
                    EmailConfirmed = true,
                    ProfilePicturePath = "/images/profile.png"
                };

                var initialPassword = configuration["AdminDefaultPassword"] ?? "Admin@123456!";
                var result = await userManager.CreateAsync(adminUser, initialPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRole);
                }
            }

            // 4. Seed Global Settings (Non-destructive: Only if missing)
            var settings = await context.Settings.FirstOrDefaultAsync();
            const string cvSummary = "<p>Motivated and detail-oriented <strong>Software Developer</strong> with knowledge of <strong>C#, ASP.NET Core MVC (.NET), PHP, HTML5, CSS3, JavaScript, SQL, and MySQL</strong>. Experienced in developing and enhancing web applications through academic and personal projects.</p><p>Passionate about building scalable software solutions, solving real-world problems, and continuously learning modern technologies.</p>";

            if (settings == null)
            {
                settings = new Settings
                {
                    SiteName = "Hafiz Muhammad Saad | Software Developer",
                    LogoPath = "/images/logo.png",
                    FaviconPath = "/favicon.ico",
                    CvFilePath = "/files/Muhammad_Saad_CV.pdf",
                    Theme = "dark",
                    PrimaryColorHex = "#8B3DFF",
                    FooterText = "© 2026 Hafiz Muhammad Saad. All Rights Reserved. Built with ASP.NET Core MVC.",
                    MetaTitle = "Hafiz Muhammad Saad | Full-Stack Software Developer",
                    MetaDescription = "Full-Stack Software Developer specializing in C#, ASP.NET Core MVC, SQL Server, Entity Framework Core, and modern web application development.",
                    Biography = cvSummary,
                    YearsOfExperience = 1,
                    EducationShort = "BSBC - Sohail University & ADSE - Aptech Learning, Karachi",
                    Journey = "Pursuing Bachelor of Science in Business Computing (BSBC) at Sohail University and Advanced Diploma in Software Engineering (ADSE) at Aptech Learning, focusing on modern software engineering, web development, object-oriented programming, databases, and cloud technologies.",
                    Goals = "Passionate about building scalable software solutions, solving real-world problems, and continuously learning modern technologies to contribute to innovative software development projects.",
                    ContactEmail = adminEmail,
                    ContactPhone = "+92 305 5188896",
                    ContactAddress = "Karachi, Pakistan",
                    OpenStreetMapEmbedUrl = "https://www.openstreetmap.org/export/embed.html?bbox=66.95%2C24.80%2C67.25%2C25.05&layer=mapnik"
                };
                await context.Settings.AddAsync(settings);
                await context.SaveChangesAsync();
            }

            // 5. Seed Categories (Only if missing)
            var defaultCat = await context.Categories.FirstOrDefaultAsync(c => c.Name == "ASP.NET Core MVC");
            if (defaultCat == null)
            {
                defaultCat = new Category { Name = "ASP.NET Core MVC", Type = "Project" };
                await context.Categories.AddAsync(defaultCat);
                await context.Categories.AddAsync(new Category { Name = "Portfolio Websites", Type = "Project" });
                await context.Categories.AddAsync(new Category { Name = "University Projects", Type = "Project" });
                await context.Categories.AddAsync(new Category { Name = "Database Projects", Type = "Project" });
                await context.SaveChangesAsync();
            }

            // 6. Seed Statistics (Non-destructive: Upsert/Update values)
            if (!await context.Statistics.AnyAsync())
            {
                var stats = new List<Statistic>
                {
                    new Statistic { Title = "Enterprise Projects", Value = 4, IconClass = "fas fa-folder-open", DisplayOrder = 1 },
                    new Statistic { Title = "Education Milestones", Value = 2, IconClass = "fas fa-graduation-cap", DisplayOrder = 2 },
                    new Statistic { Title = "Years Coding", Value = 2, IconClass = "fas fa-laptop-code", DisplayOrder = 3 },
                    new Statistic { Title = "Core Technologies", Value = 9, IconClass = "fas fa-code", DisplayOrder = 4 }
                };
                await context.Statistics.AddRangeAsync(stats);
                await context.SaveChangesAsync();
            }
            else
            {
                var projStat = await context.Statistics.FirstOrDefaultAsync(s => s.Title.Contains("Enterprise Projects"));
                if (projStat != null && projStat.Value < 4)
                {
                    projStat.Value = 4;
                    await context.SaveChangesAsync();
                }
            }

            // 7. Seed Skills (Non-destructive: Only if missing)
            if (!await context.Skills.AnyAsync())
            {
                var skills = new List<Skill>
                {
                    new Skill { Name = "ASP.NET Core MVC", Percentage = 95, IconClass = "fab fa-microsoft", ColorHex = "#A855F7", DisplayOrder = 1 },
                    new Skill { Name = "C# / .NET 10", Percentage = 95, IconClass = "fas fa-code", ColorHex = "#3B82F6", DisplayOrder = 2 },
                    new Skill { Name = "SQL Server & Relational DB", Percentage = 90, IconClass = "fas fa-database", ColorHex = "#06B6D4", DisplayOrder = 3 },
                    new Skill { Name = "HTML5, CSS3 & JavaScript", Percentage = 90, IconClass = "fab fa-js", ColorHex = "#F59E0B", DisplayOrder = 4 },
                    new Skill { Name = "React & Modern UI", Percentage = 88, IconClass = "fab fa-react", ColorHex = "#00D9FF", DisplayOrder = 5 },
                    new Skill { Name = "PHP & MySQL", Percentage = 85, IconClass = "fab fa-php", ColorHex = "#10B981", DisplayOrder = 6 },
                    new Skill { Name = "Git & GitHub", Percentage = 90, IconClass = "fab fa-git-alt", ColorHex = "#EF4444", DisplayOrder = 7 },
                    new Skill { Name = "Entity Framework Core", Percentage = 90, IconClass = "fas fa-layer-group", ColorHex = "#8B3DFF", DisplayOrder = 8 }
                };
                await context.Skills.AddRangeAsync(skills);
                await context.SaveChangesAsync();
            }

            // 8. Seed Educations (Non-destructive: Only if missing)
            if (!await context.Educations.AnyAsync())
            {
                var educations = new List<Education>
                {
                    new Education
                    {
                        Institution = "Sohail University, Karachi",
                        Degree = "Bachelor of Science in Business Computing (BSBC)",
                        Description = "Undergraduate program focused on software development, programming, databases, software engineering, business management, and information systems.",
                        StartDate = new DateTime(2025, 10, 1),
                        EndDate = new DateTime(2029, 12, 31)
                    },
                    new Education
                    {
                        Institution = "Aptech Learning, Karachi",
                        Degree = "Advanced Diploma in Software Engineering (ADSE)",
                        Description = "Diploma program covering software engineering, object-oriented programming, database management, web development, Git, and practical application development.",
                        StartDate = new DateTime(2024, 3, 1),
                        EndDate = new DateTime(2027, 5, 31)
                    }
                };
                await context.Educations.AddRangeAsync(educations);
                await context.SaveChangesAsync();
            }

            // 9. Seed Projects (Non-destructive: Add missing projects individually)
            var portfolioCat = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Portfolio Websites") ?? defaultCat;
            var reactCat = await context.Categories.FirstOrDefaultAsync(c => c.Name == "React & Modern Web");
            if (reactCat == null)
            {
                reactCat = new Category { Name = "React & Modern Web", Type = "Project" };
                await context.Categories.AddAsync(reactCat);
                await context.SaveChangesAsync();
            }

            // Project 1: UMS (NED Academy)
            if (!await context.Projects.AnyAsync(p => p.Title.Contains("NED Academy") || p.Title.Contains("University Management")))
            {
                await context.Projects.AddAsync(new Project
                {
                    Title = "NED Academy University Management & Admission Portal",
                    Subtitle = "Enterprise Academic Admissions & Department Management System",
                    Description = "Engineered a comprehensive university portal featuring online student application workflows, document proof verification, academic department administration, fee voucher management, audit logging, and dynamic CMS controls.",
                    Technologies = "ASP.NET Core 10 MVC, C#, Entity Framework Core, SQL Server, Bootstrap 5, LINQ",
                    GitHubLink = "https://github.com/saadsa9112-cloud",
                    Status = "Published",
                    FeaturedOption = true,
                    DisplayOrder = 1,
                    ThumbnailPath = "/images/projects/ned-academy.jpg",
                    CategoryId = defaultCat?.Id,
                    Challenges = "Managing multi-step student admission submissions, document verification queues, and role-based academic department authorizations concurrently without schema lockups.",
                    Solutions = "Designed a normalized relational SQL Server database schema with asynchronous EF Core transactions, audit logging for administrative edits, and secure document upload management."
                });
            }

            // Project 2: Nexora Digital
            if (!await context.Projects.AnyAsync(p => p.Title.Contains("Nexora")))
            {
                await context.Projects.AddAsync(new Project
                {
                    Title = "Nexora Digital Agency & Client Solutions Platform",
                    Subtitle = "Modern Software Development Agency Platform with Interactive Pricing & Quote Builder",
                    Description = "Developed a modern responsive digital agency platform featuring dynamic multi-currency pricing (PKR/USD), an interactive service scope and quote builder, glassmorphic UI components, and fluid scroll animations.",
                    Technologies = "React 19, Vite, Tailwind CSS v4, Framer Motion, JavaScript, Lucide Icons",
                    GitHubLink = "https://github.com/saadsa9112-cloud",
                    Status = "Published",
                    FeaturedOption = true,
                    DisplayOrder = 2,
                    ThumbnailPath = "/images/projects/nexora-digital.jpg",
                    CategoryId = reactCat?.Id,
                    Challenges = "Delivering complex fluid scroll animations and real-time currency conversions while maintaining sub-second load times and zero layout shifts.",
                    Solutions = "Leveraged React 19 concurrent features with Tailwind CSS v4 and Framer Motion state management for performant interactive UI components."
                });
            }

            // Project 3: Full-Stack Developer Portfolio
            if (!await context.Projects.AnyAsync(p => p.Title.Contains("Developer Portfolio")))
            {
                await context.Projects.AddAsync(new Project
                {
                    Title = "Full-Stack Enterprise Developer Portfolio",
                    Subtitle = "Modern Responsive Developer Portfolio with Dynamic Visitor Analytics & Static Exporter",
                    Description = "Engineered a full-stack portfolio application with ASP.NET Core 10 MVC, SQL Server persistence, real-time visitor telemetry, and an automated static distribution pipeline.",
                    Technologies = "ASP.NET Core 10 MVC, C#, SQL Server, JavaScript, CSS3, EF Core",
                    GitHubLink = "https://github.com/saadsa9112-cloud/futuristic-portfolio-by-SA-Developer",
                    Status = "Published",
                    FeaturedOption = false,
                    DisplayOrder = 3,
                    ThumbnailPath = "/images/profile.png",
                    CategoryId = portfolioCat?.Id,
                    Challenges = "Integrating dynamic SQL telemetry tracking with a flat GitHub Pages static deployment.",
                    Solutions = "Engineered a custom Node.js static build harvester combined with API route tunneling."
                });
            }

            // Project 4: HMS Analytics Engine
            if (!await context.Projects.AnyAsync(p => p.Title.Contains("HMS Analytics")))
            {
                await context.Projects.AddAsync(new Project
                {
                    Title = "HMS Analytics & Telemetry Engine",
                    Subtitle = "Real-Time Visitor Analytics & Geolocation Tracking Platform",
                    Description = "Developed a real-time visitor analytics dashboard with geolocation lookup, session tracking, background queue processing, and SignalR live updates.",
                    Technologies = "ASP.NET Core 10, EF Core, SQL Server, SignalR, BackgroundServices",
                    GitHubLink = "https://github.com/saadsa9112-cloud",
                    Status = "Published",
                    FeaturedOption = false,
                    DisplayOrder = 4,
                    ThumbnailPath = "/images/profile.png",
                    CategoryId = defaultCat?.Id,
                    Challenges = "Handling high-frequency telemetry events without blocking main UI loop threads.",
                    Solutions = "Implemented an in-memory background queue processor with asynchronous EF Core batch execution."
                });
            }

            await context.SaveChangesAsync();

            // 10. Seed Social Links (Non-destructive: Only if missing)
            if (!await context.SocialLinks.AnyAsync())
            {
                await context.SocialLinks.AddAsync(new SocialLink { PlatformName = "GitHub", Url = "https://github.com/saadsa9112-cloud", IconClass = "fab fa-github" });
                await context.SaveChangesAsync();
            }
        }
    }
}
