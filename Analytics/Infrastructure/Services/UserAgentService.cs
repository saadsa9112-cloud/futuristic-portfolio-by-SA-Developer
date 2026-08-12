using System;
using System.Text.RegularExpressions;

namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public class UserAgentService : IUserAgentService
    {
        public UserAgentResult Parse(string? userAgentString)
        {
            var result = new UserAgentResult();

            if (string.IsNullOrEmpty(userAgentString))
            {
                return result;
            }

            // 1. Detect Device Type
            if (Regex.IsMatch(userAgentString, "Mobi|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini", RegexOptions.IgnoreCase))
            {
                result.DeviceType = "Mobile";
            }
            if (Regex.IsMatch(userAgentString, "iPad|Tablet|PlayBook|Silk", RegexOptions.IgnoreCase))
            {
                result.DeviceType = "Tablet";
            }

            // 2. Detect Operating System and OS Version
            if (userAgentString.Contains("Windows"))
            {
                result.OperatingSystem = "Windows";
                var match = Regex.Match(userAgentString, @"Windows NT\s+([0-9\.]+)");
                if (match.Success)
                {
                    var ntVersion = match.Groups[1].Value;
                    result.OSVersion = ntVersion switch
                    {
                        "10.0" => userAgentString.Contains("Windows 11") || userAgentString.Contains("Win64") ? "11" : "10",
                        "6.3" => "8.1",
                        "6.2" => "8",
                        "6.1" => "7",
                        _ => ntVersion
                    };
                }
            }
            else if (userAgentString.Contains("Android"))
            {
                result.OperatingSystem = "Android";
                var match = Regex.Match(userAgentString, @"Android\s+([0-9\.]+)");
                if (match.Success)
                {
                    result.OSVersion = match.Groups[1].Value;
                }
            }
            else if (userAgentString.Contains("iPhone") || userAgentString.Contains("iPad") || userAgentString.Contains("iPod"))
            {
                result.OperatingSystem = "iOS";
                var match = Regex.Match(userAgentString, @"OS\s+([0-9_]+)");
                if (match.Success)
                {
                    result.OSVersion = match.Groups[1].Value.Replace('_', '.');
                }
            }
            else if (userAgentString.Contains("Macintosh") || userAgentString.Contains("Mac OS X"))
            {
                result.OperatingSystem = "macOS";
                var match = Regex.Match(userAgentString, @"Mac OS X\s+([0-9_\.]+)");
                if (match.Success)
                {
                    result.OSVersion = match.Groups[1].Value.Replace('_', '.');
                }
            }
            else if (userAgentString.Contains("Linux"))
            {
                result.OperatingSystem = "Linux";
            }

            // 3. Detect Browser Family & Version
            if (userAgentString.Contains("Edg/"))
            {
                result.BrowserFamily = "Edge";
                var match = Regex.Match(userAgentString, @"Edg\/([0-9\.]+)");
                if (match.Success) result.BrowserVersion = match.Groups[1].Value.Split('.')[0];
            }
            else if (userAgentString.Contains("OPR/") || userAgentString.Contains("Opera"))
            {
                result.BrowserFamily = "Opera";
                var match = Regex.Match(userAgentString, @"OPR\/([0-9\.]+)");
                if (match.Success) result.BrowserVersion = match.Groups[1].Value.Split('.')[0];
            }
            else if (userAgentString.Contains("Chrome"))
            {
                result.BrowserFamily = "Chrome";
                var match = Regex.Match(userAgentString, @"Chrome\/([0-9\.]+)");
                if (match.Success) result.BrowserVersion = match.Groups[1].Value.Split('.')[0];
            }
            else if (userAgentString.Contains("Firefox"))
            {
                result.BrowserFamily = "Firefox";
                var match = Regex.Match(userAgentString, @"Firefox\/([0-9\.]+)");
                if (match.Success) result.BrowserVersion = match.Groups[1].Value.Split('.')[0];
            }
            else if (userAgentString.Contains("Safari") && !userAgentString.Contains("Chrome"))
            {
                result.BrowserFamily = "Safari";
                var match = Regex.Match(userAgentString, @"Version\/([0-9\.]+)");
                if (match.Success) result.BrowserVersion = match.Groups[1].Value.Split('.')[0];
            }

            // 4. Detect Browser Rendering Engine & Engine Version
            if (userAgentString.Contains("AppleWebKit"))
            {
                result.Engine = "WebKit";
                var match = Regex.Match(userAgentString, @"AppleWebKit\/([0-9\.]+)");
                if (match.Success) result.EngineVersion = match.Groups[1].Value.Split('.')[0];
                
                // If it contains Chrome/Blink signature
                if (userAgentString.Contains("Chrome"))
                {
                    result.Engine = "Blink";
                    // For WebKit engines carrying Chrome, Blink version aligns closely with browser major version
                    result.EngineVersion = result.BrowserVersion;
                }
            }
            else if (userAgentString.Contains("Gecko"))
            {
                result.Engine = "Gecko";
                var match = Regex.Match(userAgentString, @"rv\:([0-9\.]+)");
                if (match.Success) result.EngineVersion = match.Groups[1].Value.Split('.')[0];
            }
            else if (userAgentString.Contains("Trident"))
            {
                result.Engine = "Trident";
                var match = Regex.Match(userAgentString, @"rv\:([0-9\.]+)");
                if (match.Success) result.EngineVersion = match.Groups[1].Value.Split('.')[0];
            }

            return result;
        }
    }
}
