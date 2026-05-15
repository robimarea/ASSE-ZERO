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
const PILL_TO_VIDEO: number[] = [0, 1, 2, 3, 4];

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
  const pillRefs = useRef<(HTMLElement | null)[]>([]);
  const paragraphRef = useRef<HTMLDivElement>(null);
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

      // Update pill scale based on distance from corresponding video
      pillRefs.current.forEach((el, pillIdx) => {
        if (!el) return;
        const videoIdx = PILL_TO_VIDEO[pillIdx];
        if (videoIdx === -1) return; // Cortometraggi: no video, stays neutral

        const distance = Math.abs(videoIdx - travel);
        // Active when distance < 0.5, fades from 1.25 → 1.0 as distance goes 0 → 1
        const activity = clamp(1 - distance, 0, 1);
        const scale = 1 + activity * 0.35; // 1.0 → 1.35

        el.style.transform = `scale(${scale})`;
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
    <section ref={containerRef} className="relative w-full bg-dark z-0" style={{ height: '500vh' }}>

      <div className="sticky top-0 z-10 w-full h-screen overflow-hidden bg-dark flex flex-col md:flex-row items-center justify-center">

        {/* Left Side: Video Slider Column */}
        <div className="relative w-full md:w-[50%] h-full flex items-center justify-center shrink-0">

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
        <div className="relative w-full md:w-[50%] h-full flex flex-col justify-center px-6 md:px-10 lg:pr-20 z-20 py-8 pointer-events-none md:pointer-events-auto mt-[40vh] md:mt-0">

          {/* Description Box */}
          <div className="rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-visible flex flex-col justify-center gap-2" style={{ backgroundColor: '#000' }}>

          {/* Big Solid Title */}
          <h2
            className="font-heading font-black text-[5rem] md:text-[7rem] lg:text-[9rem] leading-none tracking-tighter mb-3 drop-shadow-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#e9ac06' }}
          >
            Video
          </h2>

            {/* Pills — row 1: first 3, row 2: last 2 */}
            <div className="flex flex-col gap-4" style={{ overflow: 'visible', marginLeft: '-0.5rem' }}>
              {/* Row 1 */}
              <div className="flex flex-nowrap gap-14" style={{ overflow: 'visible', paddingBlock: '8px' }}>
                {VIDEO_PILLS.slice(0, 3).map((pill, pillIdx) => (
                  <div
                    key={pill}
                    ref={(el) => { pillRefs.current[pillIdx] = el; }}
                    className="shrink-0 px-2 py-1 cursor-pointer pointer-events-auto origin-center"
                    style={{ transition: 'transform 0.3s ease' }}
                  >
                    <span className="text-base md:text-lg font-bold tracking-widest" style={{ color: '#e9ac06' }}>
                      {pill}
                    </span>
                  </div>
                ))}
              </div>
              {/* Row 2 */}
              <div className="flex flex-nowrap gap-14" style={{ overflow: 'visible', paddingBlock: '8px' }}>
                {VIDEO_PILLS.slice(3).map((pill, i) => (
                  <div
                    key={pill}
                    ref={(el) => { pillRefs.current[3 + i] = el; }}
                    className="shrink-0 px-2 py-1 cursor-pointer pointer-events-auto origin-center"
                    style={{ transition: 'transform 0.3s ease' }}
                  >
                    <span className="text-base md:text-lg font-bold tracking-widest" style={{ color: '#e9ac06' }}>
                      {pill}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div ref={paragraphRef} className="flex flex-col leading-snug" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.6rem)', color: '#fff' }}>
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
