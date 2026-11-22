import React from 'react';

export default function Skills({ skills }) {
  const defaultSkills = [
    { name: 'MERN Stack (MongoDB, Express, React, Node)', percentage: 92, iconClass: 'fab fa-node-js', colorHex: '#10B981' },
    { name: 'ASP.NET Core MVC & Web APIs', percentage: 95, iconClass: 'fab fa-microsoft', colorHex: '#A855F7' },
    { name: 'C# / .NET 10 Ecosystem', percentage: 95, iconClass: 'fas fa-code', colorHex: '#3B82F6' },
    { name: 'SQL Server & Relational DBs', percentage: 90, iconClass: 'fas fa-database', colorHex: '#06B6D4' },
    { name: 'React & Modern Frontend UI', percentage: 88, iconClass: 'fab fa-react', colorHex: '#00D9FF' },
    { name: 'HTML5, CSS3 & JavaScript', percentage: 90, iconClass: 'fab fa-js', colorHex: '#F59E0B' },
    { name: 'Graphic Designing & UI/UX (Figma)', percentage: 90, iconClass: 'fas fa-palette', colorHex: '#EC4899' },
    { name: 'SEO & Performance Tuning', percentage: 88, iconClass: 'fas fa-chart-line', colorHex: '#F59E0B' },
    { name: 'PHP & MySQL', percentage: 85, iconClass: 'fab fa-php', colorHex: '#10B981' },
    { name: 'Git, GitHub & CI/CD Workflows', percentage: 90, iconClass: 'fab fa-git-alt', colorHex: '#EF4444' },
    { name: 'Entity Framework Core', percentage: 90, iconClass: 'fas fa-layer-group', colorHex: '#8B3DFF' }
  ];

  const skillList = skills && skills.length > 0 ? skills : defaultSkills;

  return (
    <section id="skills" className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="badge px-3 py-2 rounded-pill font-monospace mb-2" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            // TECH MATRIX
          </span>
          <h2 className="text-white fw-bold display-6">Technical Arsenal &amp; Capabilities</h2>
          <p className="text-secondary">Specialized stack proficiency across enterprise systems and modern web stacks.</p>
        </div>

        {/* Skills Grid */}
        <div className="row g-4">
          {skillList.map((skill, idx) => (
            <div key={idx} className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay={(idx % 6) * 50}>
              <div
                className="p-4 rounded-4 h-100 transition-all hover-elevate"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: `${skill.colorHex}15`,
                        border: `1px solid ${skill.colorHex}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: skill.colorHex
                      }}
                    >
                      <i className={skill.iconClass}></i>
                    </div>
                    <span className="fw-semibold text-white fs-6">{skill.name}</span>
                  </div>
                  <span className="font-monospace fw-bold small" style={{ color: skill.colorHex }}>
                    {skill.percentage}%
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  className="progress"
                  style={{
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${skill.percentage}%`,
                      background: `linear-gradient(90deg, ${skill.colorHex}, #8B3DFF)`,
                      boxShadow: `0 0 10px ${skill.colorHex}`
                    }}
                    aria-valuenow={skill.percentage}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
