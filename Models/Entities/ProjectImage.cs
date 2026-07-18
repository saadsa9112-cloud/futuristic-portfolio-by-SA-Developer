namespace FuturisticPortfolio.Models.Entities
{
    public class ProjectImage
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public virtual Project? Project { get; set; }
        public string ImagePath { get; set; } = string.Empty;
    }
}
