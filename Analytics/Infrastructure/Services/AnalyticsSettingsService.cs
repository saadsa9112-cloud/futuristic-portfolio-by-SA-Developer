using System;
using System.Linq;
using System.Threading.Tasks;
using FuturisticPortfolio.Analytics.Domain.Entities;
using FuturisticPortfolio.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;

namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public class AnalyticsSettingsService : IAnalyticsSettingsService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IMemoryCache _cache;
        private const string CacheKey = "Analytics_Settings";

        public AnalyticsSettingsService(IServiceScopeFactory scopeFactory, IMemoryCache cache)
        {
            _scopeFactory = scopeFactory;
            _cache = cache;
        }

        public async Task<AnalyticsSettings> GetSettingsAsync()
        {
            if (_cache.TryGetValue(CacheKey, out AnalyticsSettings? cachedSettings) && cachedSettings != null)
            {
                return cachedSettings;
            }

            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            var settings = await dbContext.AnalyticsSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                // Create defaults
                settings = new AnalyticsSettings();
                dbContext.AnalyticsSettings.Add(settings);
                await dbContext.SaveChangesAsync();
            }

            // Cache for 5 minutes
            _cache.Set(CacheKey, settings, TimeSpan.FromMinutes(5));
            return settings;
        }

        public async Task UpdateSettingsAsync(AnalyticsSettings settings)
        {
            using var scope = _scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var existing = await dbContext.AnalyticsSettings.FirstOrDefaultAsync();
            if (existing != null)
            {
                existing.EnableTracking = settings.EnableTracking;
                existing.EnableGeoLookup = settings.EnableGeoLookup;
                existing.EnableEventTracking = settings.EnableEventTracking;
                existing.EnableHeatmaps = settings.EnableHeatmaps;
                existing.IgnoreAdminUsers = settings.IgnoreAdminUsers;
                existing.IgnoreLocalhost = settings.IgnoreLocalhost;
                existing.IgnoreBots = settings.IgnoreBots;
                existing.QueueBatchSize = settings.QueueBatchSize;
                existing.FlushIntervalSeconds = settings.FlushIntervalSeconds;
                existing.GoogleAnalyticsId = settings.GoogleAnalyticsId;
                existing.MicrosoftClarityId = settings.MicrosoftClarityId;
                existing.RetentionDays = settings.RetentionDays;
                existing.RetentionAction = settings.RetentionAction;
                existing.ArchiveFolderPath = settings.ArchiveFolderPath;

                dbContext.AnalyticsSettings.Update(existing);
            }
            else
            {
                dbContext.AnalyticsSettings.Add(settings);
            }

            await dbContext.SaveChangesAsync();

            // Evict cache
            _cache.Remove(CacheKey);
        }
    }
}
