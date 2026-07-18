using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Models.Entities;

namespace FuturisticPortfolio.Services
{
    public interface IIPSecurityService
    {
        void BlockIp(string ip);
        void UnblockIp(string ip);
        bool IsIpBlocked(string ip);
        List<string> GetBlockedIps();
        bool RecordRequestAndCheckRateLimit(string ip, out bool isDdosLevel);
    }

    public class IPSecurityService : IIPSecurityService
    {
        private static readonly ConcurrentDictionary<string, byte> BlockedIps = new();
        private static readonly ConcurrentDictionary<string, List<DateTime>> RequestHistory = new();
        private readonly string _filePath;
        private readonly IServiceProvider _serviceProvider;

        public IPSecurityService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
            
            // Save inside App_Data/blocked_ips.json
            var appDataPath = Path.Combine(Directory.GetCurrentDirectory(), "App_Data");
            if (!Directory.Exists(appDataPath))
            {
                Directory.CreateDirectory(appDataPath);
            }
            _filePath = Path.Combine(appDataPath, "blocked_ips.json");

            LoadBlockedIps();
        }

        private void LoadBlockedIps()
        {
            try
            {
                if (File.Exists(_filePath))
                {
                    var json = File.ReadAllText(_filePath);
                    var list = JsonSerializer.Deserialize<List<string>>(json);
                    if (list != null)
                    {
                        foreach (var ip in list)
                        {
                            BlockedIps.TryAdd(ip, 0);
                        }
                    }
                }
            }
            catch
            {
                // Fallback silently if reading fails
            }
        }

        private void SaveBlockedIps()
        {
            try
            {
                var list = BlockedIps.Keys.ToList();
                var json = JsonSerializer.Serialize(list);
                File.WriteAllText(_filePath, json);
            }
            catch
            {
                // Fallback silently if writing fails
            }
        }

        public void BlockIp(string ip)
        {
            if (string.IsNullOrWhiteSpace(ip)) return;
            ip = ip.Trim();
            if (BlockedIps.TryAdd(ip, 0))
            {
                SaveBlockedIps();
                LogActivity("Block IP", $"Permanently blacklisted IP Address: {ip}");
            }
        }

        public void UnblockIp(string ip)
        {
            if (string.IsNullOrWhiteSpace(ip)) return;
            ip = ip.Trim();
            if (BlockedIps.TryRemove(ip, out _))
            {
                SaveBlockedIps();
                LogActivity("Unblock IP", $"Removed IP Address from blacklist: {ip}");
            }
        }

        public bool IsIpBlocked(string ip)
        {
            if (string.IsNullOrWhiteSpace(ip)) return false;
            return BlockedIps.ContainsKey(ip.Trim());
        }

        public List<string> GetBlockedIps()
        {
            return BlockedIps.Keys.ToList();
        }

        public bool RecordRequestAndCheckRateLimit(string ip, out bool isDdosLevel)
        {
            isDdosLevel = false;
            if (string.IsNullOrWhiteSpace(ip)) return true; // Safe fallback

            var now = DateTime.UtcNow;
            var windowStart = now.AddSeconds(-10);

            var history = RequestHistory.GetOrAdd(ip, _ => new List<DateTime>());
            lock (history)
            {
                // Remove expired records
                history.RemoveAll(t => t < windowStart);
                
                // Record current request
                history.Add(now);

                int count = history.Count;

                // Thresholds:
                // > 80 requests in 10s: DDoS attack! (Auto-blacklist)
                // > 30 requests in 10s: Throttling (Rate limited page)
                if (count > 80)
                {
                    isDdosLevel = true;
                    return false;
                }
                if (count > 30)
                {
                    return false; // Rate limit exceeded
                }
            }

            return true;
        }

