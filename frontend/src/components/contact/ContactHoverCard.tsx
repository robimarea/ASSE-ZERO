// ============================================
// ASSE ZERO — ContactHoverCard
// Wrapper con effetto tilt interattivo al mouse
// ============================================

import { useRef, type ReactNode } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ContactHoverCardProps {
  children: ReactNode;
  className?: string;
}

export function ContactHoverCard({ children, className = '' }: ContactHoverCardProps) {
  const cardRef      = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const leaveTimerId = useRef<number>(0);
  const isMobile     = useIsMobile();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → +0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotateX = -y * 8;   // max ±4°
      const rotateY =  x * 8;
      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    window.clearTimeout(leaveTimerId.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
    card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    leaveTimerId.current = window.setTimeout(() => { card.style.transition = ''; }, 500);
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={isMobile ? undefined : handleMouseMove}
      onMouseLeave={isMobile ? undefined : handleMouseLeave}
      style={isMobile ? {} : { willChange: 'transform', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}
