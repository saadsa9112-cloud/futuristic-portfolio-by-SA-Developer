import React from 'react';

export default function Footer() {
  return (
    <footer
      className="py-4 border-top border-secondary border-opacity-25"
      style={{
        background: 'rgba(10, 10, 18, 0.95)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontWeight: '800', color: '#fff', fontSize: '15px' }}>
              HMS<span style={{ color: '#00D9FF' }}>.DEV</span>
            </span>
            <span className="text-secondary small">| Full-Stack Systems &amp; Software Architecture</span>
          </div>

          <div className="text-secondary small font-monospace">
            © {new Date().getFullYear()} Hafiz Muhammad Saad. Built with MERN Stack (React + Node + Express + Mongo).
          </div>

          <div className="d-flex align-items-center gap-2 font-monospace small" style={{ color: '#10B981' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
            SYSTEMS ONLINE
          </div>
        </div>
      </div>
    </footer>
  );
}
