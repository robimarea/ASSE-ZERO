// ============================================
// ASSE ZERO — Scroll Progress Bar
// Zero React re-renders: uses ref-based DOM manipulation
// ============================================

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const updateBar = () => {
      rafId = 0;
      if (!barRef.current) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100));
        barRef.current.style.width = `${pct}%`;
      }
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(updateBar);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateBar();

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9999] bg-transparent">
      <div
        ref={barRef}
        className="h-full bg-primary origin-left shadow-[0_0_12px_3px_rgba(191,51,32,0.8)]"
        style={{ width: '0%' }}
      />
    </div>
  );
}
