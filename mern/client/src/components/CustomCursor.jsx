import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [dotPosition, setDotPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setDotPosition({ x: e.clientX, y: e.clientY });
      // Slight delay for outer ring
      setTimeout(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      }, 40);
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('a, button, input, textarea, .interactive-card, .btn')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        className={`custom-cursor d-none d-lg-block ${isHovered ? 'cursor-hover' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          position: 'fixed',
          zIndex: 99999
        }}
      />
      <div
        className="custom-cursor-dot d-none d-lg-block"
        style={{
          left: `${dotPosition.x}px`,
          top: `${dotPosition.y}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          position: 'fixed',
          zIndex: 99999
        }}
      />
    </>
  );
}
