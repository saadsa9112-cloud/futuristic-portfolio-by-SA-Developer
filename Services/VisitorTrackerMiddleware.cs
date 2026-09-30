using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;

namespace FuturisticPortfolio.Services
{
    public class VisitorTrackerMiddleware
    {
        private readonly RequestDelegate _next;

        public VisitorTrackerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var path = context.Request.Path.Value?.ToLowerInvariant() ?? "";

            // Skip tracking static assets, web sockets, AJAX API routes, or Admin panel refreshes
            var shouldSkip = path.Contains("/uploads") || 
                             path.Contains("/css") || 
                             path.Contains("/js") || 
                             path.Contains("/lib") || 
                             path.Contains("/favicon") || 
                             path.Contains("/admin") ||
                             path.Contains("/api/ai") || // Skip AI chat calls to avoid loops
                             path.EndsWith(".png") || 
                             path.EndsWith(".jpg") || 
                             path.EndsWith(".jpeg") || 
                             path.EndsWith(".css") || 
                             path.EndsWith(".js");

            if (!shouldSkip)
            {
                // Retrieve scoped services inside middleware
                var unitOfWork = context.RequestServices.GetRequiredService<IUnitOfWork>();
                var ipLookupService = context.RequestServices.GetService<FuturisticPortfolio.Analytics.Infrastructure.Services.IIpLookupService>();
                try
                {
                    // Detect real client IP (Cloudflare / reverse proxy / localtunnel aware)
                    string clientIp = context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
                    if (context.Request.Headers.TryGetValue("CF-Connecting-IP", out var cfIp) && !string.IsNullOrWhiteSpace(cfIp))
                    {
                        clientIp = cfIp.ToString().Trim();
                    }
                    else if (context.Request.Headers.TryGetValue("X-Real-IP", out var realIp) && !string.IsNullOrWhiteSpace(realIp))
                    {
                        clientIp = realIp.ToString().Trim();
                    }
                    else if (context.Request.Headers.TryGetValue("X-Forwarded-For", out var forwardedIp) && !string.IsNullOrWhiteSpace(forwardedIp))
                    {
                        var ips = forwardedIp.ToString().Split(',');
                        if (ips.Length > 0 && !string.IsNullOrWhiteSpace(ips[0]))
                        {
                            clientIp = ips[0].Trim();
                        }
                    }

                    // Resolve Country and City
                    string location = "Pakistan";
                    if (ipLookupService != null)
                    {
                        try
                        {
                            var geo = await ipLookupService.LookupAsync(clientIp);
                            if (geo != null && !string.IsNullOrEmpty(geo.Country))
                            {
                                location = !string.IsNullOrEmpty(geo.City) && geo.City != "Internal" && geo.City != "Unknown"
                                    ? $"{geo.City}, {geo.Country}"
                                    : geo.Country;
                            }
                        }
                        catch { }
                    }

                    var visitor = new Visitor
                    {
                        IpAddress = clientIp,
                        UserAgent = context.Request.Headers["User-Agent"].ToString(),
                        PagePath = context.Request.Path.Value ?? "/",
                        VisitDate = DateTime.UtcNow,
                        Country = location
                    };

                    await unitOfWork.Visitors.AddAsync(visitor);
                    await unitOfWork.CompleteAsync();

                    // Set visitor ID in cookie so client JS can report duration and location updates
                    context.Response.Cookies.Append("VisitorId", visitor.Id.ToString(), new Microsoft.AspNetCore.Http.CookieOptions { HttpOnly = false, SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Lax });
                }
                catch
                {
                    // Fail silently so database errors do not crash the website traffic
                }
            }

            await _next(context);
        }
    }
}
