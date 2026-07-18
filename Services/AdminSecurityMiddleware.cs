using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;

namespace FuturisticPortfolio.Services
{
    public static class AdminIpWhitelist
    {
        public static ConcurrentDictionary<string, bool> AllowedIps { get; } = new();
        public static ConcurrentDictionary<string, DateTime> SentMfaEmails { get; } = new();

        static AdminIpWhitelist()
        {
            AllowedIps.TryAdd("127.0.0.1", true);
            AllowedIps.TryAdd("::1", true);
            AllowedIps.TryAdd("localhost", true);

            try
            {
                // Auto-whitelist all InterNetwork IPv4 adapters on host machine
                var host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (var ipAddress in host.AddressList)
                {
                    if (ipAddress.AddressFamily == AddressFamily.InterNetwork)
                    {
                        AllowedIps.TryAdd(ipAddress.ToString(), true);
                    }
                }
            }
            catch { }
        }

        public static string GenerateApprovalToken(string ip)
        {
            using var sha = SHA256.Create();
            var hashBytes = sha.ComputeHash(Encoding.UTF8.GetBytes(ip + "SecretFuturisticSecurityKey_98765"));
            return Convert.ToHexString(hashBytes);
        }
    }

    public class AdminSecurityMiddleware
    {
        private readonly RequestDelegate _next;

        public AdminSecurityMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLowerInvariant() ?? "";

