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

            // Fetch dynamic settings from Database
            var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            var cvPath = !string.IsNullOrEmpty(settings?.CvFilePath) ? settings.CvFilePath : "/files/Muhammad_Saad_CV.pdf";
            var phone = !string.IsNullOrEmpty(settings?.ContactPhone) ? settings.ContactPhone : "+92 305 5188896";
            var email = !string.IsNullOrEmpty(settings?.ContactEmail) ? settings.ContactEmail : "saad.sa9112@gmail.com";

            // 1. WhatsApp / Contact / Phone / Reach / Message / How can I reach you?
            if (query.Contains("whatsapp") || query.Contains("contact") || query.Contains("phone") || query.Contains("reach") || query.Contains("email") || query.Contains("number") || query.Contains("call") || query.Contains("message"))
            {
                response.AppendLine("### 📞 Connect Direct with Saad");
                response.AppendLine("\nSaad is a Full-Stack Software Developer based in **Karachi, Pakistan**.");
                response.AppendLine($"\n• **WhatsApp Direct**: [{phone}](https://wa.me/923055188896?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!)");
                response.AppendLine($"• **Email**: {email}");
                response.AppendLine("• **Location**: Karachi, Pakistan");
                response.AppendLine("\n[Chat on WhatsApp](https://wa.me/923055188896?text=Hi%20Saad,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20connect!)");
                return response.ToString();
            }

            // 2. CV / Resume / Download / PDF / Can I get your resume?
            if (query.Contains("cv") || query.Contains("resume") || query.Contains("download") || query.Contains("pdf"))
            {
                response.AppendLine("### 📄 Download Saad's Official CV");
                response.AppendLine("\nClick below to download Hafiz Muhammad Saad's updated resume in PDF format:");
                response.AppendLine($"\n[Download CV (PDF)]({cvPath})");
                response.AppendLine("\n*Includes details on C# ASP.NET Core 10 MVC, SQL Server, BSBC degree, and ADSE diploma.*");
                return response.ToString();
            }

            // 3. Projects / What have you made / Systems / Apps / Portfolio
            if (query.Contains("project") || query.Contains("built") || query.Contains("made") || query.Contains("work") || query.Contains("app") || query.Contains("system") || query.Contains("developed") || query.Contains("portfolio"))
            {
                var projects = (await _unitOfWork.Projects.FindAsync(p => p.Status == "Published"))
                               .OrderBy(p => p.DisplayOrder)
                               .ToList();

                response.AppendLine("### 🚀 Featured System Deployments");
                if (!projects.Any())
                {
                    response.AppendLine("\nSaad has engineered full-stack portfolio systems and telemetry engines. Explore the [Projects Page](/Portfolio) for case studies.");
                }
                else
                {
                    foreach (var project in projects.Take(3))
                    {
                        response.AppendLine($"\n*   **[{project.Title}](/Portfolio/Details/{project.Id})**");
                        response.AppendLine($"    _{project.Subtitle}_");
                        if (!string.IsNullOrEmpty(project.Technologies))
                        {
                            response.AppendLine($"    *Tech Stack: {project.Technologies}*");
                        }
                    }
                    response.AppendLine("\n[Explore All Projects](/Portfolio)");
                }
                return response.ToString();
            }

            // 4. Skills / Tech Stack / What do you work with / Technologies / Languages
            if (query.Contains("skill") || query.Contains("tech") || query.Contains("stack") || query.Contains("work with") || query.Contains("language") || query.Contains("c#") || query.Contains("dotnet") || query.Contains("sql") || query.Contains("javascript") || query.Contains("php"))
            {
                var skills = (await _unitOfWork.Skills.GetAllAsync())
                             .OrderBy(s => s.DisplayOrder)
                             .ToList();

                response.AppendLine("### 🛠️ Saad's Technical Toolkit");
                if (!skills.Any())
                {
                    response.AppendLine("\n• **ASP.NET Core MVC** — Advanced");
                    response.AppendLine("• **C# / .NET 10** — Advanced");
                    response.AppendLine("• **SQL Server & Relational DB** — Proficient");
                    response.AppendLine("• **HTML5, CSS3 & JavaScript** — Proficient");
                    response.AppendLine("• **Entity Framework Core** — Proficient");
                }
                else
                {
                    foreach (var skill in skills)
                    {
                        var level = SkillLevelHelper.GetDisplayLevel(skill.Percentage);
                        response.AppendLine($"• **{skill.Name}** — {level}");
                    }
                }
                return response.ToString();
            }

            // 5. Education / Tell me about your studies / Degrees / University / College
            if (query.Contains("education") || query.Contains("study") || query.Contains("studies") || query.Contains("degree") || query.Contains("university") || query.Contains("aptech") || query.Contains("sohail") || query.Contains("diploma"))
            {
                var edu = (await _unitOfWork.Educations.GetAllAsync())
                          .OrderByDescending(e => e.StartDate)
                          .ToList();

                response.AppendLine("### 🎓 Academic Credentials & Diplomas");
                if (!edu.Any())
                {
                    response.AppendLine("\n• **BSBC (Bachelor of Science in Business Computing)** — Sohail University (2025–2029)");
                    response.AppendLine("• **ADSE (Advanced Diploma in Software Engineering)** — Aptech Learning (2024–2027)");
                }
                else
                {
                    foreach (var school in edu)
                    {
                        var endYear = school.EndDate?.ToString("yyyy") ?? "Present";
                        var label = school.Degree.Contains("BSBC") || school.Degree.Contains("Bachelor") ? "CURRENT DEGREE" : "PROFESSIONAL DIPLOMA";
                        response.AppendLine($"\n• **{school.Degree}** ({label})");
                        response.AppendLine($"  *{school.Institution} ({school.StartDate.ToString("yyyy")}–{endYear})*");
                    }
                }
                return response.ToString();
            }

            // 6. Experience / Do you have experience? / Work history / Career
            if (query.Contains("experience") || query.Contains("job") || query.Contains("career") || query.Contains("company") || query.Contains("history"))
            {
                var exp = (await _unitOfWork.Experiences.GetAllAsync())
                          .OrderByDescending(e => e.StartDate)
                          .ToList();

                response.AppendLine("### 💼 Professional Journey");
                if (!exp.Any())
                {
                    response.AppendLine("\nSaad is currently focused on building real-world software projects, database architectures, and continuously developing practical engineering skills.");
                }
                else
                {
                    foreach (var job in exp)
                    {
                        var duration = job.IsCurrent ? "Present" : job.EndDate?.ToString("MMM yyyy") ?? "";
                        response.AppendLine($"\n*   **{job.Role}** at *{job.Company}* ({job.StartDate.ToString("MMM yyyy")} – {duration})");
                        response.AppendLine($"    _{job.Description}_");
                    }
                }
                return response.ToString();
            }

            // 7. Greetings & About Saad
            if (query.Contains("hello") || query.Contains("hi") || query.Contains("hey") || query.Contains("greetings") || query.Contains("who are you") || query.Contains("about") || query.Contains("saad"))
            {
                response.AppendLine("Hi! I'm Saad's AI Assistant 👋");
                response.AppendLine("\nI can help you explore Saad's software development portfolio, core tech stack, degree background, CV, or connect directly via WhatsApp.");
                response.AppendLine("\nHow can I help you today? You can ask me about:");
                response.AppendLine("• **Projects**: *\"What have you made?\"*");
                response.AppendLine("• **Tech Stack**: *\"What do you work with?\"*");
                response.AppendLine("• **Education**: *\"Tell me about your studies\"*");
                response.AppendLine("• **CV / Resume**: *\"Can I get your resume?\"*");
                response.AppendLine("• **Contact**: *\"How can I reach you?\"*");
                return response.ToString();
            }

            // 8. Natural & Helpful Fallback (No robotic "Command Unrecognized")
            response.AppendLine("I'm not sure about that specific query yet, but I'd be glad to help you explore Saad's portfolio:");
            response.AppendLine("\n• **Projects**: *\"What projects has Saad built?\"*");
            response.AppendLine("• **Tech Stack**: *\"What technologies does he use?\"*");
            response.AppendLine("• **Education**: *\"Where did Saad study?\"*");
            response.AppendLine("• **CV**: *\"Download CV\"*");
            response.AppendLine("• **Contact**: *\"Connect on WhatsApp\"*");
            return response.ToString();
        }
    }
}
