using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Text.RegularExpressions;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class BlogsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public BlogsController(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<IActionResult> Index()
        {
            var blogs = (await _unitOfWork.Blogs.GetAllAsync()).OrderByDescending(b => b.CreatedDate).ToList();
            return View(blogs);
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Blog");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Blog model, IFormFile? CoverImage)
        {
            if (ModelState.IsValid)
            {
                // Generate URL slug from Title if empty
                if (string.IsNullOrEmpty(model.Slug))
                {
                    model.Slug = GenerateSlug(model.Title);
                }
                else
                {
                    model.Slug = GenerateSlug(model.Slug);
                }

                if (CoverImage != null)
                {
                    model.ImagePath = await _fileService.UploadFileAsync(CoverImage, "blogs");
                }

                model.CreatedDate = DateTime.UtcNow;

                await _unitOfWork.Blogs.AddAsync(model);
                await _unitOfWork.CompleteAsync();

                await LogActivityAsync("Add Blog", $"Published article '{model.Title}'");
                return RedirectToAction(nameof(Index));
            }

            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Blog");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog == null) return NotFound();

            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Blog");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name", blog.CategoryId);
            return View(blog);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Blog model, IFormFile? CoverImage)
        {
            if (ModelState.IsValid)
            {
                var existingBlog = await _unitOfWork.Blogs.GetByIdAsync(model.Id);
                if (existingBlog == null) return NotFound();

                existingBlog.Title = model.Title;
                existingBlog.Content = model.Content;
                existingBlog.CategoryId = model.CategoryId;
                existingBlog.Tags = model.Tags;
                existingBlog.MetaTitle = model.MetaTitle;
                existingBlog.MetaDescription = model.MetaDescription;

                if (string.IsNullOrEmpty(model.Slug))
                {
                    existingBlog.Slug = GenerateSlug(model.Title);
                }
                else
                {
                    existingBlog.Slug = GenerateSlug(model.Slug);
                }

                if (CoverImage != null)
                {
                    if (!string.IsNullOrEmpty(existingBlog.ImagePath))
                    {
                        _fileService.DeleteFile(existingBlog.ImagePath);
                    }
                    existingBlog.ImagePath = await _fileService.UploadFileAsync(CoverImage, "blogs");
                }

                _unitOfWork.Blogs.Update(existingBlog);
                await _unitOfWork.CompleteAsync();

                await LogActivityAsync("Edit Blog", $"Updated article '{model.Title}'");
                return RedirectToAction(nameof(Index));
            }

            var categories = await _unitOfWork.Categories.FindAsync(c => c.Type == "Blog");
            ViewBag.CategoryId = new SelectList(categories, "Id", "Name", model.CategoryId);
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _unitOfWork.Blogs.GetByIdAsync(id);
            if (blog != null)
            {
                if (!string.IsNullOrEmpty(blog.ImagePath))
                {
                    _fileService.DeleteFile(blog.ImagePath);
                }
                _unitOfWork.Blogs.Delete(blog);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Blog", $"Deleted article '{blog.Title}'");
            }
            return RedirectToAction(nameof(Index));
        }

        private string GenerateSlug(string phrase)
        {
            string str = phrase.ToLower();
            // invalid chars           
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            // convert multiple spaces into a single space   
            str = Regex.Replace(str, @"\s+", " ").Trim();
            // cut and trim 
            str = str.Substring(0, str.Length <= 45 ? str.Length : 45).Trim();
            // hyphens   
            str = Regex.Replace(str, @"\s", "-");
            return str;
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
