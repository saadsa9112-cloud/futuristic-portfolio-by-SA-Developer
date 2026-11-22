import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(10, 10, 18, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(139, 61, 255, 0.2)' : 'none',
        padding: scrolled ? '10px 0' : '18px 0',
        zIndex: 1000
      }}
    >
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #8B3DFF, #00D9FF)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: '0 0 15px rgba(139, 61, 255, 0.5)'
            }}
          >
            SA
          </div>
          <div>
            <span style={{ fontWeight: '800', letterSpacing: '1px', color: '#fff', fontSize: '18px' }}>
              HMS<span style={{ color: '#00D9FF' }}>.DEV</span>
            </span>
            <div style={{ fontSize: '10px', color: '#10B981', fontFamily: 'monospace' }}>● MERN ARCHITECTURE</div>
          </div>
        </a>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
        >
          <i className={`fas ${navOpen ? 'fa-times' : 'fa-bars'}`} style={{ color: '#00D9FF', fontSize: '20px' }}></i>
        </button>

        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3 my-3 my-lg-0">
            <li className="nav-item">
              <a className="nav-link text-white-50 hover-neon" href="#home" onClick={() => setNavOpen(false)}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white-50 hover-neon" href="#about" onClick={() => setNavOpen(false)}>
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white-50 hover-neon" href="#skills" onClick={() => setNavOpen(false)}>
                Skills
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white-50 hover-neon" href="#projects" onClick={() => setNavOpen(false)}>
                Projects
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white-50 hover-neon" href="#contact" onClick={() => setNavOpen(false)}>
                Contact
              </a>
            </li>
            <li className="nav-item ms-lg-2">
              <a
                href="/files/Muhammad_Saad_CV.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-info btn-sm px-3 rounded-pill"
                style={{
                  borderColor: '#00D9FF',
                  color: '#00D9FF',
                  boxShadow: '0 0 10px rgba(0, 217, 255, 0.2)'
                }}
              >
                <i className="fas fa-file-pdf me-1"></i> Resume CV
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
