import React, { useEffect, useRef } from 'react';

export default function Hero({ settings, stats }) {
  const typedRef = useRef(null);

  useEffect(() => {
    if (window.Typed && typedRef.current) {
      const typed = new window.Typed(typedRef.current, {
        strings: [
          'Full-Stack Software Engineer',
          'MERN Stack Web Developer',
          'ASP.NET Core 10 & C# Specialist',
          'Graphic Designer & UI/UX Specialist',
          'SEO & Performance Tuning Expert',
          'BSBC @ Sohail University'
        ],
        typeSpeed: 50,
        backSpeed: 25,
        loop: true
      });
      return () => typed.destroy();
    }
  }, []);

  return (
    <section id="home" className="hero-section py-5 d-flex align-items-center" style={{ minHeight: '100vh', paddingTop: '100px' }}>
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-7" data-aos="fade-right">
            {/* Status Badge */}
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-4 rounded-pill font-monospace"
              style={{
                background: 'rgba(139, 61, 255, 0.12)',
                border: '1px solid rgba(139, 61, 255, 0.4)',
                color: '#C084FC',
                fontSize: '13px'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
              SYS.INIT // SOFTWARE ENGINEER & ARCHITECT
            </div>

            <h1 className="display-4 fw-bold text-white mb-3" style={{ letterSpacing: '-0.5px' }}>
              HAFIZ MUHAMMAD <span style={{ color: '#00D9FF' }}>SAAD</span>
            </h1>

            <div className="h4 font-monospace text-muted mb-4" style={{ minHeight: '36px' }}>
              <span className="text-secondary">&gt; </span>
              <span ref={typedRef} className="text-neon-cyan" style={{ color: '#00D9FF' }}></span>
            </div>

            <p className="lead text-light mb-4" style={{ maxWidth: '600px', lineHeight: '1.8', opacity: 0.85 }}>
              Passionate software engineer building high-impact full-stack architectures, modern web portals, and scalable cloud solutions using MERN Stack, ASP.NET Core MVC, and enterprise databases.
            </p>

            {/* CTAs */}
            <div className="d-flex flex-wrap gap-3 mb-5">
              <a
                href="#projects"
                className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
                style={{
                  background: 'linear-gradient(135deg, #8B3DFF, #6366F1)',
                  border: 'none',
                  boxShadow: '0 0 20px rgba(139, 61, 255, 0.4)'
                }}
              >
                <i className="fas fa-microchip me-2"></i> Explore Projects
              </a>
              <a
                href="#contact"
                className="btn btn-outline-light px-4 py-2 rounded-pill fw-semibold"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <i className="fas fa-terminal me-2"></i> Initiate Contact
              </a>
            </div>

            {/* Micro Stats */}
            <div className="row g-3">
              {(stats || [
                { title: 'Enterprise Projects', value: 4, iconClass: 'fas fa-folder-open' },
                { title: 'Years Coding', value: 2, iconClass: 'fas fa-laptop-code' },
                { title: 'Core Tech', value: 11, iconClass: 'fas fa-code' }
              ]).slice(0, 3).map((stat, i) => (
                <div key={i} className="col-4">
                  <div
                    className="p-3 rounded-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    <div className="fs-3 fw-bold text-white font-monospace">{stat.value}+</div>
                    <div className="text-secondary small">{stat.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile / Emblem Visual */}
          <div className="col-lg-5 text-center" data-aos="zoom-in">
            <div
              className="position-relative mx-auto"
              style={{
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                padding: '10px',
                background: 'linear-gradient(135deg, rgba(139, 61, 255, 0.3), rgba(0, 217, 255, 0.3))',
                boxShadow: '0 0 50px rgba(139, 61, 255, 0.25)'
              }}
            >
              <img
                src="/images/profile.png"
                alt="Hafiz Muhammad Saad"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/saad-avatar.png';
                }}
                className="w-100 h-100 rounded-circle object-fit-cover shadow"
                style={{ border: '3px solid rgba(0, 217, 255, 0.5)' }}
              />
              <div
                className="position-absolute bottom-0 end-0 p-2 rounded-circle"
                style={{
                  background: '#10B981',
                  border: '3px solid #0a0a12',
                  boxShadow: '0 0 15px #10B981'
                }}
                title="Available for freelance & full-time roles"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
