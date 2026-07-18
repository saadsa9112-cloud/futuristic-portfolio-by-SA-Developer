using Microsoft.AspNetCore.Identity;

namespace FuturisticPortfolio.Models.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string? ProfilePicturePath { get; set; }
    }
}
