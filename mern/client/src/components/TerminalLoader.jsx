import React, { useState, useEffect } from 'react';

export default function TerminalLoader({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [isDone, setIsDone] = useState(false);

  const bootLogs = [
    { text: 'SYS.INIT: Booting HMS Cyber-Kernel v3.2.0...', color: '#00D9FF' },
    { text: 'MOUNTING: MERN Stack (MongoDB, Express, React, Node.js)', color: '#10B981' },
    { text: 'CORE: Initializing REST API endpoints on port 5000...', color: '#A855F7' },
    { text: 'SECURITY: TLS v1.3 encryption handshake established.', color: '#F59E0B' },
    { text: 'SYSTEM READY: All systems operational. Launching interface...', color: '#10B981' }
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) onComplete();
        }, 400);
      }
    }, 280);

    return () => clearInterval(interval);
  }, []);

  if (isDone) return null;

  return (
    <div
      id="loader-screen"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#0a0a12',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s ease',
        padding: '1.5rem'
      }}
    >
      <div
        className="dev-terminal"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(15, 17, 26, 0.95)',
          border: '1px solid rgba(139, 61, 255, 0.4)',
          borderRadius: '8px',
          boxShadow: '0 0 30px rgba(139, 61, 255, 0.25)',
          overflow: 'hidden',
          fontFamily: 'monospace'
        }}
      >
        <div
          className="dev-terminal-bar"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
          </div>
          <span style={{ color: '#9CA3AF', fontSize: '13px' }}>saad@portfolio ~ bash [MERN]</span>
        </div>
        <div style={{ padding: '20px', minHeight: '180px', fontSize: '13.5px', lineHeight: '1.6' }}>
          {logs.map((log, idx) => (
            <div key={idx} style={{ color: log.color, marginBottom: '6px' }}>
              <span style={{ color: '#6B7280', marginRight: '8px' }}>$</span>
              {log.text}
            </div>
          ))}
          <span style={{ display: 'inline-block', width: '8px', height: '15px', background: '#00D9FF', animation: 'blink 1s infinite' }}></span>
        </div>
      </div>
    </div>
  );
}
