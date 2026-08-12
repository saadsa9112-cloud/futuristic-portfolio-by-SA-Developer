namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public interface IUserAgentService
    {
        UserAgentResult Parse(string? userAgentString);
    }

    public class UserAgentResult
    {
        public string DeviceType { get; set; } = "Desktop";
        public string OperatingSystem { get; set; } = "Unknown";
        public string? OSVersion { get; set; }
        public string BrowserFamily { get; set; } = "Unknown";
        public string? BrowserVersion { get; set; }
        public string Engine { get; set; } = "Unknown";
        public string? EngineVersion { get; set; }
    }
}
