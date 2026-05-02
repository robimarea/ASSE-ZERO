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
        className="absolute bottom-0 w-full flex flex-col justify-center items-center overflow-hidden will-change-[height]"
        style={{ height: '0vh' }}
      >
        <div
          ref={contentRef}
          className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-24 will-change-transform"
          style={{
            transform: 'scale(0.5)',
            opacity: 0,
            transformOrigin: 'center center',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <h3 className="text-3xl font-heading font-black text-dark mb-4 tracking-tighter">
                {SITE_NAME}
              </h3>
              <p className="text-dark/80 text-sm md:text-base leading-relaxed font-bold">
                Team creativo specializzato in produzione video professionale
                e social media management.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-black text-dark uppercase tracking-wider mb-4 border-b border-dark/20 pb-2 inline-block">
                Navigazione
              </h4>
              <ul className="space-y-2">
                {['Home', 'Servizi', 'Team', 'Contatti'].map((label) => (
                  <li key={label}>
                    <a
                      href={`#${label.toLowerCase()}`}
                      className="text-sm md:text-base font-bold text-dark/80 hover:text-dark hover:underline underline-offset-4 transition-all duration-300"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-black text-dark uppercase tracking-wider mb-4 border-b border-dark/20 pb-2 inline-block">
                Servizi
              </h4>
              <ul className="space-y-2">
                {['Produzione Video', 'Post-Produzione', 'Social Media Management', 'Content Strategy'].map(
                  (service) => (
                    <li key={service}>
                      <span className="text-sm md:text-base font-bold text-dark/80">{service}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-dark/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm font-black text-dark/60 tracking-wider">
              © {currentYear} {SITE_NAME}. TUTTI I DIRITTI RISERVATI.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs md:text-sm font-black text-dark/60 hover:text-dark transition-colors tracking-wider">
                PRIVACY POLICY
              </a>
              <a href="#" className="text-xs md:text-sm font-black text-dark/60 hover:text-dark transition-colors tracking-wider">
                COOKIE POLICY
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
