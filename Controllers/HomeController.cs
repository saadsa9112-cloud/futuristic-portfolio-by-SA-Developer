using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace FuturisticPortfolio.Controllers
{
    public class HomeController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<HomeController> _logger;

        public HomeController(IUnitOfWork unitOfWork, ILogger<HomeController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            
            // Create default settings if database seeding was skipped
            if (settings == null)
            {
                settings = new Settings { SiteName = "Futuristic Portfolio" };
                await _unitOfWork.Settings.AddAsync(settings);
                await _unitOfWork.CompleteAsync();
            }

            var skills = (await _unitOfWork.Skills.GetAllAsync())
                .OrderBy(s => s.DisplayOrder)
                .ToList();

            var experiences = (await _unitOfWork.Experiences.GetAllAsync())
                .OrderByDescending(e => e.StartDate)
                .ToList();

            var educations = (await _unitOfWork.Educations.GetAllAsync())
                .OrderByDescending(e => e.StartDate)
                .ToList();

            var testimonials = (await _unitOfWork.Testimonials.GetAllAsync()).ToList();

            var stats = (await _unitOfWork.Statistics.GetAllAsync())
                .OrderBy(s => s.DisplayOrder)
                .ToList();

            // Load Latest Projects
            var latestProjects = (await _unitOfWork.Projects.FindAsync(p => p.Status == "Published"))
                .OrderBy(p => p.DisplayOrder)
                .Take(3)
                .ToList();

            // Find the featured project (first featured, otherwise fallback to latest)
            var featuredProject = (await _unitOfWork.Projects.FindAsync(p => p.Status == "Published" && p.FeaturedOption))
                .FirstOrDefault() ?? latestProjects.FirstOrDefault();

            ViewBag.Settings = settings;
            ViewBag.Skills = skills;
            ViewBag.Experiences = experiences;
            ViewBag.Educations = educations;
            ViewBag.Testimonials = testimonials;
            ViewBag.Statistics = stats;
            ViewBag.FeaturedProject = featuredProject;
            ViewBag.LatestProjects = latestProjects;

            // Load social links
            ViewBag.SocialLinks = (await _unitOfWork.SocialLinks.GetAllAsync()).ToList();

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ContactSubmit(Message model)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return Json(new { success = false, errors });
            }

            model.CreatedDate = DateTime.UtcNow;
            model.IsRead = false;

            await _unitOfWork.Messages.AddAsync(model);
            await _unitOfWork.CompleteAsync();

            return Json(new { success = true });
        }

        public async Task<IActionResult> DownloadCv()
        {
            var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            if (settings != null)
            {
                settings.CvDownloadCount++;
                _unitOfWork.Settings.Update(settings);
                await _unitOfWork.CompleteAsync();

                if (!string.IsNullOrEmpty(settings.CvFilePath))
                {
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", settings.CvFilePath.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                    {
                        var contentType = "application/pdf";
                        return PhysicalFile(filePath, contentType, Path.GetFileName(filePath));
                    }
                }
            }

            return RedirectToAction(nameof(Index));
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View();
        }
    }
}
