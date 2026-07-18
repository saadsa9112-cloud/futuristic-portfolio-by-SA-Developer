namespace FuturisticPortfolio.Models.Entities
{
    public class ProjectVideo
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public virtual Project? Project { get; set; }
        public string VideoPath { get; set; } = string.Empty; // Video link or upload path
        public bool IsExternal { get; set; } = true; // true if it's YouTube / external link, false if hosted locally
    }
}
