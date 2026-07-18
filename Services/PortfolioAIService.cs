using FuturisticPortfolio.Repositories;
using System.Text;

namespace FuturisticPortfolio.Services
{
    public class PortfolioAIService : IPortfolioAIService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PortfolioAIService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<string> GetAIResponseAsync(string userMessage)
        {
            if (string.IsNullOrWhiteSpace(userMessage))
            {
                return "Greetings, user. Command terminal online. Please type a query to proceed.";
            }

            var query = userMessage.ToLowerInvariant();
            var response = new StringBuilder();

            // 1. Check for Greetings
            if (query.Contains("hello") || query.Contains("hi") || query.Contains("hey") || query.Contains("greetings"))
            {
                var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
                var devName = settings?.SiteName.Replace("| Futuristic Portfolio", "").Trim() ?? "Chief Architect";
                response.AppendLine($"### System Initialized. Hello! 🌐");
                response.AppendLine($"I am the **AI Portfolio Assistant** for {devName}.");
                response.AppendLine("You can query me about:");
                response.AppendLine("- **Skills**: *\"What is your tech stack?\"*");
                response.AppendLine("- **Projects**: *\"Tell me about your latest projects.\"*");
                response.AppendLine("- **Experience**: *\"Where have you worked?\"*");
                response.AppendLine("- **Contact**: *\"How can I reach you?\"*");
                response.AppendLine("- **CV**: *\"Can I download your resume?\"*");
                return response.ToString();
            }

            // 2. Check for Projects
            if (query.Contains("project") || query.Contains("work") || query.Contains("portfolio") || query.Contains("app") || query.Contains("system"))
            {
                var projects = (await _unitOfWork.Projects.FindAsync(p => p.Status == "Published"))
                               .OrderBy(p => p.DisplayOrder)
                               .Take(3);

                response.AppendLine("### 🚀 Featured System Deployments (Projects)");
                if (!projects.Any())
                {
                    response.AppendLine("No system deployments are logged at this moment. Please check back later.");
                }
                else
                {
                    foreach (var project in projects)
                    {
                        response.AppendLine($"*   **[{project.Title}](/Portfolio/Details/{project.Id})**: {project.Subtitle}");
                        if (!string.IsNullOrEmpty(project.Technologies))
                        {
                            response.AppendLine($"    *Tech Stack: {project.Technologies}*");
                        }
                    }
                    response.AppendLine("\nYou can view all my work on the [Projects Page](/Portfolio).");
                }
                return response.ToString();
            }

            // 3. Check for Skills
            if (query.Contains("skill") || query.Contains("technolog") || query.Contains("language") || query.Contains("stack") || query.Contains("know") || query.Contains("c#") || query.Contains("dotnet") || query.Contains("sql") || query.Contains("javascript") || query.Contains("css"))
            {
                var skills = (await _unitOfWork.Skills.GetAllAsync())
                             .OrderBy(s => s.DisplayOrder)
                             .Take(6);

                response.AppendLine("### 🛠️ Core Tech Stack & Capabilities");
                if (!skills.Any())
                {
                    response.AppendLine("Technical configurations are currently offline.");
                }
                else
                {
                    foreach (var skill in skills)
                    {
                        response.AppendLine($"*   **{skill.Name}** — Proficiency: `{skill.Percentage}%`");
                    }
                    response.AppendLine("\nThese capabilities are leveraged to build high-performance web APIs, secure databases, and interactive user interfaces.");
                }
                return response.ToString();
            }

            // 4. Check for Contact
            if (query.Contains("contact") || query.Contains("email") || query.Contains("phone") || query.Contains("hire") || query.Contains("reach") || query.Contains("address") || query.Contains("social"))
            {
                var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
                response.AppendLine("### 📞 Secure Comms Link (Contact Info)");
                if (settings == null)
                {
                    response.AppendLine("Comms links are currently offline.");
                }
                else
                {
                    response.AppendLine($"*   **Email**: {settings.ContactEmail}");
                    response.AppendLine($"*   **Phone**: {settings.ContactPhone}");
                    response.AppendLine($"*   **Location**: {settings.ContactAddress}");
                    response.AppendLine($"\nYou can also transmit a direct message via the [Contact Form](#contact-section) at the bottom of the home page.");
                }
                return response.ToString();
            }

