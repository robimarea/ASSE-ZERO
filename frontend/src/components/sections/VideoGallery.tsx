import { useRef, useState, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { VIDEO_PILLS, VIDEO_DESCRIPTION } from '@/data/services';
import { VIDEO_ITEMS } from '@/data/videos';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollCards } from '@/hooks/useScrollCards';
import { VideoLightbox } from '@/components/ui/VideoLightbox';
import { SectionHeroTitle } from '@/components/ui/SectionHeroTitle';

interface VideoGalleryProps {
  isVisible?: boolean;
}

function PlayIcon() {
  return <svg className="w-6 h-6 text-white fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
}

function formatIndex(n: number) {
  return String(n + 1).padStart(2, '0');
}

export function VideoGallery({ isVisible = true }: VideoGalleryProps) {
  const isMobile = useIsMobile();
  const containerRef     = useRef<HTMLElement>(null);
  const mobileCounterRef = useRef<HTMLSpanElement>(null);
  const mobileProgressRef = useRef<HTMLDivElement>(null);
  const paragraphRef     = useRef<HTMLDivElement>(null);
  const panelRef         = useRef<HTMLDivElement>(null);
  const pillsWrapRef     = useRef<HTMLDivElement>(null);
  const playBtnRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const prevActiveRef    = useRef(-1);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [lightboxOrigin, setLightboxOrigin] = useState<DOMRect | null>(null);
  const [counterFlash, setCounterFlash] = useState(false);

  const openExpanded = useCallback((index: number, originEl?: HTMLElement | null) => {
    setLightboxOrigin(originEl?.getBoundingClientRect() ?? null);
    setExpandedIndex(index);
  }, []);
  const closeExpanded = useCallback(() => {
    setExpandedIndex(null);
    setLightboxOrigin(null);
  }, []);

  const {
    cardRefs,
    overlayRefs,
    textRefs,
    gradientRefs,
    numberRefs,
    activeIndex,
    goNext,
    goPrev,
    canGoPrev,
    canGoNext,
  } = useScrollCards({
    containerRef,
    count: VIDEO_ITEMS.length,
    isVisible: isVisible && !isMobile,
    paragraphRef,
    scrollDriven: false,
  });



  useEffect(() => {
    if (prevActiveRef.current === activeIndex) return;
    prevActiveRef.current = activeIndex;
    setCounterFlash(true);
    const t = window.setTimeout(() => setCounterFlash(false), 450);

    const playEl = playBtnRefs.current[activeIndex];
    if (playEl) {
      playEl.classList.remove('vg-play-pulse');
      void playEl.offsetWidth;
      playEl.classList.add('vg-play-pulse');
    }
    return () => window.clearTimeout(t);
  }, [activeIndex]);

  useEffect(() => {
    if (isMobile) return;
    const panel = panelRef.current;
    const pills = pillsWrapRef.current;
    if (!panel || !pills) return;

    const pillEls = pills.querySelectorAll('[data-vg-pill]');

    const ctx = gsap.context(() => {
      gsap.killTweensOf(pillEls);
      if (isVisible) {
        gsap.fromTo(
          pillEls,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.2 },
        );
      } else {
        gsap.to(pillEls, { opacity: 0, y: -12, duration: 0.35, stagger: 0.03, ease: 'power2.in' });
      }
    }, panel);

    return () => ctx.revert();
  }, [isVisible, isMobile]);

  if (isMobile) {
    const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const { scrollLeft, clientWidth, scrollWidth } = el;
      const step = clientWidth * 0.86 + 10;
      const idx = Math.min(Math.round(scrollLeft / step), VIDEO_ITEMS.length - 1);

      if (mobileCounterRef.current) {
        mobileCounterRef.current.textContent = formatIndex(idx);
        mobileCounterRef.current.classList.remove('counter-flash');
        void mobileCounterRef.current.offsetWidth;
        mobileCounterRef.current.classList.add('counter-flash');
      }

      if (mobileProgressRef.current && scrollWidth > clientWidth) {
        const max = scrollWidth - clientWidth;
        mobileProgressRef.current.style.transform = `scaleX(${max > 0 ? scrollLeft / max : 0})`;
      }

      el.querySelectorAll<HTMLElement>('[data-mobile-card]').forEach((card, i) => {
        const dist = Math.abs(i - idx);
        const scale = i === idx ? 1 : clampMobileScale(dist);
        const opacity = i === idx ? 1 : 0.58;
        card.style.transform = `scale(${scale})`;
        card.style.opacity = `${opacity}`;
      });
    };

    return (
      <section className="relative w-full bg-dark h-screen flex flex-col overflow-hidden">
        {expandedIndex !== null && (
          <VideoLightbox
            item={VIDEO_ITEMS[expandedIndex]}
            itemIndex={expandedIndex}
            onClose={closeExpanded}
            originRect={lightboxOrigin}
          />
        )}

        <div className="px-5 pt-10 pb-4 flex items-end justify-between shrink-0">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Portfolio Video
            </p>
            <SectionHeroTitle
              text="Video"
              variant="video"
              isVisible={isVisible}
              className="sht-size-video sht--align-start"
            />
          </div>
          <div className="pb-1 text-right">
            <span
              ref={mobileCounterRef}
              className="font-black block leading-none counter-flash"
              style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '2.5rem', color: 'rgba(255,255,255,0.1)' }}
            >
              01
            </span>
            <span className="text-[11px] font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>
              / {String(VIDEO_ITEMS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div
          className="overflow-x-auto scrollbar-hidden snap-x snap-mandatory flex gap-[10px] shrink-0"
          style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
          onScroll={handleCarouselScroll}
        >
          {VIDEO_ITEMS.map((item, index) => (
            <div key={item.id} className="snap-center shrink-0 w-[86vw]">
              <div
                data-mobile-card
                className="overflow-hidden relative cursor-pointer transition-[transform,opacity] duration-300 ease-out"
                style={{
                  aspectRatio: '16/9',
                  background: item.gradient,
                  borderRadius: '1.25rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                  transform: index === 0 ? 'scale(1)' : 'scale(0.94)',
                  opacity: index === 0 ? 1 : 0.58,
                }}
                onClick={(e) => openExpanded(index, e.currentTarget)}
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
                <span className="absolute top-2 right-3 font-black select-none pointer-events-none" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '5rem', lineHeight: 1, color: 'rgba(255,255,255,0.05)' }}>
                  {formatIndex(index)}
                </span>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center z-10 pointer-events-none" style={{ backgroundColor: '#a90f21', boxShadow: '0 8px 24px rgba(169,15,33,0.5)' }}>
                  <PlayIcon />
                </div>
                <div className="absolute bottom-5 left-4 pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] block mb-1" style={{ color: '#a90f21' }}>{item.subtitle}</span>
                  <h3 className="text-white font-black leading-none tracking-tighter italic" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '1.3rem' }}>{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-5 mt-3 mb-2 shrink-0 h-px overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            ref={mobileProgressRef}
            className="h-full origin-left rounded-full"
            style={{ transform: 'scaleX(0)', background: 'linear-gradient(90deg, #a90f21, #ebdb00)', transition: 'transform 0.12s linear' }}
          />
        </div>

        <div className="flex flex-wrap gap-2 px-5 shrink-0 justify-center">
          {VIDEO_PILLS.map((pill, i) => (
            <span
              key={pill}
              className="shrink-0 flex items-center gap-2 border border-white/[0.07] border-l-2 border-l-[#a90f21]"
              style={{
                padding: '7px 12px',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.04)',
                whiteSpace: 'nowrap',
              }}
            >
              <span className="text-[8px] font-black tabular-nums text-[#a90f21]">{formatIndex(i)}</span>
              <span className="w-px h-2.5 shrink-0 bg-white/10" />
              <span className="text-[10px] font-black tracking-[0.16em] uppercase text-white/55">{pill}</span>
            </span>
          ))}
        </div>

        <div className="px-5 mt-4 pb-8 flex-1 overflow-hidden">
          <div className="text-sm leading-relaxed space-y-2" style={{ color: 'rgba(237,242,244,0.6)', fontFamily: "'Satoshi', sans-serif" }}>
            {VIDEO_DESCRIPTION.map((text, idx) => <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative w-full bg-dark z-0 h-screen">
      {expandedIndex !== null && (
        <VideoLightbox
          item={VIDEO_ITEMS[expandedIndex]}
          itemIndex={expandedIndex}
          onClose={closeExpanded}
          originRect={lightboxOrigin}
        />
      )}

      <div
        className="absolute pointer-events-none rounded-full blur-[90px] transition-[left,opacity] duration-500 ease-out"
        style={{
          width: 'min(42vw, 520px)',
          height: 'min(42vw, 520px)',
          left: activeIndex === 0 ? '8%' : activeIndex === VIDEO_ITEMS.length - 1 ? '28%' : '18%',
          top: '42%',
          transform: 'translateY(-50%)',
          background: VIDEO_ITEMS[activeIndex]?.gradient ?? 'transparent',
          opacity: 0.14,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div
        data-carousel-scroll
        className="w-full h-full overflow-hidden bg-dark flex flex-col md:flex-row items-center justify-center relative z-[1] pointer-events-auto"
        title="Scorri per cambiare video"
      >

        <div
          data-vg-cards
          className="relative w-full md:w-[50%] h-full flex items-center justify-center shrink-0 pointer-events-auto"
          title="Scorri per cambiare video"
        >
          {VIDEO_ITEMS.map((item, index) => (
            <article
              key={item.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="absolute w-[80vw] md:w-[32vw] aspect-video origin-center will-change-transform"
              style={{ opacity: 0, transform: 'translate3d(0, 100vh, 0)' }}
            >
              <div
                className="w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative bg-black pointer-events-auto cursor-pointer group hover:border-[#a90f21]/25 transition-colors duration-500"
                onClick={(e) => openExpanded(index, e.currentTarget)}
              >
                <span
                  ref={(el) => { numberRefs.current[index] = el; }}
                  className="absolute top-3 right-5 font-black select-none pointer-events-none z-[2] transition-[opacity,transform] duration-150"
                  style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(4rem, 10vw, 7rem)', lineHeight: 1, color: 'rgba(255,255,255,0.08)' }}
                  aria-hidden="true"
                >
                  {formatIndex(index)}
                </span>

                <div
                  ref={(el) => { gradientRefs.current[index] = el; }}
                  data-card-gradient
                  className="w-full h-full opacity-80 vg-card-gradient"
                  style={{ background: item.gradient }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />
                <div
                  ref={(el) => { overlayRefs.current[index] = el; }}
                  className="absolute inset-0 vg-card-overlay pointer-events-none"
                  aria-hidden="true"
                  style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.85) 10px, rgba(0,0,0,0.85) 20px)', backgroundColor: 'rgba(0,0,0,0.55)' }}
                />
                <div
                  ref={(el) => { playBtnRefs.current[index] = el; }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(169,15,33,0.45)] group-hover:shadow-[0_20px_50px_rgba(169,15,33,0.65)] group-hover:scale-110 transition-[box-shadow,transform] duration-500 z-10 pointer-events-none"
                  style={{ backgroundColor: '#a90f21' }}
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <div
                  ref={(el) => { textRefs.current[index] = el; }}
                  className="absolute bottom-6 left-6 transition-all duration-500 ease-out pointer-events-none"
                  style={{ opacity: 0, transform: 'translate3d(0,20px,0)' }}
                >
                  <span className="text-xs font-black uppercase tracking-[0.35em] block mb-1" style={{ color: '#a90f21' }}>{item.subtitle}</span>
                  <h3 className="text-white font-black tracking-tighter italic leading-none" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}>
                    {item.title}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="relative w-full md:w-[50%] h-full flex flex-col justify-center items-center px-6 md:px-10 lg:px-12 z-20 py-8 pointer-events-none md:pointer-events-auto mt-[40vh] md:mt-0">
          <div ref={panelRef} className="rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center gap-6 w-full" style={{ backgroundColor: '#2b2d42' }}>
            <SectionHeroTitle
              text="Video"
              variant="video"
              isVisible={isVisible}
              className="sht-size-video"
            />

            <div className="flex items-center justify-center gap-3 -mt-2 w-full relative z-30">
              <button
                type="button"
                onClick={(e) => { if (!canGoPrev) return; e.stopPropagation(); goPrev(); }}
                disabled={!canGoPrev}
                aria-label="Video precedente"
                className="vg-nav-btn cursor-target"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-baseline gap-2 min-w-[5.5rem] justify-center">
                <span
                  className={`font-black leading-none tabular-nums transition-colors duration-300 ${counterFlash ? 'counter-flash' : ''}`}
                  style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#ebdb00' }}
                >
                  {formatIndex(activeIndex)}
                </span>
                <span className="text-sm font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  / {formatIndex(VIDEO_ITEMS.length - 1)}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => { if (!canGoNext) return; e.stopPropagation(); goNext(); }}
                disabled={!canGoNext}
                aria-label="Video successivo"
                className="vg-nav-btn cursor-target"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div ref={pillsWrapRef} className="flex flex-wrap justify-center gap-2 md:gap-2.5 vg-pills-static">
              {VIDEO_PILLS.map((pill, i) => (
                <div
                  key={pill}
                  data-vg-pill
                  className="group relative overflow-hidden cursor-default border border-white/[0.07] border-l-2 border-l-[#a90f21] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(169,15,33,0.3)]"
                  style={{ padding: '9px 16px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)' }}
                >
                  <span className="absolute inset-0 bg-[#a90f21] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2.5">
                    <span className="text-[9px] font-black tabular-nums text-[#a90f21] group-hover:text-white/50 transition-colors duration-200">{formatIndex(i)}</span>
                    <span className="w-px h-3 shrink-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-200" />
                    <span className="text-[11px] font-black tracking-[0.16em] uppercase text-white/55 group-hover:text-white transition-colors duration-200">{pill}</span>
                  </span>
                </div>
              ))}
            </div>

            <div ref={paragraphRef} className="flex flex-col leading-snug text-center w-full" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.4rem)', color: '#edf2f4' }}>
              {VIDEO_DESCRIPTION.map((text, idx) => (
                <p
                  key={idx}
                  dangerouslySetInnerHTML={{
                    __html: text.replace(
                      /<strong>/g,
                      `<strong style="color:${idx === activeIndex ? '#ebdb00' : 'inherit'};transition:color 0.35s ease">`
                    ),
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function clampMobileScale(dist: number) {
  if (dist >= 2) return 0.9;
  if (dist === 1) return 0.94;
  return 0.97;
}
