using FuturisticPortfolio.Models.Entities;

namespace FuturisticPortfolio.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Project> Projects { get; }
        IRepository<ProjectImage> ProjectImages { get; }
        IRepository<ProjectVideo> ProjectVideos { get; }
        IRepository<Skill> Skills { get; }
        IRepository<Certificate> Certificates { get; }
        IRepository<Experience> Experiences { get; }
        IRepository<Education> Educations { get; }
        IRepository<Testimonial> Testimonials { get; }
        IRepository<Blog> Blogs { get; }
        IRepository<Category> Categories { get; }
        IRepository<Message> Messages { get; }
        IRepository<Settings> Settings { get; }
        IRepository<Statistic> Statistics { get; }
        IRepository<SocialLink> SocialLinks { get; }
        IRepository<Visitor> Visitors { get; }
        IRepository<ActivityLog> ActivityLogs { get; }

        Task<int> CompleteAsync();
    }
}
