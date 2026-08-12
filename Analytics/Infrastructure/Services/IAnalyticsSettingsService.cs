using System.Threading.Tasks;
using FuturisticPortfolio.Analytics.Domain.Entities;

namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public interface IAnalyticsSettingsService
    {
        Task<AnalyticsSettings> GetSettingsAsync();
        Task UpdateSettingsAsync(AnalyticsSettings settings);
    }
}
