using FuturisticPortfolio.Data;
using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Repositories;
using FuturisticPortfolio.Services;
using FuturisticPortfolio.Analytics.Infrastructure.Background;
using FuturisticPortfolio.Analytics.Infrastructure.Services;
using FuturisticPortfolio.Analytics.Application.Hubs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// DB Connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ASP.NET Core Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Cookie Settings for authentication redirecting to Admin panel login page
builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Admin/Auth/Login";
    options.AccessDeniedPath = "/Admin/Auth/AccessDenied";
    options.ExpireTimeSpan = TimeSpan.FromHours(2);
    options.SlidingExpiration = true;
});

// Repository Pattern
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Application Services
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IPortfolioAIService, PortfolioAIService>();
builder.Services.AddSingleton<IIPSecurityService, IPSecurityService>();

// Visitor Analytics Services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
builder.Services.AddSignalR();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient<IIpLookupService, IpLookupService>();
builder.Services.AddSingleton<ITelemetryQueue, TelemetryQueue>();
builder.Services.AddSingleton<IUserAgentService, UserAgentService>();
builder.Services.AddSingleton<IBotDetectionService, BotDetectionService>();
builder.Services.AddSingleton<IAnalyticsSettingsService, AnalyticsSettingsService>();
builder.Services.AddHostedService<TelemetryQueueProcessor>();

var app = builder.Build();

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await DatabaseSeeder.SeedAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during database migration/seeding.");
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseMiddleware<IPBlockingMiddleware>();

// Visitor tracking middleware
app.UseMiddleware<VisitorTrackerMiddleware>();

// Admin security whitelist middleware
app.UseMiddleware<AdminSecurityMiddleware>();

app.UseRouting();
app.UseCors("AllowAllOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<AnalyticsHub>("/analyticsHub");

app.MapStaticAssets();

// Admin Area Route mapping
app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");

// Default Route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
