using System;
using System.Globalization;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public class IpLookupService : IIpLookupService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly ILogger<IpLookupService> _logger;

        public IpLookupService(HttpClient httpClient, IMemoryCache cache, ILogger<IpLookupService> logger)
        {
            _httpClient = httpClient;
            _cache = cache;
            _logger = logger;
            _httpClient.Timeout = TimeSpan.FromSeconds(3);
        }

        public async Task<IpLocationResult> LookupAsync(string ipAddress)
        {
            if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1" || ipAddress == "127.0.0.1" || ipAddress.StartsWith("192.168."))
            {
                return new IpLocationResult
                {
                    Country = "Localhost",
                    City = "Internal",
                    Region = "Loopback",
                    Latitude = "0.0",
                    Longitude = "0.0",
                    TimeZone = "UTC"
                };
            }

            // Check in-memory cache
            var cacheKey = $"GeoIP_{ipAddress}";
            if (_cache.TryGetValue(cacheKey, out IpLocationResult? cachedResult) && cachedResult != null)
            {
                return cachedResult;
            }

            // Provider 1: IPinfo.io (Best Enterprise Accuracy)
            try
            {
                var response = await _httpClient.GetFromJsonAsync<IpInfoResponse>($"https://ipinfo.io/{ipAddress}/json");
                if (response != null && !string.IsNullOrEmpty(response.Country))
                {
                    var coords = response.Loc?.Split(',') ?? new[] { "0.0", "0.0" };
                    var result = new IpLocationResult
                    {
                        Country = GetCountryName(response.Country),
                        City = response.City ?? "Unknown",
                        Region = response.Region ?? "Unknown",
                        Latitude = coords.Length > 0 ? coords[0] : "0.0",
                        Longitude = coords.Length > 1 ? coords[1] : "0.0",
                        TimeZone = response.Timezone ?? "UTC"
                    };

                    _cache.Set(cacheKey, result, TimeSpan.FromHours(24));
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Primary Provider IPinfo.io failed for {IpAddress}, trying ipwho.is...", ipAddress);
            }

            // Provider 2: ipwho.is (Secondary Fallback)
            try
            {
                var response = await _httpClient.GetFromJsonAsync<IpWhoIsResponse>($"https://ipwho.is/{ipAddress}");
                if (response != null && response.Success)
                {
                    var result = new IpLocationResult
                    {
                        Country = response.Country ?? "Unknown",
                        City = response.City ?? "Unknown",
                        Region = response.Region ?? "Unknown",
                        Latitude = response.Latitude.ToString(CultureInfo.InvariantCulture),
                        Longitude = response.Longitude.ToString(CultureInfo.InvariantCulture),
                        TimeZone = response.Timezone?.Id ?? "UTC"
                    };

                    _cache.Set(cacheKey, result, TimeSpan.FromHours(24));
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Secondary Provider ipwho.is failed for {IpAddress}, trying ip-api.com...", ipAddress);
            }

            // Provider 3: ip-api.com (Tertiary Fallback)
            try
            {
                var response = await _httpClient.GetFromJsonAsync<IpApiResponse>($"http://ip-api.com/json/{ipAddress}?fields=status,country,regionName,city,lat,lon,timezone");
                if (response != null && response.Status == "success")
                {
                    var result = new IpLocationResult
                    {
                        Country = response.Country ?? "Unknown",
                        City = response.City ?? "Unknown",
                        Region = response.RegionName ?? "Unknown",
                        Latitude = response.Lat.ToString(CultureInfo.InvariantCulture),
                        Longitude = response.Lon.ToString(CultureInfo.InvariantCulture),
                        TimeZone = response.Timezone ?? "UTC"
                    };

                    _cache.Set(cacheKey, result, TimeSpan.FromHours(24));
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tertiary Provider ip-api.com failed for {IpAddress}", ipAddress);
            }

            // Fallback default
            return new IpLocationResult
            {
                Country = "Unknown",
                City = "Unknown",
                Region = "Unknown",
                Latitude = "0.0",
                Longitude = "0.0",
                TimeZone = "UTC"
            };
        }

        private string GetCountryName(string? countryCode)
        {
            if (string.IsNullOrEmpty(countryCode)) return "Unknown";
            if (countryCode.Length > 2) return countryCode;
            try
            {
                var region = new RegionInfo(countryCode.ToUpperInvariant());
                return region.EnglishName;
            }
            catch
            {
                return countryCode;
            }
        }

        private class IpInfoResponse
        {
            [JsonPropertyName("ip")]
            public string? Ip { get; set; }

            [JsonPropertyName("city")]
            public string? City { get; set; }

            [JsonPropertyName("region")]
            public string? Region { get; set; }

            [JsonPropertyName("country")]
            public string? Country { get; set; }

            [JsonPropertyName("loc")]
            public string? Loc { get; set; }

            [JsonPropertyName("timezone")]
            public string? Timezone { get; set; }
        }

        private class IpWhoIsResponse
        {
            [JsonPropertyName("success")]
            public bool Success { get; set; }

            [JsonPropertyName("country")]
            public string? Country { get; set; }

            [JsonPropertyName("region")]
            public string? Region { get; set; }

            [JsonPropertyName("city")]
            public string? City { get; set; }

            [JsonPropertyName("latitude")]
            public double Latitude { get; set; }

            [JsonPropertyName("longitude")]
            public double Longitude { get; set; }

            [JsonPropertyName("timezone")]
            public IpWhoIsTimezone? Timezone { get; set; }
        }

        private class IpWhoIsTimezone
        {
            [JsonPropertyName("id")]
            public string? Id { get; set; }
        }

        private class IpApiResponse
        {
            [JsonPropertyName("status")]
            public string? Status { get; set; }

            [JsonPropertyName("country")]
            public string? Country { get; set; }

            [JsonPropertyName("regionName")]
            public string? RegionName { get; set; }

            [JsonPropertyName("city")]
            public string? City { get; set; }

            [JsonPropertyName("lat")]
            public double Lat { get; set; }

            [JsonPropertyName("lon")]
            public double Lon { get; set; }

            [JsonPropertyName("timezone")]
            public string? Timezone { get; set; }
        }
    }
}
