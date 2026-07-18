using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FuturisticPortfolio.Controllers
{
    public class PortfolioController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public PortfolioController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // List Projects with Filtering & Search & Pagination
        public async Task<IActionResult> Index(string? search, int? categoryId, int page = 1)
        {
            const int pageSize = 6;
            
            // Get all published projects
            var query = await _unitOfWork.Projects.FindAsync(p => p.Status == "Published");
            var projects = query.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                projects = projects.Where(p => 
                    p.Title.ToLower().Contains(lowerSearch) || 
                    p.Subtitle.ToLower().Contains(lowerSearch) || 
                    (p.Technologies != null && p.Technologies.ToLower().Contains(lowerSearch))
                );
            }

            if (categoryId.HasValue)
            {
                projects = projects.Where(p => p.CategoryId == categoryId.Value);
            }

            // Order by display order
            projects = projects.OrderBy(p => p.DisplayOrder);

            var totalProjects = projects.Count();
            var totalPages = (int)Math.Ceiling((double)totalProjects / pageSize);
            
            var paginatedProjects = projects
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Populate categories for filter list
            ViewBag.Categories = (await _unitOfWork.Categories.FindAsync(c => c.Type == "Project")).ToList();
            ViewBag.CurrentCategory = categoryId;
            ViewBag.Search = search;
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            // Load site settings for footers/socials
            ViewBag.Settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            ViewBag.SocialLinks = (await _unitOfWork.SocialLinks.GetAllAsync()).ToList();

            return View(paginatedProjects);
        }

        // Project Details / Case Study
        public async Task<IActionResult> Details(int id)
        {
            // Retrieve project including images/videos
            var projects = await _unitOfWork.Projects.GetAllAsync();
            var project = projects.FirstOrDefault(p => p.Id == id);
            
            if (project == null || project.Status == "Draft")
            {
                return NotFound();
            }

            // Increment view counter
            project.ViewCount++;
            _unitOfWork.Projects.Update(project);
            await _unitOfWork.CompleteAsync();

            // Fetch Project details relation manually since generic repo abstracts it
            var allImages = await _unitOfWork.ProjectImages.FindAsync(pi => pi.ProjectId == id);
            project.ProjectImages = allImages.ToList();

            var allVideos = await _unitOfWork.ProjectVideos.FindAsync(pv => pv.ProjectId == id);
            project.ProjectVideos = allVideos.ToList();

            // Next & Previous projects
            var publishedProjects = (await _unitOfWork.Projects.FindAsync(p => p.Status == "Published"))
                .OrderBy(p => p.DisplayOrder)
                .ToList();

            var currentIndex = publishedProjects.FindIndex(p => p.Id == id);
            
            Project? prevProject = currentIndex > 0 ? publishedProjects[currentIndex - 1] : null;
            Project? nextProject = currentIndex < publishedProjects.Count - 1 ? publishedProjects[currentIndex + 1] : null;

            ViewBag.PrevProject = prevProject;
            ViewBag.NextProject = nextProject;
            ViewBag.Settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            ViewBag.SocialLinks = (await _unitOfWork.SocialLinks.GetAllAsync()).ToList();

            return View(project);
        }
    }
}
