// ============================================
// ASSE ZERO — Services Section
// Scroll Orizzontale guidato dallo Scroll Verticale
// (Sticky Horizontal Scroll)
// Zero React re-renders: uses ref-based DOM manipulation
// ============================================

import { useRef, useEffect } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import '@/components/social-pricing.css';
import { VIDEO_PILLS, SMM_PILLS, VIDEO_DESCRIPTION, SMM_PRICE_PLANS, VIDEO_PLANS } from '@/data/services';

interface ServicesProps {
  section: 'video' | 'smm';
  overlapNext?: boolean;
  isVisible?: boolean;
}

export function Services({ section, overlapNext = false, isVisible = true }: ServicesProps) {
  const isVideo = section === 'video';
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const title = isVideo ? 'VIDEO' : (
    <>SOCIAL MEDIA<br/>MANAGEMENT</>
  );

  const pills = isVideo ? VIDEO_PILLS : SMM_PILLS;

  // SMM: z-index dinamico in base alla direzione di scroll
  // Quando si scrolla verso l'alto, la sezione sale sopra la Philosophy curtain (zIndex 40)
  // così il titolo rimane visibile
  useEffect(() => {
    if (isVideo) return;
    const section = containerRef.current;
    if (!section) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollingUp = window.scrollY < lastScrollY;
      lastScrollY = window.scrollY;
      section.style.zIndex = scrollingUp ? '50' : '0';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVideo]);

  useEffect(() => {
    if (!isVideo) return;

    let rafId = 0;

    const syncTranslate = () => {
      rafId = 0;
      if (!containerRef.current || !trackRef.current) return;

      const container = containerRef.current;
      const track = trackRef.current;

      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;

      const deadZoneMultiplier = overlapNext ? 2 : 1;
      const scrollableDistance = container.offsetHeight - (deadZoneMultiplier * window.innerHeight);

      const trackWidth = track.scrollWidth > 0 ? track.scrollWidth : CARDS.length * 400;
      const trackScrollableWidth = Math.max(0, trackWidth - window.innerWidth);

      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));

      track.style.transform = `translate3d(-${progress * trackScrollableWidth}px, 0, 0)`;
    };

    const handleScroll = () => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(syncTranslate);
    };

    const handleResize = () => {
      handleScroll();
    };

    if (!isVisible) return;

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    syncTranslate();

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [overlapNext, isVisible, isVideo]);

  return (
    <section
      ref={containerRef}
      className={`relative w-full z-0 ${isVideo ? 'bg-primary' : 'bg-dark'}`}
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 z-10 w-full h-screen flex flex-col items-center justify-center overflow-visible py-12 md:py-24">

        <div className="w-full mx-auto px-4 flex flex-col items-center mb-8 shrink-0">
          <h2
            className={`font-black uppercase tracking-tighter mb-4 ${isVideo ? 'text-dark' : 'text-primary'} ${
              isVideo
                ? 'font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                : ''
            }`}
            style={isVideo
              ? { lineHeight: 0.9, fontFamily: "'Bebas Neue', sans-serif" }
              : { fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 14vw, 13.4rem)', lineHeight: 0.9 }
            }
          >
            {title}
          </h2>


          {isVideo ? (
            <div
              className="text-dark text-center max-w-4xl mb-8 flex flex-col gap-4"
              style={{ fontSize: '1.1rem', lineHeight: 1.6 }}
            >
              {VIDEO_DESCRIPTION.map((text, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl">
              {pills.map((pill) => (
                <span
                  key={pill}
                  className="px-3 py-1.5 md:px-4 md:py-2 text-xs sm:text-sm font-medium text-white/70 bg-white/5 border border-white/10 rounded-full whitespace-nowrap"
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="price-scroll-container">
          {(isVideo ? VIDEO_PLANS : SMM_PRICE_PLANS).map((plan) => (
            <div key={plan.name} className="price-card-wrapper">
              <SpotlightCard spotlightColor="rgba(233, 172, 6, 0.25)" className="h-full flex flex-col bg-dark/90 backdrop-blur-sm rounded-3xl border border-white/5">
                <div className="flex flex-col gap-5 h-full p-2">
                  <div>
                    <h3 className="text-white font-heading font-black text-2xl mb-1 tracking-tight">{plan.name}</h3>
                    <p className="font-heading font-black text-3xl text-primary">{plan.price}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-white/50">{plan.description}</p>
                  <ul className="flex flex-col gap-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="text-primary font-bold">✓</span>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 px-6 rounded-2xl font-heading font-black text-sm tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-primary text-dark uppercase">
                    {(plan as any).cta || 'Richiedi Info'}
                  </button>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
