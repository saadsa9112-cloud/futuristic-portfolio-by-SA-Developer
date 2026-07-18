using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class CertificatesController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileService _fileService;

        public CertificatesController(IUnitOfWork unitOfWork, IFileService fileService)
        {
            _unitOfWork = unitOfWork;
            _fileService = fileService;
        }

        public async Task<IActionResult> Index()
        {
            var certs = (await _unitOfWork.Certificates.GetAllAsync()).OrderByDescending(c => c.Date).ToList();
            return View(certs);
        }

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Certificate model, IFormFile? CertImage, IFormFile? CertPdf)
        {
            if (ModelState.IsValid)
            {
                if (CertImage != null)
                {
                    model.ImagePath = await _fileService.UploadFileAsync(CertImage, "certificates");
                }
                if (CertPdf != null)
                {
                    model.PdfPath = await _fileService.UploadFileAsync(CertPdf, "certificates");
                }

                await _unitOfWork.Certificates.AddAsync(model);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Add Certificate", $"Added certification '{model.Name}' issued by '{model.Organization}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var cert = await _unitOfWork.Certificates.GetByIdAsync(id);
            if (cert == null) return NotFound();
            return View(cert);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Certificate model, IFormFile? CertImage, IFormFile? CertPdf)
        {
            if (ModelState.IsValid)
            {
                var existing = await _unitOfWork.Certificates.GetByIdAsync(model.Id);
                if (existing == null) return NotFound();

                existing.Name = model.Name;
                existing.Organization = model.Organization;
                existing.Date = model.Date;

                if (CertImage != null)
                {
                    if (!string.IsNullOrEmpty(existing.ImagePath)) _fileService.DeleteFile(existing.ImagePath);
                    existing.ImagePath = await _fileService.UploadFileAsync(CertImage, "certificates");
                }
                if (CertPdf != null)
                {
                    if (!string.IsNullOrEmpty(existing.PdfPath)) _fileService.DeleteFile(existing.PdfPath);
                    existing.PdfPath = await _fileService.UploadFileAsync(CertPdf, "certificates");
                }

                _unitOfWork.Certificates.Update(existing);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Edit Certificate", $"Updated certification '{model.Name}'");
                return RedirectToAction(nameof(Index));
            }
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var cert = await _unitOfWork.Certificates.GetByIdAsync(id);
            if (cert != null)
            {
                if (!string.IsNullOrEmpty(cert.ImagePath)) _fileService.DeleteFile(cert.ImagePath);
                if (!string.IsNullOrEmpty(cert.PdfPath)) _fileService.DeleteFile(cert.PdfPath);

                _unitOfWork.Certificates.Delete(cert);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Certificate", $"Deleted certification '{cert.Name}'");
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
