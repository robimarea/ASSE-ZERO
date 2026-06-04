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
    gradient: 'linear-gradient(135deg, #e9ac06 0%, #4a3200 60%, #000 100%)',
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

// Maps pillIndex → videoIndex (1:1, same order as VIDEO_ITEMS)
// VIDEO_PILLS: ['Spot Pubblicitari', 'Videoclip', 'Documentari', 'Recap Eventi', 'Motion Graphics']
// VIDEO_ITEMS:  [SPOT(0),            VIDEOCLIP(1), DOCUMENTARI(2), RECAP EVENTI(3), MOTION GRAPHICS(4)]
// const PILL_TO_VIDEO: number[] = [0, 1, 2, 3, 4];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

interface VideoGalleryProps {
  isVisible?: boolean;
}

export function VideoGallery({ isVisible = true }: VideoGalleryProps) {
  const containerRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  // const pillRefs = useRef<(HTMLElement | null)[]>([]);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    let frameId = 0;

    const syncProgress = () => {
      frameId = 0;
      if (!scrollContainerRef.current) return;

      const el = scrollContainerRef.current;
      const scrolled = el.scrollTop;
      const scrollableDistance = el.scrollHeight - el.clientHeight;
      const progress = clamp(scrolled / (scrollableDistance || 1), 0, 1);

      // Limita esattamente tra 0 e l'ultimo indice
      const travel = progress * (VIDEO_ITEMS.length - 1);
      const newActiveIndex = clamp(Math.round(travel), 0, VIDEO_ITEMS.length - 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const relative = index - travel;
        const distance = Math.abs(relative);

        if (distance > 3) {
          if (card.style.display !== 'none') card.style.display = 'none';
          return;
        }
        if (card.style.display !== 'block') card.style.display = 'block';

        const yOffset = relative * 45;
        const xOffset = 5 - (distance * distance * 1.44) * 6;
        const scale = clamp(1 - distance * 0.25, 0.5, 1);
        const rotateZ = relative * -4;
        const opacity = clamp(1.2 - distance * 0.4, 0, 1);
        const isActive = distance < 0.5;

        card.style.transform = `translate3d(${xOffset}vw, ${yOffset}vh, 0) scale(${scale}) rotateZ(${rotateZ}deg)`;
        card.style.opacity = `${opacity}`;
        card.style.zIndex = isActive ? '20' : `${10 - Math.floor(distance)}`;

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
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(syncProgress);
    };

    if (!isVisible) return;

    // Paragraph slide-up reveal on first visibility
    const paraEl = paragraphRef.current;
    if (paraEl) {
      paraEl.style.opacity = '0';
      paraEl.style.transform = 'translateY(48px)';
      paraEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            paraEl.style.opacity = '1';
            paraEl.style.transform = 'translateY(0)';
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(paraEl);
    }

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('resize', handleScroll);
    syncProgress();

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, [isVisible]);

  // Click on pill to scroll to corresponding video
  // const scrollToVideo = (videoIdx: number) => {
  //   if (!scrollContainerRef.current || videoIdx === -1) return;
  //   const el = scrollContainerRef.current;
  //   const scrollableDistance = el.scrollHeight - el.clientHeight;
  //   // Map the video index exactly to progress [0, 1]
  //   const targetProgress = videoIdx / (VIDEO_ITEMS.length - 1);
  //   const targetScroll = targetProgress * scrollableDistance;
  //   
  //   el.scrollTo({ top: targetScroll, behavior: 'smooth' });
  // };

  return (
    <section ref={containerRef} className="relative w-full bg-dark z-0 h-screen">

      <div className="w-full h-full overflow-hidden bg-dark flex flex-col md:flex-row items-center justify-center">

        {/* Left Side: Video Slider Column (Scrollable internally) */}
        <div 
          ref={scrollContainerRef}
          className="relative w-full md:w-[50%] h-full overflow-y-auto shrink-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hide scrollbar for webkit */}
          <style>{`
            ::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          {/* Sticky container for the cards MUST BE BEFORE the spacer */}
          <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none">
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
                  <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-2xl relative bg-black pointer-events-auto">
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
                    className="video-text absolute -bottom-16 left-0 transition-all duration-500 ease-out pointer-events-none"
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

          {/* Invisible spacer to create scrollable area. Must be placed AFTER the sticky container */}
          <div style={{ height: `${(VIDEO_ITEMS.length + 1) * 100}vh` }} />
        </div>

        {/* Right Side: Content Column */}
        <div className="relative w-full md:w-[50%] h-full flex flex-col justify-center px-6 md:px-10 lg:pr-20 z-20 py-8 pointer-events-none md:pointer-events-auto mt-[40vh] md:mt-0">

          {/* Description Box */}
          <div className="rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-visible flex flex-col justify-center gap-6" style={{ backgroundColor: '#000' }}>

          {/* Big Solid Title */}
          <h2
            className="font-heading font-black text-[5rem] md:text-[7rem] lg:text-[9rem] leading-none tracking-tighter mb-1 drop-shadow-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#e9ac06' }}
          >
            Video
          </h2>

            {/* Static Service Tags (Completely disconnected from video frames) */}
            {/* Service Tags — modern glass style with dynamic hover */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6">
              {VIDEO_PILLS.map((pill) => (
                <div key={pill} className="group relative">
                  <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-yellow-500/30 backdrop-blur-md hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300 ease-out">
                    {/* Subtle glow dot */}
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e9ac06', opacity: 0.8 }} />
                    <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-yellow-300">
                      {pill}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div ref={paragraphRef} className="flex flex-col leading-snug" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.4rem)', color: '#fff' }}>
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

