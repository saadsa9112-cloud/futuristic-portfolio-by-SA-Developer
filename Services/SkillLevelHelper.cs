namespace FuturisticPortfolio.Services
{
    public static class SkillLevelHelper
    {
        public static string GetDisplayLevel(int percentage)
        {
            if (percentage >= 90)
                return "Advanced";
            if (percentage >= 75)
                return "Proficient";
            if (percentage >= 55)
                return "Intermediate";
            return "Familiar";
        }
    }
}
