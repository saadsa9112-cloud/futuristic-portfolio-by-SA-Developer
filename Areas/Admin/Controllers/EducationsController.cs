using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class EducationsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public EducationsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {
            var edus = (await _unitOfWork.Educations.GetAllAsync()).OrderByDescending(e => e.StartDate).ToList();
            return View(edus);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Education model)
        {
            if (ModelState.IsValid)
            {
                await _unitOfWork.Educations.AddAsync(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Add Education", $"Added academic node at '{model.Institution}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var edu = await _unitOfWork.Educations.GetByIdAsync(id);
            if (edu == null) return NotFound();
            return View(edu);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Education model)
        {
            if (ModelState.IsValid)
            {
                _unitOfWork.Educations.Update(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Edit Education", $"Updated academic node '{model.Institution}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var edu = await _unitOfWork.Educations.GetByIdAsync(id);
            if (edu != null)
            {
                _unitOfWork.Educations.Delete(edu);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Education", $"Deleted academic node for '{edu.Institution}'");
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
