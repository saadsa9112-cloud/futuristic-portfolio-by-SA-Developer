using FuturisticPortfolio.Data;
using FuturisticPortfolio.Models.Entities;

namespace FuturisticPortfolio.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Projects = new Repository<Project>(_context);
            ProjectImages = new Repository<ProjectImage>(_context);
            ProjectVideos = new Repository<ProjectVideo>(_context);
            Skills = new Repository<Skill>(_context);
            Certificates = new Repository<Certificate>(_context);
            Experiences = new Repository<Experience>(_context);
            Educations = new Repository<Education>(_context);
            Testimonials = new Repository<Testimonial>(_context);
            Blogs = new Repository<Blog>(_context);
            Categories = new Repository<Category>(_context);
            Messages = new Repository<Message>(_context);
            Settings = new Repository<Settings>(_context);
            Statistics = new Repository<Statistic>(_context);
            SocialLinks = new Repository<SocialLink>(_context);
            Visitors = new Repository<Visitor>(_context);
            ActivityLogs = new Repository<ActivityLog>(_context);
        }

        public IRepository<Project> Projects { get; private set; }
        public IRepository<ProjectImage> ProjectImages { get; private set; }
        public IRepository<ProjectVideo> ProjectVideos { get; private set; }
        public IRepository<Skill> Skills { get; private set; }
        public IRepository<Certificate> Certificates { get; private set; }
        public IRepository<Experience> Experiences { get; private set; }
        public IRepository<Education> Educations { get; private set; }
        public IRepository<Testimonial> Testimonials { get; private set; }
        public IRepository<Blog> Blogs { get; private set; }
        public IRepository<Category> Categories { get; private set; }
        public IRepository<Message> Messages { get; private set; }
        public IRepository<Settings> Settings { get; private set; }
        public IRepository<Statistic> Statistics { get; private set; }
        public IRepository<SocialLink> SocialLinks { get; private set; }
        public IRepository<Visitor> Visitors { get; private set; }
        public IRepository<ActivityLog> ActivityLogs { get; private set; }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
