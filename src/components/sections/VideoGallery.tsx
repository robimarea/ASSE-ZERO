// ============================================
// ASSE ZERO — Video Gallery Section
// Vertical staggered scroll slider for video portfolio
// Zero React re-renders pattern
// ============================================

import { useRef, useEffect } from 'react';

const VIDEO_ITEMS = [
  { id: 1, title: 'SPOT PUBBLICITARI', subtitle: 'Commercials & Ads', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1600&auto=format&fit=crop' },
  { id: 2, title: 'VIDEOCLIP', subtitle: 'Music Videos', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop' },
  { id: 3, title: 'DOCUMENTARI', subtitle: 'Documentary Films', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1600&auto=format&fit=crop' },
  { id: 4, title: 'RECAP EVENTI', subtitle: 'Event Coverage', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1600&auto=format&fit=crop' },
  { id: 5, title: 'MOTION GRAPHICS', subtitle: '2D/3D Animation', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop' },
];

const VIDEO_PILLS = ['Spot Pubblicitari', 'Videoclip', 'Cortometraggi', 'Recap Eventi', 'Video Corporate', 'Documentari', 'Content Social', 'Motion Graphics', 'Interviste'];

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
          
          {/* Section Marker (Background of Left Column) */}
          <div className="absolute top-10 left-10 z-0 text-white/5 font-heading font-black text-[10vw] leading-none tracking-tighter pointer-events-none hidden md:block">
            03
          </div>

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
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  
                  {/* Diagonal Hatch Overlay for inactive items */}
                  <div 
                    ref={(el) => { overlayRefs.current[index] = el; }}
                    className="video-overlay absolute inset-0 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.8) 10px, rgba(0,0,0,0.8) 20px), rgba(0,0,0,0.4)',
                      backdropFilter: 'grayscale(100%) brightness(0.6)',
                    }}
                  />
                  
                  {/* Central Text for inactive state */}
                  <div className="video-overlay absolute inset-0 flex items-center justify-center transition-opacity duration-500 pointer-events-none">
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
        <div className="relative w-full md:w-[45%] h-full flex flex-col justify-center px-6 md:px-12 lg:pr-24 z-20 pb-20 md:pb-0 pointer-events-none md:pointer-events-auto mt-[40vh] md:mt-0">
          
          {/* Big Solid Title */}
          <h2 
            className="font-heading font-black text-[5rem] md:text-[6rem] lg:text-[8rem] leading-none tracking-tighter mb-6 text-white drop-shadow-2xl"
          >
            Video
          </h2>

          {/* Description Box */}
          <div className="border border-primary/40 rounded-2xl p-6 md:p-8 bg-black/40 backdrop-blur-md shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50" />
            
            <h3 className="text-primary font-heading font-bold text-xl md:text-2xl mb-2 tracking-wide">
              SERVIZI SU MISURA
            </h3>
            
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Crediamo che ogni brand abbia una storia unica da raccontare. Per questo non offriamo pacchetti standardizzati: ogni produzione video viene quotata solo in seguito a un'attenta analisi delle tue esigenze, obiettivi e target, garantendoti un prodotto altamente personalizzato.
            </p>
          </div>

          {/* Floating Keyword Pills */}
          <div className="flex flex-wrap gap-3">
            {VIDEO_PILLS.map((pill) => (
              <div
                key={pill}
                className="group relative px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(191,51,32,0.25)] hover:bg-primary/20 hover:border-primary/40 cursor-pointer pointer-events-auto overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-xs md:text-sm font-medium text-white/70 group-hover:text-white tracking-widest transition-colors duration-300">
                  {pill}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
