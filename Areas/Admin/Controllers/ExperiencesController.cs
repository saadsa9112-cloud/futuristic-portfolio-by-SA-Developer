using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class ExperiencesController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public ExperiencesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {
            var exps = (await _unitOfWork.Experiences.GetAllAsync()).OrderByDescending(e => e.StartDate).ToList();
            return View(exps);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Experience model)
        {
            if (ModelState.IsValid)
            {
                await _unitOfWork.Experiences.AddAsync(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Add Experience", $"Added career node at '{model.Company}' as '{model.Role}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var exp = await _unitOfWork.Experiences.GetByIdAsync(id);
            if (exp == null) return NotFound();
            return View(exp);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Experience model)
        {
            if (ModelState.IsValid)
            {
                _unitOfWork.Experiences.Update(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Edit Experience", $"Updated career node '{model.Company}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var exp = await _unitOfWork.Experiences.GetByIdAsync(id);
            if (exp != null)
            {
                _unitOfWork.Experiences.Delete(exp);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Experience", $"Deleted career node for '{exp.Company}'");
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
