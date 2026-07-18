using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class SettingsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public SettingsController(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            if (settings == null)
            {
                settings = new Settings { SiteName = "Futuristic Portfolio" };
                await _unitOfWork.Settings.AddAsync(settings);
                await _unitOfWork.CompleteAsync();
            }

            ViewBag.SocialLinks = (await _unitOfWork.SocialLinks.GetAllAsync()).ToList();

            return View(settings);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditSettings(Settings model, IFormFile? Logo, IFormFile? Favicon, IFormFile? CV, IFormFile? AboutPic)
        {
            if (ModelState.IsValid)
            {
                var existing = await _unitOfWork.Settings.GetByIdAsync(model.Id);
                if (existing == null) return NotFound();

                // Update settings attributes
                existing.SiteName = model.SiteName;
                existing.Theme = model.Theme;
                existing.PrimaryColorHex = model.PrimaryColorHex;
                existing.FooterText = model.FooterText;
                
                existing.MetaTitle = model.MetaTitle;
                existing.MetaDescription = model.MetaDescription;
                existing.GoogleAnalyticsId = model.GoogleAnalyticsId;

                existing.Biography = model.Biography;
                existing.YearsOfExperience = model.YearsOfExperience;
                existing.EducationShort = model.EducationShort;
                existing.Journey = model.Journey;
                existing.Goals = model.Goals;

                existing.ContactEmail = model.ContactEmail;
                existing.ContactPhone = model.ContactPhone;
                existing.ContactAddress = model.ContactAddress;
                existing.OpenStreetMapEmbedUrl = model.OpenStreetMapEmbedUrl;

                existing.SmtpHost = model.SmtpHost;
                existing.SmtpPort = model.SmtpPort;
                existing.SmtpUsername = model.SmtpUsername;
                existing.SmtpEnableSsl = model.SmtpEnableSsl;

                if (!string.IsNullOrEmpty(model.SmtpPassword))
                {
                    existing.SmtpPassword = model.SmtpPassword;
                }

                // Handle Logo upload
                if (Logo != null)
                {
                    if (!string.IsNullOrEmpty(existing.LogoPath)) _fileService.DeleteFile(existing.LogoPath);
                    existing.LogoPath = await _fileService.UploadFileAsync(Logo, "branding");
                }

                // Handle Favicon upload
                if (Favicon != null)
                {
                    if (!string.IsNullOrEmpty(existing.FaviconPath)) _fileService.DeleteFile(existing.FaviconPath);
                    existing.FaviconPath = await _fileService.UploadFileAsync(Favicon, "branding");
                }

                // Handle Profile picture upload
                if (AboutPic != null)
                {
                    if (!string.IsNullOrEmpty(existing.AboutPicturePath)) _fileService.DeleteFile(existing.AboutPicturePath);
                    existing.AboutPicturePath = await _fileService.UploadFileAsync(AboutPic, "profile");
                }

                // Handle CV file upload
                if (CV != null)
                {
                    if (!string.IsNullOrEmpty(existing.CvFilePath)) _fileService.DeleteFile(existing.CvFilePath);
                    existing.CvFilePath = await _fileService.UploadFileAsync(CV, "documents");
                }

                _unitOfWork.Settings.Update(existing);
                await _unitOfWork.CompleteAsync();

                await LogActivityAsync("Edit Settings", "Updated global site settings configurations");

                return RedirectToAction(nameof(Index));
            }

            ViewBag.SocialLinks = (await _unitOfWork.SocialLinks.GetAllAsync()).ToList();
            return View("Index", model);
        }

        // Add Social Link
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> AddSocialLink(SocialLink model)
        {
            if (ModelState.IsValid)
            {
                await _unitOfWork.SocialLinks.AddAsync(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Add Social Link", $"Added link for platform '{model.PlatformName}'");
            }
            return RedirectToAction(nameof(Index));
        }

        // Delete Social Link
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteSocialLink(int id)
        {
            var link = await _unitOfWork.SocialLinks.GetByIdAsync(id);
            if (link != null)
            {
                _unitOfWork.SocialLinks.Delete(link);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Social Link", $"Removed social link for '{link.PlatformName}'");
            }
            return RedirectToAction(nameof(Index));
        }

        // Database Export / Backup
        [HttpGet]
        public async Task<IActionResult> ExportData()
        {
            var exportObj = new
            {
                Projects = await _unitOfWork.Projects.GetAllAsync(),
                ProjectImages = await _unitOfWork.ProjectImages.GetAllAsync(),
                ProjectVideos = await _unitOfWork.ProjectVideos.GetAllAsync(),
                Skills = await _unitOfWork.Skills.GetAllAsync(),
                Certificates = await _unitOfWork.Certificates.GetAllAsync(),
                Experiences = await _unitOfWork.Experiences.GetAllAsync(),
                Educations = await _unitOfWork.Educations.GetAllAsync(),
                Testimonials = await _unitOfWork.Testimonials.GetAllAsync(),
                Blogs = await _unitOfWork.Blogs.GetAllAsync(),
                Categories = await _unitOfWork.Categories.GetAllAsync(),
                Settings = await _unitOfWork.Settings.GetAllAsync(),
                Statistics = await _unitOfWork.Statistics.GetAllAsync(),
                SocialLinks = await _unitOfWork.SocialLinks.GetAllAsync()
            };

            var jsonBytes = JsonSerializer.SerializeToUtf8Bytes(exportObj, new JsonSerializerOptions { WriteIndented = true });
            return File(jsonBytes, "application/json", "portfolio_databank_backup.json");
        }

        // Database Import / Restore
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ImportData(IFormFile backupFile)
        {
            if (backupFile == null || backupFile.Length == 0)
            {
                return BadRequest("Invalid backup file");
            }

            try
            {
                using var stream = backupFile.OpenReadStream();
                using var doc = await JsonDocument.ParseAsync(stream);
                var root = doc.RootElement;

                // Deserialization helper
                // We clear database tables and insert new ones
                // Note: Simple loop structure to re-populate tables safely
                
                if (root.TryGetProperty("Projects", out var projectsElem))
                {
                    var projs = JsonSerializer.Deserialize<List<Project>>(projectsElem.GetRawText());
                    if (projs != null)
                    {
                        var oldProjs = await _unitOfWork.Projects.GetAllAsync();
                        foreach (var op in oldProjs) _unitOfWork.Projects.Delete(op);
                        foreach (var p in projs)
                        {
                            p.Id = 0; // reset ID for identity insert
                            await _unitOfWork.Projects.AddAsync(p);
                        }
                    }
                }

                if (root.TryGetProperty("Skills", out var skillsElem))
                {
                    var sks = JsonSerializer.Deserialize<List<Skill>>(skillsElem.GetRawText());
                    if (sks != null)
                    {
                        var oldSks = await _unitOfWork.Skills.GetAllAsync();
                        foreach (var os in oldSks) _unitOfWork.Skills.Delete(os);
                        foreach (var s in sks)
                        {
                            s.Id = 0;
                            await _unitOfWork.Skills.AddAsync(s);
                        }
                    }
                }

                if (root.TryGetProperty("Experiences", out var expElem))
                {
                    var exps = JsonSerializer.Deserialize<List<Experience>>(expElem.GetRawText());
                    if (exps != null)
                    {
                        var oldExps = await _unitOfWork.Experiences.GetAllAsync();
                        foreach (var oe in oldExps) _unitOfWork.Experiences.Delete(oe);
                        foreach (var e in exps)
                        {
                            e.Id = 0;
                            await _unitOfWork.Experiences.AddAsync(e);
                        }
                    }
                }

                if (root.TryGetProperty("Educations", out var eduElem))
                {
                    var edus = JsonSerializer.Deserialize<List<Education>>(eduElem.GetRawText());
                    if (edus != null)
                    {
                        var oldEdus = await _unitOfWork.Educations.GetAllAsync();
                        foreach (var od in oldEdus) _unitOfWork.Educations.Delete(od);
                        foreach (var ed in edus)
                        {
                            ed.Id = 0;
                            await _unitOfWork.Educations.AddAsync(ed);
                        }
                    }
                }

                if (root.TryGetProperty("Certificates", out var certElem))
                {
                    var certs = JsonSerializer.Deserialize<List<Certificate>>(certElem.GetRawText());
                    if (certs != null)
                    {
                        var oldCerts = await _unitOfWork.Certificates.GetAllAsync();
                        foreach (var oc in oldCerts) _unitOfWork.Certificates.Delete(oc);
                        foreach (var c in certs)
                        {
                            c.Id = 0;
                            await _unitOfWork.Certificates.AddAsync(c);
                        }
                    }
                }

                if (root.TryGetProperty("Testimonials", out var testElem))
                {
                    var tests = JsonSerializer.Deserialize<List<Testimonial>>(testElem.GetRawText());
                    if (tests != null)
                    {
                        var oldTests = await _unitOfWork.Testimonials.GetAllAsync();
                        foreach (var ot in oldTests) _unitOfWork.Testimonials.Delete(ot);
                        foreach (var t in tests)
                        {
                            t.Id = 0;
                            await _unitOfWork.Testimonials.AddAsync(t);
                        }
                    }
                }

                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Import Restore", "Restored databank from backup configuration file");
                
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                return BadRequest("Databank restore failed: " + ex.Message);
            }
        }

        private async Task LogActivityAsync(string action, string details)
        {
            var log = new ActivityLog
            {
                Action = action,
                Details = details,
                Timestamp = DateTime.UtcNow,
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
            };
            await _unitOfWork.ActivityLogs.AddAsync(log);
            await _unitOfWork.CompleteAsync();
        }
    }
}
