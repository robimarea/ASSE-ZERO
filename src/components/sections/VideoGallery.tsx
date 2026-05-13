// ============================================
// ASSE ZERO — Video Gallery Section
// Vertical staggered scroll slider for video portfolio
// Zero React re-renders pattern
// ============================================

import { useRef, useEffect } from 'react';
import { VIDEO_PILLS, VIDEO_DESCRIPTION } from '@/data/services';

// TODO: sostituire i gradient con immagini locali in /public/video/ (es. spot.jpg, videoclip.jpg, ...)
const VIDEO_ITEMS = [
  {
    id: 1, title: 'SPOT PUBBLICITARI', subtitle: 'Commercials & Ads',
    gradient: 'linear-gradient(135deg, #BF3320 0%, #3a0a05 60%, #000 100%)',
  },
  {
    id: 2, title: 'VIDEOCLIP', subtitle: 'Music Videos',
    gradient: 'linear-gradient(135deg, #5a1a0a 0%, #1a0505 60%, #000 100%)',
  },
  {
    id: 3, title: 'DOCUMENTARI', subtitle: 'Documentary Films',
    gradient: 'linear-gradient(135deg, #E9AC06 0%, #4a3200 60%, #000 100%)',
  },
  {
    id: 4, title: 'RECAP EVENTI', subtitle: 'Event Coverage',
    gradient: 'linear-gradient(135deg, #CC7F11 0%, #3a2000 60%, #000 100%)',
  },
  {
    id: 5, title: 'MOTION GRAPHICS', subtitle: '2D/3D Animation',
    gradient: 'linear-gradient(135deg, #D1523E 0%, #2a0a05 60%, #000 100%)',
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

interface VideoGalleryProps {
  isVisible?: boolean;
}

export function VideoGallery({ isVisible = true }: VideoGalleryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    let frameId = 0;
    let sectionTop = 0;
    let sectionHeight = 0;

    const updateMetrics = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        sectionTop = rect.top + window.scrollY;
        sectionHeight = containerRef.current.offsetHeight;
      }
    };

    const syncProgress = () => {
      frameId = 0;
      if (!containerRef.current) return;

      const scrollY = window.scrollY;
      const scrolled = scrollY - sectionTop;
      const scrollableDistance = sectionHeight - window.innerHeight;
      const progress = clamp(scrolled / (scrollableDistance || 1), 0, 1);

      const travel = progress * (VIDEO_ITEMS.length + 1) - 0.5;
      const newActiveIndex = clamp(Math.round(travel), 0, VIDEO_ITEMS.length - 1);

      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const relative = index - travel;
        const distance = Math.abs(relative);

        if (distance > 3) {
          if (el.style.display !== 'none') el.style.display = 'none';
          return;
        }
        if (el.style.display !== 'block') el.style.display = 'block';

        const yOffset = relative * 45;
        const xOffset = 5 - (distance * distance * 1.44) * 6;
        const scale = clamp(1 - distance * 0.25, 0.5, 1);
        const rotateZ = relative * -4;
        const opacity = clamp(1.2 - distance * 0.4, 0, 1);
        const isActive = distance < 0.5;

        el.style.transform = `translate3d(${xOffset}vw, ${yOffset}vh, 0) scale(${scale}) rotateZ(${rotateZ}deg)`;
        el.style.opacity = `${opacity}`;
        el.style.zIndex = isActive ? '20' : `${10 - Math.floor(distance)}`;

        const overlay = overlayRefs.current[index];
        const text = textRefs.current[index];

        if (overlay) overlay.style.opacity = isActive ? '0' : '1';
        if (text) {
          text.style.opacity = isActive ? '1' : '0';
          text.style.transform = isActive ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)';
        }
      });

      if (newActiveIndex !== activeIndexRef.current) {
        activeIndexRef.current = newActiveIndex;
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const viewportBottom = window.scrollY + window.innerHeight;
      const sectionBottom = sectionTop + sectionHeight;
      if (viewportBottom < sectionTop || window.scrollY > sectionBottom) return;
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(syncProgress);
    };

    const handleResize = () => {
      updateMetrics();
      handleScroll();
    };

    if (!isVisible) return;

    updateMetrics();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    syncProgress();

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <section ref={containerRef} className="relative w-full bg-dark z-0" style={{ height: '400vh' }}>
      <div className="sticky top-0 z-10 w-full h-screen overflow-hidden bg-dark flex flex-col md:flex-row items-center justify-center">
        
        {/* Left Side: Video Slider Column */}
        <div className="relative w-full md:w-[55%] h-full flex items-center justify-center shrink-0">
          

          {VIDEO_ITEMS.map((item, index) => {
            return (
              <article
                key={item.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="absolute w-[80vw] md:w-[32vw] aspect-video origin-center will-change-transform"
                style={{
                  opacity: 0,
                  transform: 'translate3d(0, 100vh, 0)',
                }}
              >
                {/* Image Container */}
                <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl relative bg-black">
                  <div
                    className="w-full h-full opacity-80"
                    style={{ background: item.gradient }}
                    aria-hidden="true"
                  />
                  
                  {/* Diagonal Hatch Overlay for inactive items */}
                  <div
                    ref={(el) => { overlayRefs.current[index] = el; }}
                    className="video-overlay absolute inset-0 transition-opacity duration-500 pointer-events-none"
                    aria-hidden="true"
                    style={{
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.8) 10px, rgba(0,0,0,0.8) 20px), rgba(0,0,0,0.4)',
                      backdropFilter: 'grayscale(100%) brightness(0.6)',
                    }}
                  />

                  {/* Central Text for inactive state */}
                  <div className="video-overlay absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                    <span className="font-heading font-bold text-4xl tracking-widest text-white/60">VIDEO</span>
                  </div>
                </div>

                {/* Details under the video (Active only) */}
                <div 
                  ref={(el) => { textRefs.current[index] = el; }}
                  className="video-text absolute -bottom-16 left-0 transition-all duration-500 ease-out"
                >
                  <div className="text-white font-heading font-black text-3xl md:text-4xl tracking-tight">
                    {item.title}
                  </div>
                  <div className="text-primary font-medium text-sm md:text-base tracking-widest uppercase mt-1">
                    {item.subtitle}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Right Side: Content Column */}
        <div className="relative w-full md:w-[45%] h-full flex flex-col justify-start pt-12 md:pt-16 px-6 md:px-12 lg:pr-24 z-20 pb-20 md:pb-0 pointer-events-none md:pointer-events-auto mt-[40vh] md:mt-0">
          
          {/* Big Solid Title */}
          <h2
            className="font-heading font-black text-[5rem] md:text-[6rem] lg:text-[8rem] leading-none tracking-tighter mb-6 text-white drop-shadow-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Video
          </h2>

          {/* Description Box — occupa tutto lo spazio rimanente fino al fondo */}
          <div className="flex-1 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-4" style={{ backgroundColor: '#000' }}>

            <h3 className="font-bold tracking-wide" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#e9ac06', lineHeight: 1.1 }}>
              SERVIZI SU MISURA
            </h3>

            {/* Pills */}
            <div className="flex flex-wrap gap-3">
              {VIDEO_PILLS.map((pill) => (
                <div
                  key={pill}
                  className="px-4 py-2.5 rounded-xl border cursor-pointer pointer-events-auto"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.08)' }}
                >
                  <span className="text-xs md:text-sm font-medium tracking-widest" style={{ color: '#fff' }}>
                    {pill}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.2vw, 1.3rem)', color: '#fff' }}>
              {VIDEO_DESCRIPTION.map((text, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
