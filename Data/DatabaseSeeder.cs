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
            const string adminEmail = "saad.sa4539@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "Muhammad Saad",
                    EmailConfirmed = true,
                    ProfilePicturePath = "/images/profile.png"
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123456");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, adminRole);
                }
            }

            // 4. Seed Global Settings
            if (!await context.Settings.AnyAsync())
            {
                var settings = new Settings
                {
                    SiteName = "MUHAMMAD SAAD | Futuristic Portfolio",
                    LogoPath = "/images/logo.png",
                    FaviconPath = "/favicon.ico",
                    Theme = "dark",
                    PrimaryColorHex = "#a855f7", // Purple Neon
                    FooterText = "© 2026 Muhammad Saad. Built with ASP.NET 10 & GSAP.",
                    MetaTitle = "Muhammad Saad | Senior Full Stack Engineer Portfolio",
                    MetaDescription = "Step into the future. Discover advanced full-stack systems, clean MVC architecture, and premium interactive designs.",
                    Biography = "<p>I am a <strong>Senior Software Architect & Full-Stack Engineer</strong> specializing in enterprise-grade web apps, cloud native structures, and high-performance backend systems. I build clean, secure, and beautiful digital experiences.</p>",
                    YearsOfExperience = 8,
                    EducationShort = "Bachelor of Science in Computer Science",
                    Journey = "My engineering journey started over a decade ago. From crafting optimized SQL queries to architecting distributed microservices and rich frontends, I have worked with start-ups and tech giants to design systems that scale.",
                    Goals = "My goal is to continue pushing the boundaries of web architecture, writing clean, maintainable, and self-documenting code, and helping teams deliver robust products using .NET 10, Cloud technologies, and sleek modern frontends.",
                    ContactEmail = adminEmail,
                    ContactPhone = "+1 (555) 019-2834",
                    ContactAddress = "Neo Metropolis, Cyber District 9",
                    OpenStreetMapEmbedUrl = "https://www.openstreetmap.org/embed.html?bbox=-74.009%2C40.705%2C-73.999%2C40.715&layer=mapnik&marker=40.7128%2C-74.0060"
                };
                await context.Settings.AddAsync(settings);
            }

            // 5. Seed Categories
            if (!await context.Categories.AnyAsync())
            {
                var categories = new List<Category>
                {
                    new Category { Name = "Web Applications", Type = "Project" },
                    new Category { Name = "Backend Services", Type = "Project" },
                    new Category { Name = "Cloud Infrastructure", Type = "Project" },
                    new Category { Name = "Architecture", Type = "Blog" },
                    new Category { Name = "Code Quality", Type = "Blog" },
                    new Category { Name = "Cybersecurity", Type = "Blog" }
                };
                await context.Categories.AddRangeAsync(categories);
            }

            // 6. Seed Skills
            if (!await context.Skills.AnyAsync())
            {
                var skills = new List<Skill>
                {
                    new Skill { Name = "ASP.NET Core MVC", Percentage = 95, IconClass = "fab fa-microsoft", ColorHex = "#a855f7", DisplayOrder = 1 },
                    new Skill { Name = "C# / .NET 10", Percentage = 98, IconClass = "fas fa-code", ColorHex = "#3b82f6", DisplayOrder = 2 },
                    new Skill { Name = "SQL Server", Percentage = 90, IconClass = "fas fa-database", ColorHex = "#06b6d4", DisplayOrder = 3 },
                    new Skill { Name = "Entity Framework Core", Percentage = 94, IconClass = "fas fa-project-diagram", ColorHex = "#10b981", DisplayOrder = 4 },
                    new Skill { Name = "JavaScript (ES6) / GSAP", Percentage = 85, IconClass = "fab fa-js", ColorHex = "#f59e0b", DisplayOrder = 5 },
                    new Skill { Name = "Git & CI/CD Pipelines", Percentage = 92, IconClass = "fab fa-git-alt", ColorHex = "#ef4444", DisplayOrder = 6 }
                };
                await context.Skills.AddRangeAsync(skills);
            }

            // 7. Seed Statistics
            if (!await context.Statistics.AnyAsync())
            {
                var stats = new List<Statistic>
                {
                    new Statistic { Title = "Completed Projects", Value = 24, IconClass = "fas fa-rocket", DisplayOrder = 1 },
                    new Statistic { Title = "Certifications", Value = 12, IconClass = "fas fa-award", DisplayOrder = 2 },
                    new Statistic { Title = "Years of Experience", Value = 8, IconClass = "fas fa-briefcase", DisplayOrder = 3 },
                    new Statistic { Title = "Technologies Mastered", Value = 15, IconClass = "fas fa-laptop-code", DisplayOrder = 4 }
                };
                await context.Statistics.AddRangeAsync(stats);
            }

            // 8. Seed Social Links
            if (!await context.SocialLinks.AnyAsync())
            {
                var social = new List<SocialLink>
                {
                    new SocialLink { PlatformName = "GitHub", Url = "https://github.com", IconClass = "fab fa-github" },
                    new SocialLink { PlatformName = "LinkedIn", Url = "https://linkedin.com", IconClass = "fab fa-linkedin" },
                    new SocialLink { PlatformName = "Twitter", Url = "https://twitter.com", IconClass = "fab fa-twitter" }
                };
                await context.SocialLinks.AddRangeAsync(social);
            }

            await context.SaveChangesAsync();
        }
    }
}
