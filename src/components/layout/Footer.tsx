// ============================================
// ASSE ZERO — Footer Component
// Zero React re-renders: uses ref-based DOM manipulation
// ============================================

import { SITE_NAME } from '@/lib/constants';
import { useEffect, useRef } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const updateReveal = () => {
      rafId = 0;
      if (!wrapperRef.current || !contentRef.current) return;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const distanceToBottom = maxScroll - scrollY;

      let progress: number;
      if (distanceToBottom <= window.innerHeight && distanceToBottom >= 0) {
        progress = 1 - (distanceToBottom / window.innerHeight);
      } else if (distanceToBottom < 0) {
        progress = 1;
      } else {
        progress = 0;
      }

      const currentScale = 0.5 + (progress * 0.5);
      const currentOpacity = Math.min(1, progress * 1.5);

      wrapperRef.current.style.height = `${progress * 100}vh`;
      contentRef.current.style.transform = `scale(${currentScale})`;
      contentRef.current.style.opacity = `${currentOpacity}`;
    };

    const handleScroll = () => {
      const distanceToBottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (distanceToBottom > window.innerHeight * 1.5) return;
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(updateReveal);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateReveal();

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <footer className="bg-primary text-dark overflow-hidden w-full h-screen relative" id="footer">
      <div
        ref={wrapperRef}
        className="absolute bottom-0 w-full flex flex-col justify-end items-start overflow-hidden will-change-[height]"
        style={{ height: '0vh' }}
      >
        <div
          ref={contentRef}
          className="px-8 pb-8 flex flex-col gap-1 will-change-transform"
          style={{
            transform: 'scale(0.5)',
            opacity: 0,
            transformOrigin: 'bottom left',
          }}
        >
          {/* Brand */}
          <h3 className="text-5xl font-heading font-black text-dark tracking-tighter">
            {SITE_NAME}
          </h3>
          <p className="text-dark/80 text-xl leading-relaxed font-bold">
            Team creativo specializzato in produzione video professionale e social media management.
          </p>

          {/* Navigazione */}
          <p className="text-base font-black text-dark uppercase tracking-wider mt-3">Navigazione</p>
          {['Home', 'Servizi', 'Team', 'Contatti'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-lg font-bold text-dark/80 hover:text-dark hover:underline underline-offset-4 transition-all duration-300"
            >
              {label}
            </a>
          ))}

          {/* Servizi */}
          <p className="text-base font-black text-dark uppercase tracking-wider mt-3">Servizi</p>
          <div className="flex flex-row flex-wrap gap-x-10 gap-y-1">
            {['Produzione Video', 'Post-Produzione', 'Social Media Management', 'Content Strategy'].map((service) => (
              <span key={service} className="text-lg font-bold text-dark/80">{service}</span>
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-dark/20 mt-4 pt-3 flex flex-col gap-1">
            <p className="text-base font-black text-dark/60 tracking-wider">
              © {currentYear} {SITE_NAME}. TUTTI I DIRITTI RISERVATI.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-base font-black text-dark/60 hover:text-dark transition-colors tracking-wider">PRIVACY POLICY</a>
              <a href="#" className="text-base font-black text-dark/60 hover:text-dark transition-colors tracking-wider">COOKIE POLICY</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
