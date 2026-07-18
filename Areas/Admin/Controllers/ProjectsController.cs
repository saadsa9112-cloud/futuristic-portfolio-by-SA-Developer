using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ProjectsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public ProjectsController(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        // List Projects
        public async Task<IActionResult> Index()
        {
            var projects = (await _unitOfWork.Projects.GetAllAsync()).OrderBy(p => p.DisplayOrder).ToList();
            return View(projects);
        }

        // Create Project GET
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Project");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name");
            return View();
        }

        // Create Project POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Project model, IFormFile? Thumbnail, List<IFormFile>? Gallery, string? VideoPath, string? DocumentPdf)
        {
            if (ModelState.IsValid)
            {
                // Upload Thumbnail
                if (Thumbnail != null)
                {
                    model.ThumbnailPath = await _fileService.UploadFileAsync(Thumbnail, "projects");
                }

                // If marked featured, un-feature all other projects first
                if (model.FeaturedOption)
                {
                    var allFeatured = await _unitOfWork.Projects.FindAsync(p => p.FeaturedOption);
                    foreach (var f in allFeatured)
                    {
                        f.FeaturedOption = false;
                        _unitOfWork.Projects.Update(f);
                    }
                }

                await _unitOfWork.Projects.AddAsync(model);
                await _unitOfWork.CompleteAsync();

                // Upload Gallery Images
                if (Gallery != null && Gallery.Any())
                {
                    foreach (var img in Gallery)
                    {
                        var path = await _fileService.UploadFileAsync(img, "gallery");
                        var projImg = new ProjectImage { ProjectId = model.Id, ImagePath = path };
                        await _unitOfWork.ProjectImages.AddAsync(projImg);
                    }
                }

                // Add Video if present
                if (!string.IsNullOrEmpty(VideoPath))
                {
                    var projVid = new ProjectVideo { ProjectId = model.Id, VideoPath = VideoPath, IsExternal = true };
                    await _unitOfWork.ProjectVideos.AddAsync(projVid);
                }

                await _unitOfWork.CompleteAsync();

                // Add Activity Log
                await LogActivityAsync("Add Project", $"Created project '{model.Title}'");

                return RedirectToAction(nameof(Index));
            }

            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Project");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        // Edit Project GET
        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var project = await _unitOfWork.Projects.GetByIdAsync(id);
            if (project == null) return NotFound();

            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Project");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name", project.CategoryId);

            var images = await _unitOfWork.ProjectImages.FindAsync(pi => pi.ProjectId == id);
            ViewBag.GalleryImages = images.ToList();

            var video = (await _unitOfWork.ProjectVideos.FindAsync(pv => pv.ProjectId == id)).FirstOrDefault();
            ViewBag.VideoPath = video?.VideoPath;

            return View(project);
        }

        // Edit Project POST
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Project model, IFormFile? Thumbnail, List<IFormFile>? Gallery, string? VideoPath)
        {
            if (ModelState.IsValid)
            {
                var existingProject = await _unitOfWork.Projects.GetByIdAsync(model.Id);
                if (existingProject == null) return NotFound();

                // Copy over modified fields
                existingProject.Title = model.Title;
                existingProject.Subtitle = model.Subtitle;
                existingProject.Description = model.Description;
                existingProject.CategoryId = model.CategoryId;
                existingProject.Technologies = model.Technologies;
                existingProject.GitHubLink = model.GitHubLink;
                existingProject.LiveDemo = model.LiveDemo;
                existingProject.Status = model.Status;
                existingProject.DisplayOrder = model.DisplayOrder;
                existingProject.Date = model.Date;
                
                // Case Study fields
                existingProject.Challenges = model.Challenges;
                existingProject.Solutions = model.Solutions;
                existingProject.ArchitectureDescription = model.ArchitectureDescription;
                existingProject.DatabaseDesignDescription = model.DatabaseDesignDescription;
                existingProject.TimelineDescription = model.TimelineDescription;

                // Handle Featured toggle
                if (model.FeaturedOption && !existingProject.FeaturedOption)
                {
                    var allFeatured = await _unitOfWork.Projects.FindAsync(p => p.FeaturedOption);
                    foreach (var f in allFeatured)
                    {
                        f.FeaturedOption = false;
                        _unitOfWork.Projects.Update(f);
                    }
                    existingProject.FeaturedOption = true;
                }
                else if (!model.FeaturedOption)
                {
                    existingProject.FeaturedOption = false;
                }

                // Handle Thumbnail upload
                if (Thumbnail != null)
                {
                    _fileService.DeleteFile(existingProject.ThumbnailPath);
                    existingProject.ThumbnailPath = await _fileService.UploadFileAsync(Thumbnail, "projects");
                }

                _unitOfWork.Projects.Update(existingProject);
                await _unitOfWork.CompleteAsync();

                // Handle Gallery Uploads
                if (Gallery != null && Gallery.Any())
                {
                    foreach (var img in Gallery)
                    {
                        var path = await _fileService.UploadFileAsync(img, "gallery");
                        var projImg = new ProjectImage { ProjectId = model.Id, ImagePath = path };
                        await _unitOfWork.ProjectImages.AddAsync(projImg);
                    }
                }

                // Update Video
                var existingVids = await _unitOfWork.ProjectVideos.FindAsync(pv => pv.ProjectId == model.Id);
                foreach (var ev in existingVids)
                {
                    _unitOfWork.ProjectVideos.Delete(ev);
                }

                if (!string.IsNullOrEmpty(VideoPath))
                {
                    var projVid = new ProjectVideo { ProjectId = model.Id, VideoPath = VideoPath, IsExternal = true };
                    await _unitOfWork.ProjectVideos.AddAsync(projVid);
                }

                await _unitOfWork.CompleteAsync();

                await LogActivityAsync("Edit Project", $"Updated project '{model.Title}'");

                return RedirectToAction(nameof(Index));
            }

            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Project");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        // Delete Gallery Image
        [HttpPost]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var img = await _unitOfWork.ProjectImages.GetByIdAsync(id);
            if (img != null)
            {
                _fileService.DeleteFile(img.ImagePath);
                _unitOfWork.ProjectImages.Delete(img);
                await _unitOfWork.CompleteAsync();
                return Json(new { success = true });
            }
            return Json(new { success = false });
        }

        // Delete Project
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var project = await _unitOfWork.Projects.GetByIdAsync(id);
            if (project != null)
            {
                // Delete assets first
                _fileService.DeleteFile(project.ThumbnailPath);

                var gallery = await _unitOfWork.ProjectImages.FindAsync(pi => pi.ProjectId == id);
                foreach (var g in gallery)
                {
                    _fileService.DeleteFile(g.ImagePath);
                }

                _unitOfWork.Projects.Delete(project);
                await _unitOfWork.CompleteAsync();

                await LogActivityAsync("Delete Project", $"Deleted project '{project.Title}'");
            }
            return RedirectToAction(nameof(Index));
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
