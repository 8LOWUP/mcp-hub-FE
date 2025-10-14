"use client";

import React, { useEffect, useRef } from 'react';

interface AnimatedGradientProps {
  children: React.ReactNode;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 동적 그라데이션 생성
    const createGradient = () => {
      const colors = [
        'rgba(0, 52, 28, 0.1)',
        'rgba(0, 136, 255, 0.1)', 
        'rgba(0, 107, 139, 0.1)',
        'rgba(146, 110, 0, 0.1)',
        'rgba(188, 91, 0, 0.1)'
      ];
      
      const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
      const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
      
      return `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, ${randomColor1} 0%, ${randomColor2} 50%, rgba(0,0,0,0.8) 100%)`;
    };

    // 그라데이션 애니메이션
    const animateGradient = () => {
      container.style.background = createGradient();
    };

    const interval = setInterval(animateGradient, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen transition-all duration-3000 ease-in-out"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(0,255,136,0.1) 0%, rgba(0,136,255,0.1) 50%, rgba(0,0,0,0.8) 100%)'
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedGradient;
