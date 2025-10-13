"use client";

import React, { useState, useRef, useEffect } from 'react';

interface FadeInOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInOnScroll: React.FC<FadeInOnScrollProps> = ({ 
  children, 
  delay = 0, 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -16px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`
        transform transition-all duration-700 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-1 opacity-0'
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default FadeInOnScroll;
