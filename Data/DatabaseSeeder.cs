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

            // 3. Seed Admin User
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

                var result = await userManager.CreateAsync(adminUser, "Admin@123456");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRole);
                }
            }
            else
            {
                adminUser.FullName = "Hafiz Muhammad Saad (HMS Developer)";
                await userManager.UpdateAsync(adminUser);
            }

            // 4. Seed Global Settings from CV
            var settings = await context.Settings.FirstOrDefaultAsync();
            const string cvSummary = "<p>Motivated and detail-oriented <strong>Software Developer</strong> with knowledge of <strong>C#, C++, ASP.NET Core MVC (.NET), PHP, HTML5, CSS3, JavaScript, SQL, and MySQL</strong>. Experienced in developing and enhancing web applications through academic and personal projects.</p><p>Passionate about building scalable software solutions, solving real-world problems, and continuously learning modern technologies. A collaborative team player with strong analytical and problem-solving skills, eager to contribute to innovative software development projects.</p>";

            if (settings == null)
            {
                settings = new Settings
                {
                    SiteName = "HMS Developer | Software Developer Portfolio",
                    LogoPath = "/images/logo.png",
                    FaviconPath = "/favicon.ico",
                    CvFilePath = "/files/Muhammad_Saad_CV.pdf",
                    Theme = "dark",
                    PrimaryColorHex = "#2563EB",
                    FooterText = "© 2026 Hafiz Muhammad Saad (HMS Developer). All Rights Reserved. Built with ASP.NET Core MVC.",
                    MetaTitle = "Hafiz Muhammad Saad | Software Developer",
                    MetaDescription = "Motivated and detail-oriented Software Developer with knowledge of C#, C++, ASP.NET Core MVC (.NET), PHP, HTML5, CSS3, JavaScript, SQL, and MySQL.",
                    Biography = cvSummary,
                    YearsOfExperience = 2,
                    EducationShort = "BSBC - Sohail University & ADSE - Aptech Learning, Karachi",
                    Journey = "Pursuing Bachelor of Science in Business Computing (BSBC) at Sohail University (Oct 2025 – 2029) and Advanced Diploma in Software Engineering (ADSE) at Aptech Learning (March 2024 – May 2027), focusing on modern software engineering, object-oriented programming, databases, web development, cloud computing, cybersecurity, and artificial intelligence.",
                    Goals = "Passionate about building scalable software solutions, solving real-world problems, and continuously learning modern technologies to contribute to innovative software development projects.",
                    ContactEmail = adminEmail,
                    ContactPhone = "+92 305 5188896",
                    ContactAddress = "Karachi, Pakistan",
                    OpenStreetMapEmbedUrl = "https://www.openstreetmap.org/export/embed.html?bbox=66.95%2C24.80%2C67.25%2C25.05&layer=mapnik"
                };
                await context.Settings.AddAsync(settings);
            }
            else
            {
                settings.SiteName = "HMS Developer | Software Developer Portfolio";
                settings.FooterText = "© 2026 Hafiz Muhammad Saad (HMS Developer). All Rights Reserved. Built with ASP.NET Core MVC.";
                settings.MetaTitle = "Hafiz Muhammad Saad | Software Developer";
                settings.MetaDescription = "Motivated and detail-oriented Software Developer with knowledge of C#, C++, ASP.NET Core MVC (.NET), PHP, HTML5, CSS3, JavaScript, SQL, and MySQL.";
                settings.Biography = cvSummary;
                settings.CvFilePath = "/files/Muhammad_Saad_CV.pdf";
                settings.YearsOfExperience = 1;
                settings.EducationShort = "BSBC - Sohail University & ADSE - Aptech Learning, Karachi";
                settings.Journey = "Pursuing Bachelor of Science in Business Computing (BSBC) at Sohail University (Oct 2025 – 2029) and Advanced Diploma in Software Engineering (ADSE) at Aptech Learning (March 2024 – May 2027), focusing on modern software engineering, object-oriented programming, databases, web development, cloud computing, cybersecurity, and artificial intelligence.";
                settings.Goals = "Passionate about building scalable software solutions, solving real-world problems, and continuously learning modern technologies to contribute to innovative software development projects.";
                settings.ContactEmail = adminEmail;
                settings.ContactPhone = "+92 305 5188896";
                settings.ContactAddress = "Karachi, Pakistan";
                context.Settings.Update(settings);
            }

            // 5. Seed Categories
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

            // 6. Seed Statistics from CV
            var existingStats = await context.Statistics.ToListAsync();
            if (!existingStats.Any())
            {
                var stats = new List<Statistic>
                {
                    new Statistic { Title = "Enterprise Projects", Value = 2, IconClass = "fas fa-folder-open", DisplayOrder = 1 },
                    new Statistic { Title = "Degrees & Diplomas", Value = 2, IconClass = "fas fa-graduation-cap", DisplayOrder = 2 },
                    new Statistic { Title = "Years Coding", Value = 2, IconClass = "fas fa-laptop-code", DisplayOrder = 3 },
                    new Statistic { Title = "Core Technologies", Value = 9, IconClass = "fas fa-code", DisplayOrder = 4 }
                };
                await context.Statistics.AddRangeAsync(stats);
            }
            else
            {
                context.Statistics.RemoveRange(existingStats);
                var stats = new List<Statistic>
                {
                    new Statistic { Title = "Enterprise Projects", Value = 2, IconClass = "fas fa-folder-open", DisplayOrder = 1 },
                    new Statistic { Title = "Degrees & Diplomas", Value = 2, IconClass = "fas fa-graduation-cap", DisplayOrder = 2 },
                    new Statistic { Title = "Years Coding", Value = 2, IconClass = "fas fa-laptop-code", DisplayOrder = 3 },
                    new Statistic { Title = "Core Technologies", Value = 9, IconClass = "fas fa-code", DisplayOrder = 4 }
                };
                await context.Statistics.AddRangeAsync(stats);
            }

            // 7. Seed Skills from CV
            if (!await context.Skills.AnyAsync())
            {
                var skills = new List<Skill>
                {
                    new Skill { Name = "ASP.NET Core MVC (.NET)", Percentage = 95, IconClass = "fab fa-microsoft", ColorHex = "#a855f7", DisplayOrder = 1 },
                    new Skill { Name = "C#", Percentage = 95, IconClass = "fas fa-code", ColorHex = "#3b82f6", DisplayOrder = 2 },
                    new Skill { Name = "SQL Server & MySQL", Percentage = 92, IconClass = "fas fa-database", ColorHex = "#06b6d4", DisplayOrder = 3 },
                    new Skill { Name = "PHP", Percentage = 90, IconClass = "fab fa-php", ColorHex = "#10b981", DisplayOrder = 4 },
                    new Skill { Name = "HTML5, CSS3 & JavaScript", Percentage = 90, IconClass = "fab fa-js", ColorHex = "#f59e0b", DisplayOrder = 5 },
                    new Skill { Name = "C++", Percentage = 85, IconClass = "fas fa-terminal", ColorHex = "#ec4899", DisplayOrder = 6 },
                    new Skill { Name = "Git & GitHub", Percentage = 92, IconClass = "fab fa-git-alt", ColorHex = "#ef4444", DisplayOrder = 7 },
                    new Skill { Name = "WordPress & Visual Studio", Percentage = 88, IconClass = "fab fa-wordpress", ColorHex = "#6366f1", DisplayOrder = 8 }
                };
                await context.Skills.AddRangeAsync(skills);
            }

            // 8. Seed Educations from CV (Aptech ADSE Primary)
            var existingEducations = await context.Educations.ToListAsync();
            if (!existingEducations.Any())
            {
                var educations = new List<Education>
                {
                    new Education
                    {
                        Institution = "Aptech Learning, Karachi",
                        Degree = "Advanced Diploma in Software Engineering (ADSE)",
                        Description = "Comprehensive diploma covering software development, object-oriented programming, database management, web development, software engineering principles, Git, and practical application development.",
                        StartDate = new DateTime(2024, 3, 1),
                        EndDate = new DateTime(2027, 5, 31)
                    },
                    new Education
                    {
                        Institution = "Sohail University, Karachi",
                        Degree = "Bachelor of Science in Business Computing (BSBC)",
                        Description = "Comprehensive undergraduate program focused on software development, programming, databases, software engineering, cybersecurity, artificial intelligence, cloud computing, business management, and information systems.",
                        StartDate = new DateTime(2025, 10, 1),
                        EndDate = new DateTime(2029, 12, 31)
                    }
                };
                await context.Educations.AddRangeAsync(educations);
            }
            else
            {
                context.Educations.RemoveRange(existingEducations);
                var educations = new List<Education>
                {
                    new Education
                    {
                        Institution = "Aptech Learning, Karachi",
                        Degree = "Advanced Diploma in Software Engineering (ADSE)",
                        Description = "Comprehensive diploma covering software development, object-oriented programming, database management, web development, software engineering principles, Git, and practical application development.",
                        StartDate = new DateTime(2024, 3, 1),
                        EndDate = new DateTime(2027, 5, 31)
                    },
                    new Education
                    {
                        Institution = "Sohail University, Karachi",
                        Degree = "Bachelor of Science in Business Computing (BSBC)",
                        Description = "Comprehensive undergraduate program focused on software development, programming, databases, software engineering, cybersecurity, artificial intelligence, cloud computing, business management, and information systems.",
                        StartDate = new DateTime(2025, 10, 1),
                        EndDate = new DateTime(2029, 12, 31)
                    }
                };
                await context.Educations.AddRangeAsync(educations);
            }

            // 9. Seed Projects from CV
            if (!await context.Projects.AnyAsync())
            {
                var portfolioCat = await context.Categories.FirstOrDefaultAsync(c => c.Name == "Portfolio Websites") ?? defaultCat;
                var projects = new List<Project>
                {
                    new Project
                    {
                        Title = "Portfolio Website",
                        Subtitle = "Modern Responsive Developer Portfolio with Dynamic Telemetry & Static Build Pipeline",
                        Description = "Designed and developed a responsive portfolio website showcasing projects, technical skills, education, and contact information. Implemented a modern responsive UI with optimized performance across desktop and mobile devices.",
                        Technologies = "ASP.NET Core MVC, HTML5, CSS3, JavaScript, SQL Server",
                        GitHubLink = "https://github.com/saadsa9112-cloud/futuristic-portfolio-by-SA-Developer",
                        Status = "Published",
                        FeaturedOption = true,
                        DisplayOrder = 1,
                        ThumbnailPath = "/images/hero-bg.jpg",
                        CategoryId = portfolioCat.Id,
                        Challenges = "Integrating dynamic SQL telemetry tracking with a flat GitHub Pages static deployment.",
                        Solutions = "Engineered a custom Node.js static build harvester combined with Local Tunneling API routing."
                    },
                    new Project
                    {
                        Title = "University Management System (UMS)",
                        Subtitle = "Full-Stack Student & Record Management System",
                        Description = "Developed a university management system with student record management, CRUD functionality, authentication, and database integration using ASP.NET Core MVC and SQL Server.",
                        Technologies = "ASP.NET Core MVC, C#, SQL Server, HTML5, CSS3",
                        GitHubLink = "https://github.com/saadsa9112-cloud",
                        Status = "Published",
                        FeaturedOption = true,
                        DisplayOrder = 2,
                        ThumbnailPath = "/images/placeholder.png",
                        CategoryId = defaultCat.Id,
                        Challenges = "Managing complex database relationships and role-based student/faculty authentication.",
                        Solutions = "Implemented Entity Framework Core with normalized relational schemas and Identity security."
                    }
                };
                await context.Projects.AddRangeAsync(projects);
            }

            // 10. Seed Social Links
            var gitHubLink = await context.SocialLinks.FirstOrDefaultAsync(s => s.PlatformName == "GitHub");
            if (gitHubLink == null)
            {
                await context.SocialLinks.AddAsync(new SocialLink { PlatformName = "GitHub", Url = "https://github.com/saadsa9112-cloud", IconClass = "fab fa-github" });
            }
            else
            {
                gitHubLink.Url = "https://github.com/saadsa9112-cloud";
                context.SocialLinks.Update(gitHubLink);
            }

            await context.SaveChangesAsync();
        }
    }
}
