using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Controllers
{
    public class BlogController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public BlogController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // List blog posts
        public async Task<IActionResult> Index(string? search, int? categoryId, int page = 1)
        {
            const int pageSize = 6;
            var query = await _unitOfWork.Blogs.GetAllAsync();
            var blogs = query.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                var lowerSearch = search.ToLower();
                blogs = blogs.Where(b => 
                    b.Title.ToLower().Contains(lowerSearch) || 
                    b.Content.ToLower().Contains(lowerSearch) || 
                    (b.Tags != null && b.Tags.ToLower().Contains(lowerSearch))
                );
            }

            if (categoryId.HasValue)
            {
                blogs = blogs.Where(b => b.CategoryId == categoryId.Value);
            }

            blogs = blogs.OrderByDescending(b => b.CreatedDate);

            var totalBlogs = blogs.Count();
            var totalPages = (int)Math.Ceiling((double)totalBlogs / pageSize);

            var paginatedBlogs = blogs
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            ViewBag.Categories = (await _unitOfWork.Categories.FindAsync(c => c.Type == "Blog")).ToList();
            ViewBag.CurrentCategory = categoryId;
            ViewBag.Search = search;
            ViewBag.CurrentPage = page;
            ViewBag.TotalPages = totalPages;

            ViewBag.Settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            ViewBag.SocialLinks = (await _unitOfWork.SocialLinks.GetAllAsync()).ToList();

            return View(paginatedBlogs);
        }

        // Details of a single blog post by Slug
        public async Task<IActionResult> Details(string slug)
        {
            var blogs = await _unitOfWork.Blogs.GetAllAsync();
            var blog = blogs.FirstOrDefault(b => b.Slug.Equals(slug, StringComparison.OrdinalIgnoreCase));

            if (blog == null)
            {
                return NotFound();
            }

            // Increment View Counter
            blog.ViewCount++;
            _unitOfWork.Blogs.Update(blog);
            await _unitOfWork.CompleteAsync();

            ViewBag.Settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            ViewBag.SocialLinks = (await _unitOfWork.SocialLinks.GetAllAsync()).ToList();
            
            // Recent posts list
            ViewBag.RecentBlogs = blogs.Where(b => b.Id != blog.Id).OrderByDescending(b => b.CreatedDate).Take(3).ToList();

            return View(blog);
        }
    }
}