            // 1. Intercept IP Approval action
            if (path.Contains("/admin/auth/approveip"))
            {
                var ipToApprove = context.Request.Query["ip"].ToString();
                var token = context.Request.Query["token"].ToString();

                if (!string.IsNullOrEmpty(ipToApprove) && token == AdminIpWhitelist.GenerateApprovalToken(ipToApprove))
                {
                    AdminIpWhitelist.AllowedIps.TryAdd(ipToApprove, true);

                    context.Response.ContentType = "text/html";
                    await context.Response.WriteAsync($@"
                        <html>
                        <head>
                            <title>Access Granted</title>
                            <link href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap' rel='stylesheet'>
                            <style>
                                body {{ background: #0b0813; color: #10b981; font-family: 'Space Grotesk', sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; }}
                                .box {{ border: 2px solid #10b981; padding: 40px; background: rgba(16, 185, 129, 0.05); box-shadow: 0 0 30px rgba(16, 185, 129, 0.2); max-width: 500px; border-radius: 4px; }}
                                h1 {{ margin: 0 0 15px 0; text-shadow: 0 0 10px #10b981; }}
                                p {{ color: #cbd5e1; line-height: 1.6; margin-bottom: 20px; }}
                            </style>
                        </head>
                        <body>
                            <div class='box'>
                                <h1>✔️ HANDSHAKE AUTHORIZED</h1>
                                <p>IP address <strong>{ipToApprove}</strong> has been whitelisted. Remote access to the admin panel from this terminal is now active.</p>
                                <p style='color: #64748b; font-size: 13px;'>You can now refresh the login page on the target device.</p>
                            </div>
                        </body>
                        </html>");
                    return;
                }

                context.Response.ContentType = "text/html";
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync("<html><body><h3>Invalid security handshake token.</h3></body></html>");
                return;
            }

            // 2. Intercept Admin panel accesses
            if (path.StartsWith("/admin"))
            {
                var clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
                if (clientIp == "::1") clientIp = "127.0.0.1";

                if (!AdminIpWhitelist.AllowedIps.ContainsKey(clientIp))
                {
                    var unitOfWork = context.RequestServices.GetRequiredService<IUnitOfWork>();
                    var userAgent = context.Request.Headers["User-Agent"].ToString();

                    // Log Intrusion attempt to ActivityLogs
                    try
                    {
                        var log = new ActivityLog
                        {
                            Action = "Intrusion Threat",
                            Details = $"Intruder IP: '{clientIp}' blocked attempting access to: '{context.Request.Path}'",
                            IpAddress = clientIp,
                            Timestamp = DateTime.UtcNow
                        };
                        await unitOfWork.ActivityLogs.AddAsync(log);
                        await unitOfWork.CompleteAsync();
                    }
                    catch { }

                    // Send MFA approval email to developer (throttled to once every 5 minutes per IP)
                    var lastSent = AdminIpWhitelist.SentMfaEmails.TryGetValue(clientIp, out var dt) ? dt : DateTime.MinValue;
                    if ((DateTime.UtcNow - lastSent).TotalMinutes > 5)
                    {
                        AdminIpWhitelist.SentMfaEmails[clientIp] = DateTime.UtcNow;
                        
                        try
                        {
                            var settings = (await unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
                            if (settings != null && !string.IsNullOrEmpty(settings.SmtpHost) && !string.IsNullOrEmpty(settings.ContactEmail))
                            {
                                using var mail = new System.Net.Mail.MailMessage();
                                mail.From = new System.Net.Mail.MailAddress(settings.SmtpUsername ?? "security@portfolio.com", "System Defense Nexus");
                                mail.To.Add(settings.ContactEmail);
                                mail.Subject = "🚨 [ALERT] Admin Access Handshake Request!";
                                mail.IsBodyHtml = true;

                                var approveUrl = $"{context.Request.Scheme}://{context.Request.Host}/Admin/Auth/ApproveIp?ip={clientIp}&token={AdminIpWhitelist.GenerateApprovalToken(clientIp)}";

                                mail.Body = $@"
                                    <div style='background:#0b0813; color:#ef4444; font-family:monospace; padding:30px; border:2px solid #a855f7; max-width:600px;'>
                                        <h2 style='text-shadow:0 0 10px #ef4444; border-bottom:1px solid #332155; padding-bottom:15px;'>🛡️ TERMINAL SECURITY ALERT</h2>
                                        <p style='color:#cbd5e1;'>An external node is trying to access the admin panel.</p>
                                        <table style='color:#cbd5e1; width:100%; border-collapse:collapse; margin:20px 0;'>
                                            <tr><td style='padding:5px; font-weight:bold;'>NODE IP:</td><td style='padding:5px;'>{clientIp}</td></tr>
                                            <tr><td style='padding:5px; font-weight:bold;'>TIMESTAMP:</td><td style='padding:5px;'>{DateTime.UtcNow.ToString("dd MMM yyyy HH:mm:ss")} UTC</td></tr>
                                            <tr><td style='padding:5px; font-weight:bold;'>VISITOR AGENT:</td><td style='padding:5px; font-size:11px;'>{userAgent}</td></tr>
                                        </table>
                                        <div style='margin-top:30px;'>
                                            <a href='{approveUrl}' style='background:#10b981; color:#ffffff; padding:12px 25px; text-decoration:none; font-weight:bold; border-radius:4px; display:inline-block;'>YES - AUTHORIZE ACCESS</a>
                                        </div>
                                        <p style='color:#64748b; font-size:11px; margin-top:25px;'>If you did not initiate this connection, ignore it. The IP remains blocked.</p>
                                    </div>";

                                using var smtp = new System.Net.Mail.SmtpClient(settings.SmtpHost, settings.SmtpPort);
                                smtp.Credentials = new System.Net.NetworkCredential(settings.SmtpUsername, settings.SmtpPassword);
                                smtp.EnableSsl = settings.SmtpEnableSsl;
                                await smtp.SendMailAsync(mail);
                            }
                        }
                        catch { }
                    }

                    // Render block page
                    context.Response.StatusCode = 403;
                    context.Response.ContentType = "text/html";
                    await context.Response.WriteAsync($@"
                        <html>
                        <head>
                            <title>Access Denied</title>
                            <link href='https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap' rel='stylesheet'>
                            <style>
                                body {{ background: #000000; color: #ef4444; font-family: 'Space Grotesk', sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; box-sizing: border-box; padding: 20px; }}
                                .box {{ border: 2px solid #ef4444; padding: 40px; background: rgba(239, 68, 68, 0.05); box-shadow: 0 0 40px rgba(239, 68, 68, 0.3); max-width: 650px; border-radius: 4px; }}
                                h1 {{ margin: 0 0 15px 0; font-size: 2.5rem; text-shadow: 0 0 15px #ef4444; letter-spacing: 0.05em; }}
                                p {{ color: #cbd5e1; line-height: 1.6; font-size: 1.1rem; }}
                                .loader {{ margin: 25px auto; width: 40px; height: 40px; border: 3px solid #ef4444; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite; }}
                                @keyframes spin {{ to {{ transform: rotate(360deg); }} }}
                            </style>
                        </head>
                        <body>
                            <div class='box'>
                                <h1>🔒 UNAUTHORIZED ADAPTER DETECTED</h1>
                                <p>Admin Portal access is restricted to whitelisted nodes. A connection attempt from IP <strong>{clientIp}</strong> has been intercepted and logged.</p>
                                <p style='color:#ef4444; font-weight:bold;'>An authentication verification link has been transmitted to the administrator's email. Once approved, you can refresh this page to establish the link.</p>
                                <div class='loader'></div>
                            </div>
                        </body>
                        </html>");
                    return;
                }
            }

            await _next(context);
        }
    }
}
