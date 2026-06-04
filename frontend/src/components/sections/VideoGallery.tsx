import { useRef, useState, useCallback } from 'react';
import { VIDEO_PILLS, VIDEO_DESCRIPTION } from '@/data/services';
import { VIDEO_ITEMS } from '@/data/videos';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollCards } from '@/hooks/useScrollCards';
import { VideoLightbox } from '@/components/ui/VideoLightbox';

interface VideoGalleryProps {
  isVisible?: boolean;
}

function PlayIcon() {
  return <svg className="w-6 h-6 text-white fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>;
}

export function VideoGallery({ isVisible = true }: VideoGalleryProps) {
  const isMobile = useIsMobile();
  const containerRef   = useRef<HTMLElement>(null);
  const mobileCounterRef = useRef<HTMLSpanElement>(null);
  const paragraphRef   = useRef<HTMLDivElement>(null);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const openExpanded  = useCallback((i: number) => setExpandedIndex(i), []);
  const closeExpanded = useCallback(() => setExpandedIndex(null), []);

  const { cardRefs, overlayRefs, textRefs } = useScrollCards({
    containerRef,
    count: VIDEO_ITEMS.length,
    isVisible,
    paragraphRef,
  });

  if (isMobile) {
    const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (!mobileCounterRef.current) return;
      const { scrollLeft, clientWidth } = e.currentTarget;
      const idx = Math.min(Math.round(scrollLeft / (clientWidth * 0.86 + 10)), VIDEO_ITEMS.length - 1);
      mobileCounterRef.current.textContent = String(idx + 1).padStart(2, '0');
    };

    return (
      <section className="relative w-full bg-dark h-screen flex flex-col overflow-hidden">
        {expandedIndex !== null && <VideoLightbox item={VIDEO_ITEMS[expandedIndex]} itemIndex={expandedIndex} onClose={closeExpanded} />}

        <div className="px-5 pt-10 pb-4 flex items-end justify-between shrink-0">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Portfolio Video
            </p>
            <h2 className="font-black leading-[0.88] tracking-tighter" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '3.5rem', color: '#ebdb00' }}>
              Video.
            </h2>
          </div>
          <div className="pb-1 text-right">
            <span ref={mobileCounterRef} className="font-black block leading-none" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '2.5rem', color: 'rgba(255,255,255,0.1)' }}>
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
                className="overflow-hidden relative cursor-pointer"
                style={{ aspectRatio: '16/9', background: item.gradient, borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}
                onClick={() => openExpanded(index)}
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/35" />
                <span className="absolute top-2 right-3 font-black select-none pointer-events-none" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '5rem', lineHeight: 1, color: 'rgba(255,255,255,0.05)' }}>
                  {String(index + 1).padStart(2, '0')}
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

        <div className="mx-5 mt-5 mb-4 shrink-0" style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

        <div className="overflow-x-auto scrollbar-hidden flex gap-2 px-5 shrink-0" style={{ touchAction: 'pan-x' }}>
          {VIDEO_PILLS.map((pill, i) => (
            <span key={pill} className="shrink-0 flex items-center gap-2 border border-white/[0.07] border-l-2 border-l-[#a90f21]" style={{ padding: '7px 12px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}>
              <span className="text-[8px] font-black tabular-nums" style={{ color: '#a90f21' }}>{String(i + 1).padStart(2, '0')}</span>
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
      {expandedIndex !== null && <VideoLightbox item={VIDEO_ITEMS[expandedIndex]} itemIndex={expandedIndex} onClose={closeExpanded} />}

      <div className="w-full h-full overflow-hidden bg-dark flex flex-col md:flex-row items-center justify-center">

        <div className="relative w-full md:w-[50%] h-full flex items-center justify-center pointer-events-none shrink-0">
          {VIDEO_ITEMS.map((item, index) => (
            <article
              key={item.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="absolute w-[80vw] md:w-[32vw] aspect-video origin-center will-change-transform"
              style={{ opacity: 0, transform: 'translate3d(0, 100vh, 0)' }}
            >
              <div
                className="w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] relative bg-black pointer-events-auto cursor-pointer group hover:border-[#a90f21]/25 transition-colors duration-500"
                onClick={() => openExpanded(index)}
              >
                <div className="w-full h-full opacity-80" style={{ background: item.gradient }} aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />
                <div
                  ref={(el) => { overlayRefs.current[index] = el; }}
                  className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                  aria-hidden="true"
                  style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.85) 10px, rgba(0,0,0,0.85) 20px)', backgroundColor: 'rgba(0,0,0,0.55)' }}
                />
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(169,15,33,0.45)] group-hover:shadow-[0_20px_50px_rgba(169,15,33,0.65)] group-hover:scale-110 transition-all duration-500 z-10 pointer-events-none"
                  style={{ backgroundColor: '#a90f21' }}
                >
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  <div className="absolute inset-0 rounded-full border border-[#a90f21]/40 animate-ping" style={{ animationDuration: '2.5s' }} />
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
          <div className="rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center gap-6 w-full" style={{ backgroundColor: '#2b2d42' }}>
            <h2 className="font-heading font-black text-[5rem] md:text-[7rem] lg:text-[9rem] leading-none tracking-tighter drop-shadow-2xl text-center w-full" style={{ fontFamily: "'Nohemi', sans-serif", color: '#ebdb00' }}>
              Video
            </h2>

            <div className="flex flex-wrap justify-center gap-2 md:gap-2.5 mt-6">
              {VIDEO_PILLS.map((pill, i) => (
                <div key={pill} className="group relative overflow-hidden cursor-default border border-white/[0.07] border-l-2 border-l-[#a90f21] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(169,15,33,0.3)]" style={{ padding: '9px 16px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)' }}>
                  <span className="absolute inset-0 bg-[#a90f21] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2.5">
                    <span className="text-[9px] font-black tabular-nums text-[#a90f21] group-hover:text-white/50 transition-colors duration-200">{String(i + 1).padStart(2, '0')}</span>
                    <span className="w-px h-3 shrink-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-200" />
                    <span className="text-[11px] font-black tracking-[0.16em] uppercase text-white/55 group-hover:text-white transition-colors duration-200">{pill}</span>
                  </span>
                </div>
              ))}
            </div>

            <div ref={paragraphRef} className="flex flex-col leading-snug text-center w-full" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.4rem)', color: '#edf2f4' }}>
              {VIDEO_DESCRIPTION.map((text, idx) => <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />)}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
