import React from 'react';

export default function About({ settings, education }) {
  const eduList = education || [
    {
      institution: 'Sohail University, Karachi',
      degree: 'Bachelor of Science in Business Computing (BSBC)',
      duration: '2025 - 2029',
      description: 'Undergraduate program focused on software engineering, databases, programming, information systems, and business computing.'
    },
    {
      institution: 'Aptech Learning, Karachi',
      degree: 'Advanced Diploma in Software Engineering (ADSE)',
      duration: '2024 - 2027',
      description: 'Diploma covering full-stack software development, object-oriented systems, databases, web technologies, and modern architecture.'
    }
  ];

  return (
    <section id="about" className="py-5" style={{ position: 'relative', zIndex: 1 }}>
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5" data-aos="fade-up">
          <span className="badge px-3 py-2 rounded-pill font-monospace mb-2" style={{ background: 'rgba(0, 217, 255, 0.1)', color: '#00D9FF', border: '1px solid rgba(0, 217, 255, 0.3)' }}>
            // PROFILE ARCHITECTURE
          </span>
          <h2 className="text-white fw-bold display-6">About &amp; Academic Background</h2>
          <p className="text-secondary">Engineering scalable software with academic rigor and hands-on full-stack mastery.</p>
        </div>

        <div className="row g-4 align-items-stretch">
          {/* Bio Box */}
          <div className="col-lg-6" data-aos="fade-right">
            <div
              className="p-4 p-md-5 rounded-4 h-100"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h4 className="text-white fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="fas fa-terminal text-neon-cyan" style={{ color: '#00D9FF' }}></i> Developer Biography
              </h4>
              <p className="text-light lead fs-6" style={{ lineHeight: '1.8', opacity: 0.9 }}>
                Motivated and detail-oriented <strong style={{ color: '#00D9FF' }}>Software Developer</strong> with specialized knowledge of <strong style={{ color: '#A855F7' }}>MERN Stack (MongoDB, Express, React, Node.js)</strong>, <strong style={{ color: '#3B82F6' }}>ASP.NET Core MVC (C#)</strong>, SQL Server, and modern web engineering.
              </p>
              <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                Proven expertise in designing enterprise-grade portals such as university management platforms, admissions processing queues, and digital agency solutions. Dedicated to clean architecture, high-speed execution, and cutting-edge cyber UI design.
              </p>

              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 d-flex flex-wrap gap-4">
                <div>
                  <div className="text-secondary small font-monospace">LOCATION</div>
                  <div className="text-white fw-semibold">Karachi, Pakistan</div>
                </div>
                <div>
                  <div className="text-secondary small font-monospace">AVAILABILITY</div>
                  <div className="text-success fw-semibold font-monospace">● Active for Opportunities</div>
                </div>
                <div>
                  <div className="text-secondary small font-monospace">DEGREE TRACK</div>
                  <div className="text-white fw-semibold">BSBC &amp; ADSE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Education Timeline */}
          <div className="col-lg-6" data-aos="fade-left">
            <div
              className="p-4 p-md-5 rounded-4 h-100"
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h4 className="text-white fw-bold mb-4 d-flex align-items-center gap-2">
                <i className="fas fa-graduation-cap text-neon-purple" style={{ color: '#A855F7' }}></i> Academic Timeline
              </h4>

              <div className="timeline-container d-flex flex-column gap-4">
                {eduList.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-3"
                    style={{
                      background: 'rgba(139, 61, 255, 0.04)',
                      borderLeft: '4px solid #8B3DFF',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-white fs-6">{edu.degree}</span>
                      <span className="badge bg-secondary font-monospace" style={{ fontSize: '11px' }}>{edu.duration}</span>
                    </div>
                    <div className="text-neon-cyan small mb-2" style={{ color: '#00D9FF' }}>{edu.institution}</div>
                    <p className="text-secondary small mb-0">{edu.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
