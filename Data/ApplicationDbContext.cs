using FuturisticPortfolio.Models.Entities;
using FuturisticPortfolio.Analytics.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FuturisticPortfolio.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Project> Projects { get; set; }
        public DbSet<ProjectImage> ProjectImages { get; set; }
        public DbSet<ProjectVideo> ProjectVideos { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<Certificate> Certificates { get; set; }
        public DbSet<Experience> Experiences { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Testimonial> Testimonials { get; set; }
        public DbSet<Blog> Blogs { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<Statistic> Statistics { get; set; }
        public DbSet<SocialLink> SocialLinks { get; set; }
        public DbSet<Visitor> Visitors { get; set; }
        public DbSet<ActivityLog> ActivityLogs { get; set; }

        // Visitor Analytics Module DbSets
        public DbSet<VisitorTrack> VisitorTracks { get; set; }
        public DbSet<VisitorSession> VisitorSessions { get; set; }
        public DbSet<PageVisit> PageVisits { get; set; }
        public DbSet<VisitorEvent> VisitorEvents { get; set; }
        public DbSet<AnalyticsSettings> AnalyticsSettings { get; set; }
        public DbSet<HourlyAnalytics> HourlyAnalytics { get; set; }
        public DbSet<DailyAnalytics> DailyAnalytics { get; set; }
        public DbSet<WeeklyAnalytics> WeeklyAnalytics { get; set; }
        public DbSet<MonthlyAnalytics> MonthlyAnalytics { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cascade deletes setup
            modelBuilder.Entity<Project>()
                .HasMany(p => p.ProjectImages)
                .WithOne(pi => pi.Project)
                .HasForeignKey(pi => pi.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Project>()
                .HasMany(p => p.ProjectVideos)
                .WithOne(pv => pv.Project)
                .HasForeignKey(pv => pv.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Projects)
                .WithOne(p => p.Category)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Category>()
                .HasMany(c => c.Blogs)
                .WithOne(b => b.Category)
                .HasForeignKey(b => b.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Visitor Analytics Fluent Configurations
            modelBuilder.Entity<VisitorTrack>()
                .HasIndex(vt => vt.VisitorCookieId)
                .IsUnique();

            modelBuilder.Entity<VisitorTrack>()
                .HasIndex(vt => vt.IpAddress);

            modelBuilder.Entity<VisitorSession>()
                .HasIndex(vs => vs.SessionCookieId)
                .IsUnique();

            modelBuilder.Entity<VisitorSession>()
                .HasIndex(vs => vs.StartedAt);

            modelBuilder.Entity<VisitorSession>()
                .HasOne(vs => vs.VisitorTrack)
                .WithMany(vt => vt.Sessions)
                .HasForeignKey(vs => vs.VisitorTrackId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PageVisit>()
                .HasIndex(pv => pv.EntryTime);

            modelBuilder.Entity<PageVisit>()
                .HasIndex(pv => pv.PagePath);

            modelBuilder.Entity<PageVisit>()
                .HasOne(pv => pv.VisitorSession)
                .WithMany(vs => vs.PageVisits)
                .HasForeignKey(pv => pv.VisitorSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<VisitorEvent>()
                .HasIndex(ve => ve.EventName);

            modelBuilder.Entity<VisitorEvent>()
                .HasIndex(ve => ve.Timestamp);

            modelBuilder.Entity<VisitorEvent>()
                .Property(ve => ve.Value)
                .HasPrecision(18, 2);

            modelBuilder.Entity<VisitorEvent>()
                .HasOne(ve => ve.VisitorSession)
                .WithMany(vs => vs.VisitorEvents)
                .HasForeignKey(ve => ve.VisitorSessionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<HourlyAnalytics>()
                .HasIndex(ha => ha.TargetHour)
                .IsUnique();

            modelBuilder.Entity<DailyAnalytics>()
                .HasIndex(da => da.TargetDate)
                .IsUnique();

            modelBuilder.Entity<WeeklyAnalytics>()
                .HasIndex(wa => wa.WeekStartDate)
                .IsUnique();

            modelBuilder.Entity<MonthlyAnalytics>()
                .HasIndex(ma => new { ma.Year, ma.Month })
                .IsUnique();
        }
    }
}
