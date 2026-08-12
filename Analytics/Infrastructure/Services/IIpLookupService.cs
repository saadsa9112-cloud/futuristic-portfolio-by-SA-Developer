using System.Threading.Tasks;

namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public interface IIpLookupService
    {
        Task<IpLocationResult> LookupAsync(string ipAddress);
    }

    public class IpLocationResult
    {
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public string? TimeZone { get; set; }
    }
}
