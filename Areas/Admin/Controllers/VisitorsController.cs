using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class VisitorsController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIPSecurityService _ipSecurityService;

        public VisitorsController(IUnitOfWork unitOfWork, IIPSecurityService ipSecurityService)
        {
            _unitOfWork = unitOfWork;
            _ipSecurityService = ipSecurityService;
        }

        public async Task<IActionResult> Index(string? searchIp, string? filterCountry)
        {
            var visitors = (await _unitOfWork.Visitors.GetAllAsync()).ToList();

            if (!string.IsNullOrEmpty(searchIp))
            {
                visitors = visitors.Where(v => v.IpAddress.Contains(searchIp)).ToList();
            }

            if (!string.IsNullOrEmpty(filterCountry))
            {
                visitors = visitors.Where(v => v.Country != null && v.Country.Contains(filterCountry, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            visitors = visitors.OrderByDescending(v => v.VisitDate).ToList();

            ViewBag.SearchIp = searchIp;
            ViewBag.FilterCountry = filterCountry;
            ViewBag.BlockedIps = _ipSecurityService.GetBlockedIps();

            return View(visitors);
        }

        public async Task<IActionResult> Details(int id)
        {
            var visitor = await _unitOfWork.Visitors.GetByIdAsync(id);
            if (visitor == null)
            {
                return NotFound();
            }

            // Fetch activity logs matching this visitor's IP
            var logs = (await _unitOfWork.ActivityLogs.GetAllAsync())
                .Where(l => l.IpAddress == visitor.IpAddress)
                .OrderByDescending(l => l.Timestamp)
                .ToList();

            ViewBag.Logs = logs;
            ViewBag.IsBlocked = _ipSecurityService.IsIpBlocked(visitor.IpAddress);
            return View(visitor);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult BlockIp(string ip, string? returnUrl)
        {
            _ipSecurityService.BlockIp(ip);
            TempData["SuccessMessage"] = $"IP Node '{ip}' has been blacklisted successfully!";
            if (!string.IsNullOrEmpty(returnUrl)) return Redirect(returnUrl);
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult UnblockIp(string ip, string? returnUrl)
        {
            _ipSecurityService.UnblockIp(ip);
            TempData["SuccessMessage"] = $"IP Node '{ip}' has been removed from the blacklist.";
            if (!string.IsNullOrEmpty(returnUrl)) return Redirect(returnUrl);
            return RedirectToAction(nameof(Index));
        }
    }
}
