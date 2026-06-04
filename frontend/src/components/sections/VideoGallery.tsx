// ============================================
// ASSE ZERO — Video Gallery Section
// Vertical staggered scroll slider for video portfolio
// Zero React re-renders pattern
// ============================================

import { useRef, useEffect } from 'react';
import { VIDEO_PILLS, VIDEO_DESCRIPTION } from '@/data/services';
import { useIsMobile } from '@/hooks/useIsMobile';


const VIDEO_ITEMS = [
  {
    id: 1, title: 'SPOT PUBBLICITARI', subtitle: 'Commercials & Ads',
    gradient: 'linear-gradient(135deg, #a90f21 0%, #2a0008 60%, #2b2d42 100%)',
  },
  {
    id: 2, title: 'VIDEOCLIP', subtitle: 'Music Videos',
    gradient: 'linear-gradient(135deg, #6b0f1a 0%, #1a060a 60%, #2b2d42 100%)',
  },
  {
    id: 3, title: 'DOCUMENTARI', subtitle: 'Documentary Films',
    gradient: 'linear-gradient(135deg, #ebdb00 0%, #3a2800 60%, #2b2d42 100%)',
  },
  {
    id: 4, title: 'RECAP EVENTI', subtitle: 'Event Coverage',
    gradient: 'linear-gradient(135deg, #c4b800 0%, #2a2000 60%, #2b2d42 100%)',
  },
  {
    id: 5, title: 'MOTION GRAPHICS', subtitle: '2D/3D Animation',
    gradient: 'linear-gradient(135deg, #a90f21 0%, #1a0308 60%, #2b2d42 100%)',
  },
];



function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

interface VideoGalleryProps {
  isVisible?: boolean;
}

export function VideoGallery({ isVisible = true }: VideoGalleryProps) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const mobileCounterRef = useRef<HTMLSpanElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);

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

  // ── Mobile: carosello cinematografico ──────────────────────────────────
  // min-h-screen garantisce che il MaskChange abbia il giusto spazio (wrapper = 2×100vh)
  if (isMobile) {
    const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (!mobileCounterRef.current) return;
      const { scrollLeft, clientWidth } = e.currentTarget;
      const cardWidth = clientWidth * 0.86 + 10;
      const idx = Math.min(Math.round(scrollLeft / cardWidth), VIDEO_ITEMS.length - 1);
      mobileCounterRef.current.textContent = String(idx + 1).padStart(2, '0');
    };

    return (
      <section className="relative w-full bg-dark min-h-screen flex flex-col justify-center">

        {/* ── Header editoriale ── */}
        <div className="px-5 pt-12 mb-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] mb-2"
              style={{ color: 'rgba(255,255,255,0.25)' }}>
              Portfolio Video
            </p>
            <h2
              className="font-black leading-[0.88] tracking-tighter"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '4.5rem', color: '#ebdb00' }}
            >
              Video.
            </h2>
          </div>
          <div className="pb-1 text-right">
            <span
              ref={mobileCounterRef}
              className="font-black block leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}
            >
              01
            </span>
            <span className="text-[11px] font-black tracking-widest"
              style={{ color: 'rgba(255,255,255,0.18)' }}>
              / {String(VIDEO_ITEMS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ── Carosello snap ── */}
        <div
          className="overflow-x-auto scrollbar-hidden snap-x snap-mandatory flex gap-[10px] pb-5"
          style={{
            touchAction: 'pan-x',
            overscrollBehaviorX: 'contain',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
          }}
          onScroll={handleCarouselScroll}
        >
          {VIDEO_ITEMS.map((item, index) => (
            <div key={item.id} className="snap-center shrink-0 w-[86vw]">
              <div
                className="overflow-hidden relative"
                style={{
                  aspectRatio: '4/3',
                  background: item.gradient,
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {/* Gradiente cinematic dal basso */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.1) 100%)' }}
                />

                {/* Numero watermark */}
                <span
                  className="absolute top-2 right-3 font-black select-none pointer-events-none"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '7rem',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.05)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Categoria — top left, no badge, solo testo */}
                <p
                  className="absolute top-4 left-4 font-black uppercase"
                  style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.38)' }}
                >
                  {item.subtitle}
                </p>

                {/* Blocco titolo — bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                  {/* Accent bar full-width sfumata */}
                  <div
                    className="w-full h-[1.5px] mb-3"
                    style={{ background: 'linear-gradient(90deg, #a90f21 0%, rgba(169,15,33,0.12) 100%)' }}
                  />
                  <h3
                    className="text-white font-black leading-none tracking-tight"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.35rem, 5.5vw, 1.7rem)' }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Separatore ── */}
        <div className="mx-5 mb-5" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* ── Pills orizzontali (single row scroll) ── */}
        <div
          className="overflow-x-auto scrollbar-hidden flex gap-2 px-5 pb-1"
          style={{ touchAction: 'pan-x' }}
        >
          {VIDEO_PILLS.map((pill) => (
            <span
              key={pill}
              className="shrink-0 flex items-center gap-1.5 px-3 py-[7px] text-[9px] font-black tracking-[0.18em] uppercase"
              style={{
                color: '#f87171',
                background: 'rgba(169,15,33,0.1)',
                border: '1px solid rgba(169,15,33,0.28)',
                borderRadius: '4px',
              }}
            >
              <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ backgroundColor: '#a90f21' }} />
              {pill}
            </span>
          ))}
        </div>

        {/* ── Descrizione ── */}
        <div className="px-5 mt-5 pb-12">
          <div
            className="text-sm leading-relaxed space-y-2"
            style={{ color: 'rgba(237,242,244,0.65)' }}
          >
            {VIDEO_DESCRIPTION.map((text, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />
            ))}
          </div>
        </div>

      </section>
    );
  }

  // ── Desktop: animazione scroll-driven originale ─────────────────────────
  return (
    <section ref={containerRef} className="relative w-full bg-dark z-0 h-screen">

      <div className="w-full h-full overflow-hidden bg-dark flex flex-col md:flex-row items-center justify-center">

        {/* Left Side: Video Slider Column (Scrollable internally) */}
        <div 
          ref={scrollContainerRef}
          className="relative w-full md:w-[50%] h-full overflow-y-auto shrink-0 scrollbar-hidden"
        >

          
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
                        background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.85) 10px, rgba(0,0,0,0.85) 20px)',
                        backgroundColor: 'rgba(0,0,0,0.55)',
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
          <div className="rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-visible flex flex-col justify-center gap-6" style={{ backgroundColor: '#2b2d42' }}>

          {/* Big Solid Title */}
          <h2
            className="font-heading font-black text-[5rem] md:text-[7rem] lg:text-[9rem] leading-none tracking-tighter mb-1 drop-shadow-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#ebdb00' }}
          >
            Video
          </h2>

            {/* Static Service Tags (Completely disconnected from video frames) */}
            {/* Service Tags — modern glass style with dynamic hover */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-6">
              {VIDEO_PILLS.map((pill) => (
                <div key={pill} className="group relative">
                  <div className="flex items-center gap-2 px-5 py-2 rounded-full backdrop-blur-md hover:-translate-y-0.5 transition-all duration-300 ease-out"
                    style={{ background: 'rgba(169,15,33,0.12)', border: '1px solid rgba(169,15,33,0.4)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#a90f21', opacity: 0.95 }} />
                    <span className="text-xs md:text-sm font-semibold tracking-wider uppercase" style={{ color: '#f87171' }}>
                      {pill}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div ref={paragraphRef} className="flex flex-col leading-snug" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.4rem)', color: '#edf2f4' }}>
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

