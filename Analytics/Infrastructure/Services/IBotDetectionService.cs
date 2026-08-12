namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public interface IBotDetectionService
    {
        bool IsBot(string? userAgent, string? ipAddress, bool isHeadless);
    }
}
