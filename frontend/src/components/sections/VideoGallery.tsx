// ============================================
// ASSE ZERO — Video Gallery
// Player principale sopra (preview muta, click →
// lightbox on-site) + bottone verso il post social.
// Sotto: barra orizzontale di thumbnail scorrevoli.
// Titolo/pill/descrizione vivono nella curtain VideoInfo.
// ============================================

import { useRef, useState, useCallback, useEffect } from 'react';
import { VIDEO_ITEMS } from '@/data/videos';
import { VideoLightbox } from '@/components/ui/VideoLightbox';

interface VideoGalleryProps {
  isVisible?: boolean;
}

function formatIndex(n: number) {
  return String(n + 1).padStart(2, '0');
}

export function VideoGallery({ isVisible = true }: VideoGalleryProps) {
  const playerRef    = useRef<HTMLDivElement>(null);
  const videoRef     = useRef<HTMLVideoElement>(null);
  const hasLoadedRef = useRef(false);

  const [shouldLoad, setShouldLoad]       = useState(false);
  const [activeIndex, setActiveIndex]     = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [lightboxOrigin, setLightboxOrigin] = useState<DOMRect | null>(null);

  const active = VIDEO_ITEMS[activeIndex];

  // Lazy-load: i video partono solo la prima volta che la sezione è visibile
  useEffect(() => {
    if (isVisible && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setShouldLoad(true);
    }
  }, [isVisible]);

  // Preview muta: play solo con sezione visibile e lightbox chiusa
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;
    if (isVisible && expandedIndex === null) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldLoad, isVisible, expandedIndex, activeIndex]);

  const openExpanded = useCallback(() => {
    setLightboxOrigin(playerRef.current?.getBoundingClientRect() ?? null);
    setExpandedIndex(activeIndex);
  }, [activeIndex]);

  const closeExpanded = useCallback(() => {
    setExpandedIndex(null);
    setLightboxOrigin(null);
  }, []);

  return (
    <section className="relative w-full bg-dark h-dvh flex flex-col items-center justify-center overflow-hidden z-0">
      {expandedIndex !== null && (
        <VideoLightbox
          item={VIDEO_ITEMS[expandedIndex]}
          itemIndex={expandedIndex}
          onClose={closeExpanded}
          originRect={lightboxOrigin}
        />
      )}

      {/* Glow ambientale del video attivo */}
      <div
        className="absolute pointer-events-none rounded-full blur-[90px] transition-opacity duration-500"
        style={{
          width: 'min(46vw, 560px)',
          height: 'min(46vw, 560px)',
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)',
          background: active.gradient,
          opacity: 0.16,
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="relative z-[1] w-[90vw] md:w-[64vw] lg:w-[56vw] flex flex-col pointer-events-auto">

        {/* ── Player principale (click → guardalo sul sito) ── */}
        <div
          ref={playerRef}
          onClick={openExpanded}
          className="relative w-full aspect-video rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] bg-black cursor-pointer cursor-target group hover:border-[#a90f21]/25 transition-colors duration-500"
        >
          <div className="absolute inset-0" style={{ background: active.gradient }} aria-hidden="true" />
          {/* key: al cambio video il tag si rimonta e riparte la preview */}
          <video
            key={active.id}
            ref={videoRef}
            src={shouldLoad ? active.src : undefined}
            muted
            loop
            playsInline
            preload="metadata"
            className="relative w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/30 pointer-events-none" />

          <span
            className="absolute top-3 right-5 font-heading font-black select-none pointer-events-none"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', lineHeight: 1, color: 'rgba(255,255,255,0.08)' }}
            aria-hidden="true"
          >
            {formatIndex(activeIndex)}
          </span>

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center z-10 pointer-events-none shadow-[0_15px_40px_rgba(169,15,33,0.45)] group-hover:shadow-[0_20px_50px_rgba(169,15,33,0.65)] group-hover:scale-110 transition-[box-shadow,transform] duration-500"
            style={{ backgroundColor: '#a90f21' }}
          >
            <svg className="w-5 h-5 md:w-8 md:h-8 text-white fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>

          <div className="absolute bottom-4 left-5 md:bottom-7 md:left-8 pointer-events-none">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] block mb-1" style={{ color: '#a90f21' }}>
              {active.subtitle}
            </span>
            <h3 className="text-white font-black tracking-tighter italic leading-none" style={{ fontSize: 'clamp(1.2rem, 2.4vw, 2rem)' }}>
              {active.title}
            </h3>
          </div>
        </div>

        {/* ── Sotto il player: contatore + link al post social ── */}
        <div className="flex items-center justify-between mt-3 md:mt-4">
          <div className="flex items-baseline gap-2">
            <span
              className="font-heading font-black leading-none tabular-nums"
              style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', color: 'var(--color-primary)' }}
            >
              {formatIndex(activeIndex)}
            </span>
            <span className="text-xs md:text-sm font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
              / {formatIndex(VIDEO_ITEMS.length - 1)}
            </span>
          </div>

          <a
            href={active.socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="cursor-target group/social inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2.5 md:px-5 transition-colors duration-300 hover:bg-[#a90f21] hover:border-[#a90f21]"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <span className="text-[10px] md:text-[11px] font-black tracking-[0.18em] uppercase text-white/70 group-hover/social:text-white transition-colors duration-200">
              Guarda su {active.socialLabel}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/50 group-hover/social:text-white transition-colors duration-200" aria-hidden="true">
              <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* ── Barra orizzontale: thumbnail scorrevoli ── */}
        <div
          className="mt-4 md:mt-5 flex gap-3 overflow-x-auto scrollbar-hidden snap-x pb-1"
          style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain' }}
        >
          {VIDEO_ITEMS.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Mostra ${item.title}`}
                aria-current={isActive}
                className={`cursor-target relative shrink-0 snap-start w-36 md:w-44 aspect-video rounded-xl overflow-hidden border transition-all duration-300 ${
                  isActive
                    ? 'border-[#a90f21] opacity-100'
                    : 'border-white/10 opacity-55 hover:opacity-85 scale-[0.97]'
                }`}
                style={{ background: item.gradient }}
              >
                <span className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" aria-hidden="true" />
                <span
                  className="absolute top-1 right-2 font-heading font-black select-none pointer-events-none"
                  style={{ fontSize: '1.6rem', lineHeight: 1, color: 'rgba(255,255,255,0.12)' }}
                  aria-hidden="true"
                >
                  {formatIndex(i)}
                </span>
                <span className="absolute bottom-2 left-2.5 right-2 text-left text-[10px] md:text-[11px] font-black uppercase tracking-wide text-white/85 leading-tight truncate">
                  {item.title}
                </span>
                {isActive && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#a90f21]" aria-hidden="true" />}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
