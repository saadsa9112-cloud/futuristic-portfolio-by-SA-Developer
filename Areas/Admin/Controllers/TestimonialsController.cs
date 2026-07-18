using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class TestimonialsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public TestimonialsController(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<IActionResult> Index()
        {
            var tests = (await _unitOfWork.Testimonials.GetAllAsync()).ToList();
            return View(tests);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Testimonial model, IFormFile? ClientPhoto)
        {
            if (ModelState.IsValid)
            {
                if (ClientPhoto != null)
                {
                    model.ClientImagePath = await _fileService.UploadFileAsync(ClientPhoto, "testimonials");
                }

                await _unitOfWork.Testimonials.AddAsync(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Add Testimonial", $"Added client feedback from '{model.ClientName}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var test = await _unitOfWork.Testimonials.GetByIdAsync(id);
            if (test == null) return NotFound();
            return View(test);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Testimonial model, IFormFile? ClientPhoto)
        {
            if (ModelState.IsValid)
            {
                var existing = await _unitOfWork.Testimonials.GetByIdAsync(model.Id);
                if (existing == null) return NotFound();

                existing.ClientName = model.ClientName;
                existing.ClientTitle = model.ClientTitle;
                existing.Feedback = model.Feedback;
                existing.Rating = model.Rating;

                if (ClientPhoto != null)
                {
                    if (!string.IsNullOrEmpty(existing.ClientImagePath)) _fileService.DeleteFile(existing.ClientImagePath);
                    existing.ClientImagePath = await _fileService.UploadFileAsync(ClientPhoto, "testimonials");
                }

                _unitOfWork.Testimonials.Update(existing);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Edit Testimonial", $"Updated feedback for '{model.ClientName}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var test = await _unitOfWork.Testimonials.GetByIdAsync(id);
            if (test != null)
            {
                if (!string.IsNullOrEmpty(test.ClientImagePath)) _fileService.DeleteFile(test.ClientImagePath);

                _unitOfWork.Testimonials.Delete(test);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Testimonial", $"Deleted client feedback for '{test.ClientName}'");
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
