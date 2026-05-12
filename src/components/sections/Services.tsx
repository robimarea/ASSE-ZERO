// ============================================
// ASSE ZERO — Services Section
// Scroll Orizzontale guidato dallo Scroll Verticale
// (Sticky Horizontal Scroll)
// Zero React re-renders: uses ref-based DOM manipulation
// ============================================

import { useRef, useEffect } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import '@/components/social-pricing.css';
import { VIDEO_PILLS, SMM_PILLS, VIDEO_DESCRIPTION } from '@/data/services';

interface ServicesProps {
  section: 'video' | 'smm';
  overlapNext?: boolean;
  isVisible?: boolean;
}
const CARDS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const SMM_PRICE_PLANS = [
  {
    name: 'Growth',
    price: '€79/mo',
    description: 'Per brand in crescita che vogliono aumentare la loro presenza online.',
    features: [
      'Gestione 2 profili social',
      '16 post al mese',
      'Content strategy avanzata',
      'Consulenza mensile',
      'Assistenza prioritaria',
    ],
    cta: 'Inizia Ora',
  },
  {
    name: 'Pro',
    price: '€149/mo',
    description: 'La soluzione completa per brand che puntano a dominare i social.',
    features: [
      'Gestione 3 profili social',
      '30 post al mese',
      'Strategia personalizzata',
      'Analisi trend & algoritmi',
      'Consulenze bisettimanali',
    ],
    cta: 'Inizia Ora',
  },
  {
    name: 'Agency',
    price: '€299/mo',
    description: 'Per agenzie e grandi brand con esigenze social complesse e multi-canale.',
    features: [
      'Profili illimitati',
      'Post illimitati',
      'Strategia multi-canale',
      'Dedicated account manager',
      'Report avanzati & analytics',
    ],
    cta: 'Contattaci',
  },
] as const;

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
      className="relative w-full bg-dark z-0"
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 z-10 w-full h-screen flex flex-col items-center justify-center overflow-visible py-12 md:py-24">

        <div className="w-full mx-auto px-4 flex flex-col items-center mb-8 shrink-0">
          <h2
            className={`w-full font-black tracking-tighter text-center mb-6 md:mb-12 ${
              isVideo
                ? 'font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-primary'
                : ''
            }`}
            style={isVideo
              ? { lineHeight: 0.9, fontFamily: "'Bebas Neue', sans-serif" }
              : { fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(5rem, 14vw, 13.4rem)', lineHeight: 0.9, color: '#e9ac06' }
            }
          >
            {title}
          </h2>


          {isVideo ? (
            <p
              className="text-white/70 text-center max-w-3xl mb-2"
              style={{ fontSize: '1rem', lineHeight: 1.7 }}
            >
              {VIDEO_DESCRIPTION}
            </p>
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

        {isVideo ? (
          <div className="w-full flex-1 flex items-center relative overflow-hidden">
            <div
              ref={trackRef}
              className="flex gap-4 md:gap-6 px-4 md:px-[10vw]"
              style={{
                width: 'max-content',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform'
              }}
            >
              {CARDS.map((num) => (
                <div
                  key={`${section}-card-${num}`}
                  className="shrink-0 w-64 sm:w-80 md:w-96 aspect-[4/3] bg-secondary rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <span className="text-5xl font-heading font-black text-dark/30">{num}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="price-scroll-container">
            {SMM_PRICE_PLANS.map((plan) => (
              <div key={plan.name} className="price-card-wrapper">
                <SpotlightCard spotlightColor="rgba(255, 220, 0, 0.25)" className="h-full flex flex-col">
                  <div className="flex flex-col gap-4 h-full">
                    <div>
                      <h3 className="text-white font-heading font-black text-2xl mb-1">{plan.name}</h3>
                      <p className="font-heading font-black text-3xl" style={{ color: '#FFD600' }}>{plan.price}</p>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{plan.description}</p>
                    <ul className="flex flex-col gap-2 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          <span style={{ color: '#FFD600' }}>✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className="w-full py-3 px-6 rounded-xl font-heading font-black text-sm tracking-wide transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: '#FFD600', color: '#000' }}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