            // 5. Check for CV/Resume
            if (query.Contains("cv") || query.Contains("resume") || query.Contains("download"))
            {
                var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
                response.AppendLine("### 📄 Secure Document Transmission");
                if (settings != null && !string.IsNullOrEmpty(settings.CvFilePath))
                {
                    response.AppendLine($"You can securely download my latest CV directly via this link: [Download CV/Resume]({settings.CvFilePath}).");
                }
                else
                {
                    response.AppendLine("CV transmission is currently disabled, or the file is being updated. You can ask for my details directly here.");
                }
                return response.ToString();
            }

            // 6. Check for Experience
            if (query.Contains("experience") || query.Contains("work history") || query.Contains("job") || query.Contains("company") || query.Contains("career"))
            {
                var exp = (await _unitOfWork.Experiences.GetAllAsync())
                          .OrderByDescending(e => e.StartDate);

                response.AppendLine("### 💼 Professional Journey (Experience)");
                if (!exp.Any())
                {
                    response.AppendLine("No work records found. Direct data retrieval failed.");
                }
                else
                {
                    foreach (var job in exp)
                    {
                        var duration = job.IsCurrent ? "Present" : job.EndDate?.ToString("MMM yyyy") ?? "";
                        response.AppendLine($"*   **{job.Role}** at *{job.Company}* ({job.StartDate.ToString("MMM yyyy")} - {duration})");
                        response.AppendLine($"    _{job.Description}_");
                    }
                }
                return response.ToString();
            }

            // 7. Check for Education
            if (query.Contains("education") || query.Contains("degree") || query.Contains("university") || query.Contains("college") || query.Contains("study"))
            {
                var edu = (await _unitOfWork.Educations.GetAllAsync())
                          .OrderByDescending(e => e.StartDate);

                response.AppendLine("### 🎓 Academic Infrastructure (Education)");
                if (!edu.Any())
                {
                    response.AppendLine("No academic records logged.");
                }
                else
                {
                    foreach (var school in edu)
                    {
                        var end = school.EndDate?.ToString("yyyy") ?? "Present";
                        response.AppendLine($"*   **{school.Degree}**");
                        response.AppendLine($"    {school.Institution} | {school.StartDate.ToString("yyyy")} - {end}");
                    }
                }
                return response.ToString();
            }

            // 8. Check for Certificates
            if (query.Contains("certificate") || query.Contains("certification") || query.Contains("credential"))
            {
                var certs = (await _unitOfWork.Certificates.GetAllAsync())
                            .OrderByDescending(c => c.Date);

                response.AppendLine("### 🏆 Verified Credentials (Certifications)");
                if (!certs.Any())
                {
                    response.AppendLine("No certificates loaded.");
                }
                else
                {
                    foreach (var cert in certs)
                    {
                        response.AppendLine($"*   **{cert.Name}** issued by *{cert.Organization}* ({cert.Date.ToString("MMMM yyyy")})");
                    }
                }
                return response.ToString();
            }

            // 9. Default Response
            response.AppendLine("### ⚠️ Command Unrecognized");
            response.AppendLine("My neural patterns did not match your query. Try asking one of these commands:");
            response.AppendLine("- *\"What is your tech stack?\"*");
            response.AppendLine("- *\"Show me your projects.\"*");
            response.AppendLine("- *\"Where have you worked?\"*");
            response.AppendLine("- *\"How can I contact you?\"*");
            response.AppendLine("- *\"Download CV\"*");
            return response.ToString();
        }
    }
}
