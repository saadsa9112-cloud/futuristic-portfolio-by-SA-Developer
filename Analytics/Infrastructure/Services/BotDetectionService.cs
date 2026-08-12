using System;
using System.Text.RegularExpressions;

namespace FuturisticPortfolio.Analytics.Infrastructure.Services
{
    public class BotDetectionService : IBotDetectionService
    {
        private static readonly Regex BotUserAgentRegex = new Regex(
            @"Googlebot|Bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|facebookexternalhit|ia_archiver|screaming|lighthouse|headless|crawler|spider|bot\b",
            RegexOptions.IgnoreCase | RegexOptions.Compiled
        );

        public bool IsBot(string? userAgent, string? ipAddress, bool isHeadless)
        {
            if (isHeadless)
            {
                return true;
            }

            if (string.IsNullOrEmpty(userAgent))
            {
                return true; // Unknown request vectors treated as bot/non-human
            }

            // Check User Agent Regex
            if (BotUserAgentRegex.IsMatch(userAgent))
            {
                return true;
            }

            // Headless flags in user agent
            if (userAgent.Contains("HeadlessChrome") || userAgent.Contains("PhantomJS"))
            {
                return true;
            }

            return false;
        }
    }
}
