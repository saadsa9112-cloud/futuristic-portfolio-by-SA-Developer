using System.Text.Json;

namespace FuturisticPortfolio.Services
{
    public class FeatureFlagService : IFeatureFlagService
    {
        private readonly string _filePath;
        private readonly object _lock = new();
        private SiteFeatureFlags _cachedFlags;

        public FeatureFlagService(IWebHostEnvironment env)
        {
            var appDataDir = Path.Combine(env.ContentRootPath, "App_Data");
            if (!Directory.Exists(appDataDir))
            {
                Directory.CreateDirectory(appDataDir);
            }
            _filePath = Path.Combine(appDataDir, "feature_flags.json");
            _cachedFlags = LoadFlagsFromDisk();
        }

        public SiteFeatureFlags GetFlags()
        {
            lock (_lock)
            {
                return _cachedFlags ??= LoadFlagsFromDisk();
            }
        }

        public async Task UpdateFlagsAsync(SiteFeatureFlags flags)
        {
            if (flags == null) return;

            string json;
            lock (_lock)
            {
                _cachedFlags = flags;
                json = JsonSerializer.Serialize(flags, new JsonSerializerOptions { WriteIndented = true });
            }

            await File.WriteAllTextAsync(_filePath, json);
        }

        private SiteFeatureFlags LoadFlagsFromDisk()
        {
            try
            {
                if (File.Exists(_filePath))
                {
                    var json = File.ReadAllText(_filePath);
                    var deserialized = JsonSerializer.Deserialize<SiteFeatureFlags>(json);
                    if (deserialized != null)
                    {
                        return deserialized;
                    }
                }
            }
            catch
            {
                // Fallback to default enabled flags
            }

            var defaultFlags = new SiteFeatureFlags();
            try
            {
                var json = JsonSerializer.Serialize(defaultFlags, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_filePath, json);
            }
            catch { }

            return defaultFlags;
        }
    }
}
