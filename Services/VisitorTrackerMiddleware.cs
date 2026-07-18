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
                // Retrieve scoped UnitOfWork service inside middleware
                var unitOfWork = context.RequestServices.GetRequiredService<IUnitOfWork>();
                try
                {
                    var visitor = new Visitor
                    {
                        IpAddress = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
                        UserAgent = context.Request.Headers["User-Agent"].ToString(),
                        PagePath = context.Request.Path.Value ?? "/",
                        VisitDate = DateTime.UtcNow
                    };

                    await unitOfWork.Visitors.AddAsync(visitor);
                    await unitOfWork.CompleteAsync();

                    // Set visitor ID in cookie so client JS can report duration and country updates
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
