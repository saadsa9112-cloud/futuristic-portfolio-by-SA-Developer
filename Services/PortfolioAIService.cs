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
                return "Hi! I'm Saad's AI Assistant 👋 How can I help you explore Saad's portfolio today?";
            }

            var query = userMessage.ToLowerInvariant().Trim();
            var response = new StringBuilder();

            // 1. Check for Greetings & Conversation
            if (query.Contains("hello") || query.Contains("hi") || query.Contains("hey") || query.Contains("greetings") || query.Contains("who are you") || query.Contains("how are you"))
            {
                response.AppendLine("Hi! I'm Saad's AI Assistant 👋");
                response.AppendLine("\nI'm a conversational portfolio assistant for Hafiz Muhammad Saad (Full-Stack Software Developer).");
                response.AppendLine("\nYou can ask me about:");
                response.AppendLine("• **Projects**: *\"What has Saad built?\"*");
                response.AppendLine("• **Tech Stack**: *\"What technologies does he use?\"*");
                response.AppendLine("• **Education**: *\"Where did Saad study?\"*");
                response.AppendLine("• **CV**: *\"Download Saad's resume\"*");
                response.AppendLine("• **Contact**: *\"How to connect on WhatsApp?\"*");
                return response.ToString();
            }

            // 2. Check for Projects
            if (query.Contains("project") || query.Contains("work") || query.Contains("portfolio") || query.Contains("app") || query.Contains("system") || query.Contains("built") || query.Contains("created"))
            {
                var projects = (await _unitOfWork.Projects.FindAsync(p => p.Status == "Published"))
                               .OrderBy(p => p.DisplayOrder)
                               .Take(3);

                response.AppendLine("### 🚀 Featured Systems & Projects");
                if (!projects.Any())
                {
                    response.AppendLine("Saad has built enterprise portfolio apps and telemetry systems. You can view all work on the [Projects Page](/Portfolio).");
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
