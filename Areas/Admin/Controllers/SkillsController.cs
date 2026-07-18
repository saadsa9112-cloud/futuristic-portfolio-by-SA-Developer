using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class SkillsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public SkillsController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {
            var skills = (await _unitOfWork.Skills.GetAllAsync()).OrderBy(s => s.DisplayOrder).ToList();
            return View(skills);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Skill model)
        {
            if (ModelState.IsValid)
            {
                await _unitOfWork.Skills.AddAsync(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Add Skill", $"Added skill '{model.Name}' at {model.Percentage}%");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var skill = await _unitOfWork.Skills.GetByIdAsync(id);
            if (skill == null) return NotFound();
            return View(skill);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Skill model)
        {
            if (ModelState.IsValid)
            {
                _unitOfWork.Skills.Update(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Edit Skill", $"Updated skill '{model.Name}' to {model.Percentage}%");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var skill = await _unitOfWork.Skills.GetByIdAsync(id);
            if (skill != null)
            {
                _unitOfWork.Skills.Delete(skill);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Skill", $"Deleted skill '{skill.Name}'");
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