        private void LogActivity(string action, string details)
        {
            Task.Run(async () =>
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var log = new ActivityLog
                    {
                        Action = action,
                        Details = details,
                        Timestamp = DateTime.UtcNow,
                        IpAddress = "System"
                    };
                    await unitOfWork.ActivityLogs.AddAsync(log);
                    await unitOfWork.CompleteAsync();
                }
                catch
                {
                    // Fail silently for background tasks
                }
            });
        }
    }

    public class IPBlockingMiddleware
    {
        private readonly RequestDelegate _next;

        public IPBlockingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IIPSecurityService ipSecurityService)
        {
            var remoteIp = context.Connection.RemoteIpAddress?.ToString();

            if (string.IsNullOrEmpty(remoteIp))
            {
                await _next(context);
                return;
            }

            // 1. Check IP Blacklist
            if (ipSecurityService.IsIpBlocked(remoteIp))
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                context.Response.ContentType = "text/html";
                await context.Response.WriteAsync(GetBlockPageHtml(remoteIp, "PERMANENT BLACKLIST"));
                return;
            }

            // Skip static files from rate limiting to prevent false positives when loading assets
            var path = context.Request.Path.Value?.ToLower() ?? "";
            if (path.StartsWith("/css") || path.StartsWith("/js") || path.StartsWith("/lib") || path.StartsWith("/images") || path.Contains("."))
            {
                await _next(context);
                return;
            }

            // 2. Check Rate Limiter / DDoS Protection
            if (!ipSecurityService.RecordRequestAndCheckRateLimit(remoteIp, out bool isDdosLevel))
            {
                if (isDdosLevel)
                {
                    // Auto-block the IP dynamically!
                    ipSecurityService.BlockIp(remoteIp);
                    
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "text/html";
                    await context.Response.WriteAsync(GetBlockPageHtml(remoteIp, "AUTO-BLACK-LISTED (DDoS FLOOD DETECTED)"));
                    return;
                }
                else
                {
                    // Throttle temporarily
                    context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                    context.Response.ContentType = "text/html";
                    await context.Response.WriteAsync(GetRateLimitPageHtml(remoteIp));
                    return;
                }
            }

            await _next(context);
        }

        private string GetBlockPageHtml(string ip, string reason)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>ACCESS DENIED - NODE BLACKLISTED</title>
                <link href='https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap' rel='stylesheet'>
                <style>
                    body {{
                        background: #090212;
                        color: #ff3366;
                        font-family: 'Share Tech Mono', monospace;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        overflow: hidden;
                        text-align: center;
                    }}
                    .container {{
                        border: 1px solid #ff3366;
                        background: rgba(255, 51, 102, 0.05);
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 0 30px rgba(255, 51, 102, 0.2);
                        max-width: 600px;
                        position: relative;
                    }}
                    .container::before {{
                        content: ' ';
                        display: block;
                        position: absolute;
                        top: 0; left: 0; bottom: 0; right: 0;
                        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
                        z-index: 10;
                        background-size: 100% 2px, 3px 100%;
                        pointer-events: none;
                    }}
                    h1 {{
                        font-size: 32px;
                        margin-bottom: 20px;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        animation: glitch 1s linear infinite;
                    }}
                    p {{
                        color: #b5a8c4;
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }}
                    .info {{
                        background: #000;
                        border: 1px solid #332144;
                        padding: 15px;
                        border-radius: 4px;
                        color: #00ffcc;
                        font-size: 14px;
                        margin-top: 25px;
                    }}
                    @keyframes glitch {{
                        0% {{ text-shadow: 1px 1px 0px #ff3366, -1px -1px 0px #00ffcc; }}
                        50% {{ text-shadow: -1px 1px 0px #ff3366, 1px -1px 0px #00ffcc; }}
                        100% {{ text-shadow: 1px -1px 0px #ff3366, -1px 1px 0px #00ffcc; }}
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1>[ACCESS DENIED]</h1>
                    <p>Your network node IP has been permanently blacklisted from this server context due to security threat rules or dynamic bypass policies.</p>
                    <div class='info'>
                        BLOCKED NODE: {ip}<br/>
                        REASON: {reason}<br/>
                        TIMESTAMP: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC
                    </div>
                </div>
            </body>
            </html>";
        }

        private string GetRateLimitPageHtml(string ip)
        {
            return $@"
            <!DOCTYPE html>
            <html lang='en'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>HTTP 429 - RATE LIMITED</title>
                <link href='https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap' rel='stylesheet'>
                <style>
                    body {{
                        background: #0a0e14;
                        color: #f59e0b;
                        font-family: 'Share Tech Mono', monospace;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        text-align: center;
                    }}
                    .container {{
                        border: 1px solid #f59e0b;
                        background: rgba(245, 158, 11, 0.05);
                        padding: 40px;
                        border-radius: 8px;
                        box-shadow: 0 0 25px rgba(245, 158, 11, 0.15);
                        max-width: 550px;
                    }}
                    h1 {{
                        font-size: 28px;
                        margin-bottom: 15px;
                    }}
                    p {{
                        color: #9ab0c5;
                        font-size: 15px;
                        line-height: 1.5;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1>[TOO MANY REQUESTS]</h1>
                    <p>Dynamic rate throttling active. Your node is transmitting packets too rapidly. Wait a few moments before sending more queries.</p>
                </div>
            </body>
            </html>";
        }
    }
}
