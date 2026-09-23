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

            // 9. Seed & Sync Projects (Upsert all 5 enterprise projects with real thumbnails)
            var portfolioCat = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Portfolio Websites") ?? defaultCat;
            var reactCat = await context.Categories.FirstOrDefaultAsync(c => c.Name == "React & Modern Web");
            if (reactCat == null)
            {
                reactCat = new Category { Name = "React & Modern Web", Type = "Project" };
                await context.Categories.AddAsync(reactCat);
                await context.SaveChangesAsync();
            }

            var uniCat = await context.Categories.FirstOrDefaultAsync(c => c.Name == "University Projects") ?? defaultCat;

            // Project 1: NED Academy University Management System (UMS)
            var p1 = await context.Projects.FirstOrDefaultAsync(p => p.Title.Contains("Management System") || p.Title.Contains("UMS"));
            if (p1 == null)
            {
                p1 = new Project();
                await context.Projects.AddAsync(p1);
            }
            p1.Title = "NED Academy University Management System (UMS)";
            p1.Subtitle = "Enterprise Academic Course, Student & Department Management Architecture";
            p1.Description = "Engineered a robust university management platform featuring student enrollment, departmental hierarchy administration, teacher course assignments, notice board broadcasts, and academic progress tracking.";
            p1.Technologies = "ASP.NET Core MVC, C#, Entity Framework Core, SQL Server, Bootstrap, LINQ";
            p1.GitHubLink = "https://github.com/saadsa9112-cloud";
            p1.Status = "Published";
            p1.FeaturedOption = true;
            p1.DisplayOrder = 1;
            p1.ThumbnailPath = "/images/projects/ned-academy-system.jpg";
            p1.CategoryId = uniCat?.Id ?? defaultCat?.Id;
            p1.Challenges = "Managing relational student registrations, course prerequisite hierarchies, and faculty assignments across multi-department academic structures.";
            p1.Solutions = "Architected a normalized SQL Server relational schema with EF Core repository patterns and transaction boundaries to eliminate data concurrency anomalies.";

            // Project 2: NED Academy Admissions & University Portal
            var p2 = await context.Projects.FirstOrDefaultAsync(p => p.Title.Contains("NED Academy") && p.Title.Contains("Portal"));
            if (p2 == null)
            {
                p2 = new Project();
                await context.Projects.AddAsync(p2);
            }
            p2.Title = "NED Academy Admissions & Public University Portal";
            p2.Subtitle = "Complete Online Admission Lifecycle & Departmental CMS Engine";
            p2.Description = "Engineered an enterprise-grade university admissions and content management system featuring student application workflows, document proof verification queues, academic program registries, fee voucher management, audit logging, and dynamic CMS controls.";
            p2.Technologies = "ASP.NET Core 10 MVC, C#, EF Core 10, SQL Server, Bootstrap 5, LINQ";
            p2.GitHubLink = "https://github.com/saadsa9112-cloud";
            p2.Status = "Published";
            p2.FeaturedOption = true;
            p2.DisplayOrder = 2;
            p2.ThumbnailPath = "/images/projects/ned-academy-website.jpg";
            p2.CategoryId = uniCat?.Id ?? defaultCat?.Id;
            p2.Challenges = "Managing multi-step student admission submissions, document upload verification queues, and role-based academic authorizations without schema bottlenecks.";
            p2.Solutions = "Designed an asynchronous EF Core transaction model with administrative audit logging, secure document uploads, and dynamic degree program routing.";

            // Project 3: Nexora Digital Agency & Client Solutions Platform
            var p3 = await context.Projects.FirstOrDefaultAsync(p => p.Title.Contains("Nexora"));
            if (p3 == null)
            {
                p3 = new Project();
                await context.Projects.AddAsync(p3);
            }
            p3.Title = "Nexora Digital Agency & Client Solutions Platform";
            p3.Subtitle = "Modern Software Development Agency Platform with Interactive Pricing & Scope Builder";
            p3.Description = "Developed a modern responsive digital agency platform featuring dynamic multi-currency pricing (PKR/USD), an interactive service scope and quotation builder, glassmorphic UI components, and fluid scroll animations.";
            p3.Technologies = "React 19, Vite, Tailwind CSS v4, Framer Motion, JavaScript, Lucide Icons";
            p3.GitHubLink = "https://github.com/saadsa9112-cloud";
            p3.Status = "Published";
            p3.FeaturedOption = true;
            p3.DisplayOrder = 3;
            p3.ThumbnailPath = "/images/projects/nexora-digital.jpg";
            p3.CategoryId = reactCat?.Id ?? defaultCat?.Id;
            p3.Challenges = "Delivering complex fluid scroll animations and real-time currency conversions while maintaining sub-second load times and zero layout shifts.";
            p3.Solutions = "Leveraged React 19 concurrent features with Tailwind CSS v4 and Framer Motion state management for performant interactive UI components.";

            // Project 4: Full-Stack Developer Portfolio
            var p4 = await context.Projects.FirstOrDefaultAsync(p => p.Title.Contains("Developer Portfolio"));
            if (p4 == null)
            {
                p4 = new Project();
                await context.Projects.AddAsync(p4);
            }
            p4.Title = "Full-Stack Enterprise Developer Portfolio";
            p4.Subtitle = "Modern Responsive Developer Portfolio with Dynamic Telemetry & Static Harvester";
            p4.Description = "Engineered a full-stack portfolio application with ASP.NET Core 10 MVC, SQL Server persistence, real-time visitor telemetry, and an automated static distribution pipeline for GitHub Pages.";
            p4.Technologies = "ASP.NET Core 10 MVC, C#, SQL Server, JavaScript, CSS3, EF Core";
            p4.GitHubLink = "https://github.com/saadsa9112-cloud/futuristic-portfolio-by-SA-Developer";
            p4.Status = "Published";
            p4.FeaturedOption = false;
            p4.DisplayOrder = 4;
            p4.ThumbnailPath = "/images/projects/developer-portfolio.jpg";
            p4.CategoryId = portfolioCat?.Id ?? defaultCat?.Id;
            p4.Challenges = "Integrating dynamic SQL telemetry tracking with a flat GitHub Pages static deployment.";
            p4.Solutions = "Engineered a custom Node.js static build harvester combined with API route tunneling.";

            // Project 5: HMS Analytics Engine
            var p5 = await context.Projects.FirstOrDefaultAsync(p => p.Title.Contains("HMS Analytics"));
            if (p5 == null)
            {
                p5 = new Project();
                await context.Projects.AddAsync(p5);
            }
            p5.Title = "HMS Analytics & Telemetry Engine";
            p5.Subtitle = "Real-Time Visitor Analytics & Geolocation Tracking Platform";
            p5.Description = "Developed a real-time visitor analytics dashboard with geolocation lookup, session tracking, background queue processing, and SignalR live updates.";
            p5.Technologies = "ASP.NET Core 10, EF Core, SQL Server, SignalR, BackgroundServices";
            p5.GitHubLink = "https://github.com/saadsa9112-cloud";
            p5.Status = "Published";
            p5.FeaturedOption = false;
            p5.DisplayOrder = 5;
            p5.ThumbnailPath = "/images/projects/hms-analytics.jpg";
            p5.CategoryId = defaultCat?.Id;
            p5.Challenges = "Handling high-frequency telemetry events without blocking main UI loop threads.";
            p5.Solutions = "Implemented an in-memory background queue processor with asynchronous EF Core batch execution.";

            await context.SaveChangesAsync();

            // Sync enterprise projects count in statistics to 5
            var enterpriseProjStat = await context.Statistics.FirstOrDefaultAsync(s => s.Title.Contains("Enterprise Projects"));
            if (enterpriseProjStat != null)
            {
                enterpriseProjStat.Value = 5;
                await context.SaveChangesAsync();
            }

            // 10. Seed Social Links (Non-destructive: Only if missing)
            if (!await context.SocialLinks.AnyAsync())
            {
                await context.SocialLinks.AddAsync(new SocialLink { PlatformName = "GitHub", Url = "https://github.com/saadsa9112-cloud", IconClass = "fab fa-github" });
                await context.SaveChangesAsync();
            }
        }
    }
}
