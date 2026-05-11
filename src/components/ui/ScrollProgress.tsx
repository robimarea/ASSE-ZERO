// ============================================
// ASSE ZERO — Scroll Progress Bar
// Zero React re-renders: uses ref-based DOM manipulation
// ============================================

import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const updateBar = () => {
      rafId = 0;
      if (!barRef.current || !containerRef.current) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100));
        barRef.current.style.width = `${pct}%`;
        containerRef.current.setAttribute('aria-valuenow', String(Math.round(pct)));
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
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-[2px] z-[9999] bg-transparent"
      role="progressbar"
      aria-label="Avanzamento pagina"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div
        ref={barRef}
        className="h-full bg-primary origin-left shadow-[0_0_12px_3px_rgba(191,51,32,0.8)]"
        style={{ width: '0%' }}
      />
    </div>
  );
}
