namespace FuturisticPortfolio.Services
{
    public class SiteFeatureFlags
    {
        public bool EnableCostEstimator { get; set; } = true;
        public bool EnableCyberLab { get; set; } = true;
        public bool EnablePerfBenchmark { get; set; } = true;
        public bool EnableDevSandbox { get; set; } = true;
        public bool EnableArchScan { get; set; } = true;
        public bool EnableAudioSfx { get; set; } = true;
        public bool EnableMatrixRain { get; set; } = true;
    }

    public interface IFeatureFlagService
    {
        SiteFeatureFlags GetFlags();
        Task UpdateFlagsAsync(SiteFeatureFlags flags);
    }
}
