// ============================================
// ASSE ZERO — Services Section
// Scroll Orizzontale guidato dallo Scroll Verticale
// (Sticky Horizontal Scroll)
// ============================================

import { useRef, useEffect, useState } from 'react';

interface ServicesProps {
  section: 'video' | 'smm';
  overlapNext?: boolean;
}

// Card placeholder — da sostituire con case study reali
const CARD_COUNT = 8;

export function Services({ section, overlapNext = false }: ServicesProps) {
  const isVideo = section === 'video';
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  const title = isVideo ? 'VIDEO' : (
    <>SOCIAL MEDIA<br/>MANAGEMENT</>
  );

  const pills = isVideo
    ? ['Spot Pubblicitari', 'Videoclip', 'Cortometraggi', 'Recap Eventi', 'Video Corporate', 'Documentari', 'Content Social', 'Motion Graphics', 'Interviste']
    : ['Gestione Profilo', 'Content Strategy', 'Trending', 'Algorithm Following', 'Strategia Personalizzata', 'Consulenze'];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;

      const container = containerRef.current;
      const track = trackRef.current;

      const rect = container.getBoundingClientRect();
      const scrolled = -rect.top;

      // Se overlapNext è true, la sezione successiva sovrappone gli ultimi 100vh:
      // riduciamo scrollableDistance di 100vh così lo scroll orizzontale
      // finisce prima che inizi l'overlap.
      const deadZoneMultiplier = overlapNext ? 2 : 1;
      const scrollableDistance = container.offsetHeight - (deadZoneMultiplier * window.innerHeight);

      const trackScrollableWidth = Math.max(0, track.scrollWidth - window.innerWidth);

      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      setTranslateX(progress * trackScrollableWidth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [overlapNext]);

  return (
    <section
      ref={containerRef}
      id={isVideo ? 'servizi' : 'services-smm'}
      className="relative w-full bg-dark z-0"
      style={{ height: '400vh' }}
    >
      <div className="sticky top-0 z-10 w-full h-screen flex flex-col items-center justify-center overflow-hidden py-12 md:py-24">

        <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center mb-8 shrink-0">
          <h2
            className={`font-heading font-black text-primary tracking-tighter text-center mb-6 md:mb-12 ${
              isVideo
                ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
                : 'text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]'
            }`}
            style={{ lineHeight: 0.9 }}
          >
            {title}
          </h2>

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
        </div>

        <div className="w-full flex-1 flex items-center relative overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-4 md:gap-6 px-4 md:px-[10vw]"
            style={{
              width: 'max-content',
              transform: `translate3d(-${translateX}px, 0, 0)`,
              willChange: 'transform',
            }}
          >
            {Array.from({ length: CARD_COUNT }, (_, i) => i + 1).map((num) => (
              <div
                key={`${section}-card-${num}`}
                className="shrink-0 w-64 sm:w-80 md:w-96 aspect-[4/3] bg-secondary rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-5xl font-heading font-black text-dark/30">{num}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
