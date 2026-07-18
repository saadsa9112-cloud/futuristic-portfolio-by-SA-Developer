using FuturisticPortfolio.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FuturisticPortfolio.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = "Admin")]
    public class DashboardController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public DashboardController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IActionResult> Index()
        {
            // Counters
            var projects = await _unitOfWork.Projects.GetAllAsync();
            ViewBag.TotalProjects = projects.Count();
            ViewBag.FeaturedProject = projects.FirstOrDefault(p => p.FeaturedOption)?.Title ?? "None";

            var skills = await _unitOfWork.Skills.GetAllAsync();
            ViewBag.TotalSkills = skills.Count();

            var messages = await _unitOfWork.Messages.GetAllAsync();
            ViewBag.TotalMessages = messages.Count();
            ViewBag.UnreadMessages = messages.Count(m => !m.IsRead);

            var blogs = await _unitOfWork.Blogs.GetAllAsync();
            ViewBag.TotalBlogs = blogs.Count();
            ViewBag.TotalBlogViews = blogs.Sum(b => b.ViewCount);

            var settings = (await _unitOfWork.Settings.GetAllAsync()).FirstOrDefault();
            ViewBag.CvDownloads = settings?.CvDownloadCount ?? 0;

            // Visitor calculations
            var visitors = (await _unitOfWork.Visitors.GetAllAsync()).ToList();
            ViewBag.TotalVisitors = visitors.Count;
            ViewBag.TodayVisitors = visitors.Count(v => v.VisitDate.Date == DateTime.UtcNow.Date);

            // Fetch recent visitors
            var recentVisitors = visitors
                .OrderByDescending(v => v.VisitDate)
                .Take(5)
                .ToList();
            ViewBag.RecentVisitors = recentVisitors;

            // Fetch recent activities
            var logs = (await _unitOfWork.ActivityLogs.GetAllAsync())
                .OrderByDescending(l => l.Timestamp)
                .Take(5)
                .ToList();
            ViewBag.RecentLogs = logs;

            // Fetch recent messages
            var recentMsgs = messages
                .OrderByDescending(m => m.CreatedDate)
                .Take(4)
                .ToList();
            ViewBag.RecentMessages = recentMsgs;

            // Format Chart Data (Last 7 Days Traffic)
            var chartLabels = new List<string>();
            var chartData = new List<int>();

            for (int i = 6; i >= 0; i--)
            {
                var date = DateTime.UtcNow.Date.AddDays(-i);
                chartLabels.Add(date.ToString("dd MMM"));
                chartData.Add(visitors.Count(v => v.VisitDate.Date == date));
            }

            ViewBag.ChartLabels = chartLabels;
            ViewBag.ChartData = chartData;

            return View();
        }
    }
}
