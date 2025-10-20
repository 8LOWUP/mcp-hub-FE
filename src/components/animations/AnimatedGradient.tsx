"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface AnimatedGradientProps {
  children: React.ReactNode;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // hydration 완료 후에만 테마 감지
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // 웹앱의 테마 설정만 사용 (시스템 설정 완전 무시)
  const isDark = mounted ? theme === 'dark' : true;
  
  // 디버깅용 로그 (아이패드에서 테마 변경 감지 확인)
  useEffect(() => {
    console.log('Theme changed:', { theme, resolvedTheme, isDark, mounted });
  }, [theme, resolvedTheme, isDark, mounted]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 다크모드/화이트모드별 색상 팔레트 (아이패드 호환성을 위해 rgba 사용)
    const darkColorSequence = [
      'rgba(0, 52, 28, 0.15)',      // 진한 녹색
      'rgba(0, 136, 255, 0.15)',    // 파란색
      'rgba(0, 107, 139, 0.15)',    // 청록색
      'rgba(146, 110, 0, 0.15)',    // 황금색
      'rgba(188, 91, 0, 0.15)',     // 주황색
      'rgba(139, 0, 139, 0.15)',    // 보라색
      'rgba(220, 20, 60, 0.15)'     // 빨간색
    ];

    const lightColorSequence = [
      'rgba(173, 216, 230, 0.15)',  // 밝은 하늘색
      'rgba(144, 238, 144, 0.15)',  // 밝은 연두색
      'rgba(255, 218, 185, 0.15)',  // 밝은 피치
      'rgba(221, 160, 221, 0.15)',  // 밝은 라벤더
      'rgba(255, 228, 196, 0.15)',  // 밝은 크림
      'rgba(240, 248, 255, 0.15)',  // 매우 연한 하늘색
      'rgba(173, 216, 230, 0.15)'   // 밝은 하늘색
    ];

    let colorIndex = 0;
    let animationFrame: number;
    
    // 부드러운 위치 변화를 위한 현재 위치
    let currentPosition = { x: 50, y: 50 }; // 중앙에서 시작
    let targetPosition = { x: 50, y: 50 };
    
    // 위치 시퀀스 (부드러운 움직임)
    const positions = [
      { x: 20, y: 20 },   // 좌상단
      { x: 80, y: 20 },   // 우상단
      { x: 20, y: 80 },   // 좌하단
      { x: 80, y: 80 },   // 우하단
      { x: 50, y: 50 },   // 중앙
      { x: 30, y: 50 },   // 좌중앙
      { x: 70, y: 50 }    // 우중앙
    ];

    // 부드러운 색상 전환을 위한 보간 함수 (rgba 형식)
    const interpolateColor = (color1: string, color2: string, progress: number) => {
      // rgba 값 추출
      const extractRGBA = (color: string) => {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (!match) return { r: 0, g: 0, b: 0, a: 0 };
        return {
          r: parseInt(match[1]),
          g: parseInt(match[2]),
          b: parseInt(match[3]),
          a: parseFloat(match[4])
        };
      };

      const c1 = extractRGBA(color1);
      const c2 = extractRGBA(color2);

      return `rgba(${Math.round(c1.r + (c2.r - c1.r) * progress)}, ${Math.round(c1.g + (c2.g - c1.g) * progress)}, ${Math.round(c1.b + (c2.b - c1.b) * progress)}, ${c1.a + (c2.a - c1.a) * progress})`;
    };

    // 부드러운 위치 보간 함수
    const interpolatePosition = (pos1: { x: number, y: number }, pos2: { x: number, y: number }, progress: number) => {
      return {
        x: pos1.x + (pos2.x - pos1.x) * progress,
        y: pos1.y + (pos2.y - pos1.y) * progress
      };
    };

    // 부드러운 그라데이션 생성
    const createSmoothGradient = (progress: number) => {
      const colorSequence = isDark ? darkColorSequence : lightColorSequence;
      const currentColor = colorSequence[colorIndex % colorSequence.length];
      
      // 마지막 색상에서 첫 번째 색상으로 돌아가기
      const nextColorIndex = (colorIndex + 1) % colorSequence.length;
      const nextColor = colorSequence[nextColorIndex];
      
      // 색상 보간
      const interpolatedColor1 = interpolateColor(currentColor, nextColor, progress);
      const interpolatedColor2 = interpolateColor(nextColor, currentColor, 1 - progress);
      
      // 위치 보간 (부드러운 움직임)
      const interpolatedPos = interpolatePosition(currentPosition, targetPosition, progress);
      
      if (isDark) {
        return `radial-gradient(circle at ${interpolatedPos.x}% ${interpolatedPos.y}%, ${interpolatedColor1} 0%, ${interpolatedColor2} 50%, rgba(0,0,0,0.9) 100%)`;
      } else {
        return `radial-gradient(circle at ${interpolatedPos.x}% ${interpolatedPos.y}%, ${interpolatedColor1} 0%, ${interpolatedColor2} 50%, rgba(255,255,255,0.95) 100%)`;
      }
    };

    let startTime = Date.now();
    const duration = 10000; // 10초 동안 부드럽게 전환

    // 부드러운 애니메이션 루프
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeInOut 함수로 더 자연스러운 전환
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      container.style.background = createSmoothGradient(easeProgress);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // 전환이 완료되면 다음 색상과 위치로 (무한 루프)
        colorIndex++;
        
        // 현재 위치를 목표 위치로 업데이트
        currentPosition = { ...targetPosition };
        
        // 다음 목표 위치 설정 (부드러운 순환)
        const nextPositionIndex = (colorIndex) % positions.length;
        targetPosition = { ...positions[nextPositionIndex] };
        
        startTime = Date.now();
        animationFrame = requestAnimationFrame(animate);
      }
    };

    // 첫 번째 프레임에서 올바른 색상으로 시작
    container.style.background = createSmoothGradient(0);
    
    // 애니메이션 시작
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isDark]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen transition-all duration-3000 ease-in-out"
      style={{
        // 애니메이션이 시작되기 전까지는 기본 배경만 설정
        background: isDark 
          ? '#1A1A1A'  // 다크 모드 기본 배경
          : '#F9FAFB'  // 라이트 모드 기본 배경
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedGradient;
