using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class MessagesController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public MessagesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {
            var msgs = (await _unitOfWork.Messages.GetAllAsync()).OrderByDescending(m => m.CreatedDate).ToList();
            return View(msgs);
        }

        public async Task<IActionResult> Details(int id)
        {
            var msg = await _unitOfWork.Messages.GetByIdAsync(id);
            if (msg == null) return NotFound();

            if (!msg.IsRead)
            {
                msg.IsRead = true;
                _unitOfWork.Messages.Update(msg);
                await _unitOfWork.CompleteAsync();
            }

            return View(msg);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Reply(int id, string replyText)
        {
            var msg = await _unitOfWork.Messages.GetByIdAsync(id);
            if (msg == null) return NotFound();

            msg.ReplyText = replyText;
            msg.RepliedDate = DateTime.UtcNow;
            _unitOfWork.Messages.Update(msg);
            await _unitOfWork.CompleteAsync();

            // Retrieve SMTP configurations and send actual email
            var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            if (settings != null && !string.IsNullOrEmpty(settings.SmtpHost) && !string.IsNullOrEmpty(settings.SmtpUsername))
            {
                try
                {
                    using var mail = new System.Net.Mail.MailMessage();
                    mail.From = new System.Net.Mail.MailAddress(settings.SmtpUsername, settings.SiteName.Split('|')[0].Trim());
                    mail.To.Add(msg.Email);
                    mail.Subject = $"Re: {msg.Subject}";
                    mail.IsBodyHtml = true;
                    
                    mail.Body = $@"
                        <div style='background:#ffffff; color:#1e293b; font-family:sans-serif; padding:30px; border:1px solid #e2e8f0; max-width:600px; border-radius:8px;'>
                            <h3 style='color:#a855f7; font-size:18px; margin-bottom:20px;'>Response from {settings.SiteName.Split('|')[0].Trim()}</h3>
                            <p style='font-size:15px; line-height:1.6; color:#334155; margin-bottom:25px; white-space:pre-wrap;'>{replyText}</p>
                            <div style='border-top:1px solid #f1f5f9; padding-top:20px; margin-top:30px; font-size:13px; color:#64748b;'>
                                <p style='margin-bottom:5px; font-weight:bold;'>--- Original Message ---</p>
                                <p style='margin:0; font-style:italic;'>""{msg.Body}""</p>
                                <p style='margin:5px 0 0 0;'>Sent by: {msg.Name} ({msg.Email}) on {msg.CreatedDate.ToString("dd MMM yyyy")}</p>
                            </div>
                        </div>";

                    using var smtp = new System.Net.Mail.SmtpClient(settings.SmtpHost, settings.SmtpPort);
                    smtp.Credentials = new System.Net.NetworkCredential(settings.SmtpUsername, settings.SmtpPassword);
                    smtp.EnableSsl = settings.SmtpEnableSsl;
                    await smtp.SendMailAsync(mail);
                    
                    TempData["SuccessMessage"] = "Reply sent and email successfully transmitted to recipient!";
                }
                catch (Exception ex)
                {
                    TempData["ErrorMessage"] = $"Reply saved, but email transmission failed: {ex.Message}";
                }
            }
            else
            {
                TempData["ErrorMessage"] = "Reply saved in database, but SMTP configurations are missing. Email was not dispatched.";
            }

            await LogActivityAsync("Reply Message", $"Sent reply to '{msg.Email}'");

            return RedirectToAction(nameof(Details), new { id });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var msg = await _unitOfWork.Messages.GetByIdAsync(id);
            if (msg != null)
            {
                _unitOfWork.Messages.Delete(msg);
                await _unitOfWork.CompleteAsync();
                await LogActivityAsync("Delete Message", $"Deleted contact message from '{msg.Email}'");
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
