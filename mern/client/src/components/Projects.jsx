import React, { useState } from 'react';

export default function Projects({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const defaultProjects = [
    {
      title: 'NED Academy University Management System (UMS)',
      subtitle: 'Enterprise Academic Course, Student & Department Management Architecture',
      description: 'Engineered a robust university management platform featuring student enrollment, departmental hierarchy administration, teacher course assignments, notice board broadcasts, and academic progress tracking.',
      technologies: 'ASP.NET Core MVC, C#, Entity Framework Core, SQL Server, Bootstrap, LINQ',
      githubLink: 'https://github.com/saadsa9112-cloud',
      thumbnailPath: '/images/projects/ned-academy-system.jpg',
      category: 'University Projects',
      challenges: 'Managing relational student registrations, course prerequisite hierarchies, and faculty assignments across multi-department academic structures.',
      solutions: 'Architected a normalized SQL Server relational schema with EF Core repository patterns and transaction boundaries.'
    },
    {
      title: 'NED Academy Admissions & Public University Portal',
      subtitle: 'Complete Online Admission Lifecycle & Departmental CMS Engine',
      description: 'Engineered an enterprise-grade university admissions and content management system featuring student application workflows, document proof verification queues, academic program registries, fee voucher management, audit logging, and dynamic CMS controls.',
      technologies: 'ASP.NET Core 10 MVC, C#, EF Core 10, SQL Server, Bootstrap 5, LINQ',
      githubLink: 'https://github.com/saadsa9112-cloud',
      thumbnailPath: '/images/projects/ned-academy-website.jpg',
      category: 'University Projects',
      challenges: 'Managing multi-step student admission submissions, document upload verification queues, and role-based academic authorizations.',
      solutions: 'Designed an asynchronous EF Core transaction model with administrative audit logging and secure document uploads.'
    },
    {
      title: 'Nexora Digital Agency & Client Solutions Platform',
      subtitle: 'Full-Scale Agency CMS, Client Inquiries, and Interactive Service Engine',
      description: 'Developed a modern, high-conversion agency platform with dynamic service catalogs, case study showcase, lead capture telemetry, and sleek cyber-aesthetic branding.',
      technologies: 'HTML5, CSS3, JavaScript, PHP, MySQL, Bootstrap, SwiperJS',
      githubLink: 'https://github.com/saadsa9112-cloud',
      thumbnailPath: '/images/projects/nexora-agency.jpg',
      category: 'Agency Websites',
      challenges: 'Client lead generation telemetry and performance optimization on visual-heavy portfolio pages.',
      solutions: 'Integrated lazy asset delivery, micro-interactions, and real-time form validation pipelines.'
    },
    {
      title: 'Futuristic Cyber Portfolio & Systems Architecture Portal',
      subtitle: 'High-Performance Interactive Showcase with Matrix Canvas, Terminal Bootloader & Ambient FX',
      description: 'High-octane developer portfolio featuring cyber-themed animations, real-time telemetry, terminal emulator, audio effects, and architecture quick-scan overlay.',
      technologies: 'React.js, Node.js, Express, MongoDB, Canvas API, CSS3 Glassmorphism',
      githubLink: 'https://github.com/saadsa9112-cloud/futuristic-portfolio-by-SA-Developer',
      thumbnailPath: '/images/projects/cyber-portfolio.jpg',
      category: 'Portfolio Websites',
      challenges: 'Seamlessly porting enterprise full-stack architecture to MERN stack without losing 60fps animations.',
      solutions: 'Modularized React component lifecycle, dynamic API hooks, and CSS hardware-accelerated animations.'
    }
  ];

  const projectList = projects && projects.length > 0 ? projects : defaultProjects;

  return (
    <section id="projects" className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="badge px-3 py-2 rounded-pill font-monospace mb-2" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            // FEATURED DEPLOYMENTS
          </span>
          <h2 className="text-white fw-bold display-6">Featured Enterprise Projects</h2>
          <p className="text-secondary">Production-ready systems, portals, and web architectures engineered with precision.</p>
        </div>

        {/* Project Cards */}
        <div className="row g-4">
          {projectList.map((proj, idx) => (
            <div key={idx} className="col-lg-6" data-aos="fade-up" data-aos-delay={(idx % 2) * 100}>
              <div
                className="rounded-4 overflow-hidden h-100 d-flex flex-column"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  transition: 'transform 0.3s ease, border-color 0.3s ease'
                }}
              >
                {/* Image Banner */}
                <div className="position-relative overflow-hidden" style={{ height: '220px', background: '#0e111a' }}>
                  <img
                    src={proj.thumbnailPath}
                    alt={proj.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/project-placeholder.jpg';
                    }}
                    className="w-100 h-100 object-fit-cover"
                    style={{ transition: 'transform 0.5s ease' }}
                  />
                  <div
                    className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill font-monospace small"
                    style={{ background: 'rgba(10, 10, 18, 0.85)', color: '#00D9FF', border: '1px solid rgba(0, 217, 255, 0.3)' }}
                  >
                    {proj.category || 'Architecture'}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 d-flex flex-column flex-grow-1">
                  <h4 className="text-white fw-bold fs-5 mb-2">{proj.title}</h4>
                  <p className="text-neon-cyan small font-monospace mb-3" style={{ color: '#00D9FF' }}>
                    {proj.subtitle}
                  </p>
                  <p className="text-secondary small mb-4 flex-grow-1" style={{ lineHeight: '1.7' }}>
                    {proj.description}
                  </p>

                  {/* Tech stack */}
                  <div className="d-flex flex-wrap gap-1 mb-4">
                    {(proj.technologies || '').split(',').map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="badge font-monospace"
                        style={{
                          background: 'rgba(139, 61, 255, 0.1)',
                          color: '#C084FC',
                          border: '1px solid rgba(139, 61, 255, 0.25)',
                          fontSize: '11px'
                        }}
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="d-flex gap-2 mt-auto pt-3 border-top border-secondary border-opacity-25">
                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-light rounded-pill px-3"
                      >
                        <i className="fab fa-github me-1"></i> Repository
                      </a>
                    )}
                    <button
                      className="btn btn-sm btn-outline-info rounded-pill px-3 ms-auto"
                      onClick={() => setSelectedProject(proj)}
                      style={{ borderColor: 'rgba(0, 217, 255, 0.4)', color: '#00D9FF' }}
                    >
                      <i className="fas fa-microchip me-1"></i> Arch Specs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for Architecture Specs */}
        {selectedProject && (
          <div
            className="modal-backdrop-custom"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 10, 18, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="p-4 rounded-4"
              style={{
                width: '100%',
                maxWidth: '600px',
                background: '#0e111a',
                border: '1px solid rgba(0, 217, 255, 0.4)',
                boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-white fw-bold mb-0">{selectedProject.title}</h5>
                <button
                  className="btn btn-sm text-white fs-4 p-0"
                  onClick={() => setSelectedProject(null)}
                >
                  &times;
                </button>
              </div>

              <div className="mb-3">
                <span className="text-secondary small font-monospace">ENGINEERING CHALLENGES</span>
                <p className="text-light small mt-1">{selectedProject.challenges || 'Managing complex relational integrity and asynchronous throughput.'}</p>
              </div>

              <div className="mb-4">
                <span className="text-neon-cyan small font-monospace" style={{ color: '#00D9FF' }}>ARCHITECTURAL SOLUTION</span>
                <p className="text-light small mt-1">{selectedProject.solutions || 'Designed modular repository layers, transaction scoping, and high-performance querying.'}</p>
              </div>

              <div className="text-end">
                <button
                  className="btn btn-sm btn-secondary rounded-pill px-4"
                  onClick={() => setSelectedProject(null)}
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
