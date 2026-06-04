// ============================================
// ASSE ZERO — Video Gallery Section
// Frames stile Showreel + lightbox fullscreen
// ============================================

import { useRef, useEffect, useState, useCallback } from 'react';
import { VIDEO_PILLS, VIDEO_DESCRIPTION } from '@/data/services';
import { useIsMobile } from '@/hooks/useIsMobile';

const VIDEO_ITEMS = [
  {
    id: 1, title: 'GELATERIA DOLCEZZA', subtitle: 'Sweet Catering — Spot',
    gradient: 'linear-gradient(135deg, #a90f21 0%, #2a0008 60%, #2b2d42 100%)',
    src: '/videos/gelateria-dolcezza_sweet-catering.mp4',
  },
  {
    id: 2, title: 'MOTORI SEVEN', subtitle: 'Spot Pubblicitario',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    src: '/videos/motori-seven.mp4',
  },
  {
    id: 3, title: 'SMOKE BEER', subtitle: 'Skateboards — Spot',
    gradient: 'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #3a3a3a 100%)',
    src: '/videos/smoke-beer_skateboards.mp4',
  },
  {
    id: 4, title: 'DELIRIO IN PIENO INVERNO', subtitle: 'Music Video',
    gradient: 'linear-gradient(135deg, #6b0f1a 0%, #1a060a 60%, #2b2d42 100%)',
    src: '/videos/DELIRIO-IN-PIENO%20INVERNO.mp4',
  },
  {
    id: 5, title: 'SENZA DI ME', subtitle: 'Cortometraggio',
    gradient: 'linear-gradient(135deg, #ebdb00 0%, #3a2800 60%, #2b2d42 100%)',
    src: '/videos/SENZA-DI-ME%20-%20cortometraggio-sulla%20paura.mp4',
  },
  {
    id: 6, title: 'LAUDANO & MISTURE', subtitle: 'Spot Pubblicitario',
    gradient: 'linear-gradient(135deg, #c4b800 0%, #2a2000 60%, #2b2d42 100%)',
    src: '/videos/laudano-e-misture.mp4',
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
  const containerRef   = useRef<HTMLElement>(null);
  const mobileCounterRef   = useRef<HTMLSpanElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs    = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs    = useRef<(HTMLElement | null)[]>([]);
  const paragraphRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

  // ── Lightbox state ──────────────────────────────────────────────────────
  const [expandedIndex, setExpandedIndex]   = useState<number | null>(null);
  const expandedVideoRef     = useRef<HTMLVideoElement>(null);
  const expandedContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying]     = useState(false);
  const [isMuted, setIsMuted]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration]       = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading]       = useState(false);

  // Hide navbar in expanded mode (same pattern dello Showreel)
  useEffect(() => {
    if (expandedIndex !== null) {
      document.body.classList.add('video-expanded');
    } else {
      document.body.classList.remove('video-expanded');
    }
    return () => { document.body.classList.remove('video-expanded'); };
  }, [expandedIndex]);

  const openExpanded = useCallback((index: number) => {
    setExpandedIndex(index);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(true);
    setShowControls(true);
  }, []);

  const closeExpanded = useCallback(() => {
    expandedVideoRef.current?.pause();
    setExpandedIndex(null);
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    const video = expandedVideoRef.current;
    if (!video) return;
    if (isPlaying) { video.pause(); setIsPlaying(false); }
    else { video.play().then(() => setIsPlaying(true)).catch(console.error); }
  }, [isPlaying]);

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = expandedVideoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = expandedVideoRef.current;
    if (!video || duration === 0) return;
    const rect  = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * duration;
    setCurrentTime(video.currentTime);
    setProgress(ratio * 100);
  }, [duration]);

  const handleTimeUpdate = () => {
    const video = expandedVideoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / (video.duration || 1)) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = expandedVideoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsLoading(false);
    video.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  const handleVideoError = () => { setIsLoading(false); };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Auto-hide controls dopo 2.5s
  useEffect(() => {
    if (expandedIndex === null) { setShowControls(true); return; }
    let tid: number;
    const reset = () => {
      setShowControls(true);
      clearTimeout(tid);
      tid = window.setTimeout(() => { if (isPlaying) setShowControls(false); }, 2500);
    };
    const container = expandedContainerRef.current;
    container?.addEventListener('mousemove', reset);
    container?.addEventListener('touchstart', reset);
    reset();
    return () => {
      container?.removeEventListener('mousemove', reset);
      container?.removeEventListener('touchstart', reset);
      clearTimeout(tid);
    };
  }, [expandedIndex, isPlaying]);

  // Tastiera: Space = play/pause, Esc = chiudi
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (expandedIndex === null) return;
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeExpanded(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedIndex, togglePlay, closeExpanded]);

  // ── Scroll-driven cards (desktop) ───────────────────────────────────────
  useEffect(() => {
    let frameId = 0;
    const syncProgress = () => {
      frameId = 0;
      if (!scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const scrolled = el.scrollTop;
      const scrollableDistance = el.scrollHeight - el.clientHeight;
      const progress = clamp(scrolled / (scrollableDistance || 1), 0, 1);
      const travel = progress * (VIDEO_ITEMS.length - 1);
      const newActiveIndex = clamp(Math.round(travel), 0, VIDEO_ITEMS.length - 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const relative = index - travel;
        const distance = Math.abs(relative);
        if (distance > 3) { if (card.style.display !== 'none') card.style.display = 'none'; return; }
        if (card.style.display !== 'block') card.style.display = 'block';

        const yOffset  = relative * 45;
        const xOffset  = 5 - (distance * distance * 1.44) * 6;
        const scale    = clamp(1 - distance * 0.25, 0.5, 1);
        const rotateZ  = relative * -4;
        const opacity  = clamp(1.2 - distance * 0.4, 0, 1);
        const isActive = distance < 0.5;

        card.style.transform = `translate3d(${xOffset}vw, ${yOffset}vh, 0) scale(${scale}) rotateZ(${rotateZ}deg)`;
        card.style.opacity = `${opacity}`;
        card.style.zIndex  = isActive ? '20' : `${10 - Math.floor(distance)}`;

        const overlay = overlayRefs.current[index];
        const text    = textRefs.current[index];
        if (overlay) overlay.style.opacity = isActive ? '0' : '1';
        if (text) {
          text.style.opacity   = isActive ? '1' : '0';
          text.style.transform = isActive ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)';
        }
      });

      if (newActiveIndex !== activeIndexRef.current) activeIndexRef.current = newActiveIndex;
    };

    const handleScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(syncProgress);
    };

    if (!isVisible) return;

    const paraEl = paragraphRef.current;
    if (paraEl) {
      paraEl.style.opacity   = '0';
      paraEl.style.transform = 'translateY(48px)';
      paraEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { paraEl.style.opacity = '1'; paraEl.style.transform = 'translateY(0)'; observer.disconnect(); } },
        { threshold: 0.2 }
      );
      observer.observe(paraEl);
    }

    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    syncProgress();

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      scrollContainer?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isVisible]);

  // ── Lightbox ─────────────────────────────────────────────────────────────
  const expandedItem = expandedIndex !== null ? VIDEO_ITEMS[expandedIndex] : null;

  const lightbox = expandedItem && (
    // Backdrop semitrasparente — click fuori per chiudere
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(5, 5, 8, 0.88)' }}
      onClick={closeExpanded}
    >
      {/* Box video centrato — stesse dimensioni dello Showreel windowed */}
      <div
        ref={expandedContainerRef}
        className="relative w-[90vw] md:w-[78vw] lg:w-[68vw] aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] group"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sfondo gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: expandedItem.gradient, opacity: 0.18 }} />

        {/* Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="w-12 h-12 border-2 border-[#a90f21]/20 border-t-[#a90f21] rounded-full animate-spin" />
          </div>
        )}

        {/* Video */}
        <video
          key={expandedIndex}
          ref={expandedVideoRef}
          src={expandedItem.src}
          preload="auto"
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleVideoError}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer select-none"
          style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}
        />

        {/* Placeholder "Prossimamente" quando il video non è ancora disponibile */}
        {!isLoading && duration === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-0" style={{ background: expandedItem.gradient, opacity: 0.55 }} />
            <div className="relative z-10 text-center px-8">
              <p className="text-xs font-black uppercase tracking-[0.35em] mb-3" style={{ color: '#a90f21' }}>
                {expandedItem.subtitle}
              </p>
              <h3
                className="text-white font-black tracking-tighter italic leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2rem, 6vw, 4rem)' }}
              >
                {expandedItem.title}
              </h3>
              <p className="mt-4 text-white/40 text-sm font-black tracking-[0.3em] uppercase">
                Prossimamente
              </p>
            </div>
          </div>
        )}

        {/* Chiudi — top right del box */}
        <button
          onClick={closeExpanded}
          aria-label="Chiudi"
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl transition-all duration-300 hover:scale-105 z-[1010] ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          &times;
        </button>

        {/* Controlli bottom — solo se il video è caricato */}
        {duration > 0 && (
          <div
            className={`absolute bottom-0 left-0 w-full px-5 py-5 md:px-8 md:py-7 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-3 transition-all duration-500 z-20 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            {/* Titolo nel player */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.35em] block mb-0.5" style={{ color: '#a90f21' }}>
                {expandedItem.subtitle}
              </span>
              <h3
                className="text-white font-black tracking-tighter italic leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.1rem, 2vw, 1.7rem)' }}
              >
                {expandedItem.title}
              </h3>
            </div>

            {/* Timeline */}
            <div onClick={handleTimelineClick} className="group/tl w-full py-1.5 flex items-center cursor-pointer">
              <div className="relative h-1 w-full bg-white/20 rounded-full transition-all duration-300 group-hover/tl:h-1.5">
                <div className="absolute top-0 left-0 h-full rounded-full" style={{ backgroundColor: '#a90f21', width: `${progress}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-[#a90f21] shadow-[0_0_8px_rgba(0,0,0,0.5)] scale-0 group-hover/tl:scale-100 transition-transform duration-200"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
            </div>

            {/* Pulsanti */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <button onClick={togglePlay} aria-label={isPlaying ? 'Pausa' : 'Avvia'} className="text-white hover:text-[#a90f21] transition-colors">
                  {isPlaying
                    ? <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    : <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  }
                </button>
                <span className="text-white/70 text-xs font-semibold select-none">
                  {formatTime(currentTime)} <span className="text-white/30 font-light">/</span> {formatTime(duration)}
                </span>
              </div>
              <button onClick={(e) => toggleMute(e)} aria-label={isMuted ? 'Riattiva audio' : 'Disattiva audio'} className="text-white hover:text-[#a90f21] transition-colors">
                {isMuted
                  ? <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M3.63 3.63L2.36 4.9 7.47 10H4.5v4h3l4.17 4.17V14.3l3.65 3.65c-.71.55-1.51.98-2.38 1.25v2.06c1.4-.38 2.67-1.12 3.69-2.11l2.62 2.62 1.27-1.27L3.63 3.63zM10.17 6.83L12 5v4.3L10.17 7.47zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.24l2.48 2.48c.01-.23.02-.45.02-.69zM14 3.23v2.06c2.89.86 5 3.54 5 6.71 0 1.9-.53 3.67-1.44 5.17l1.46 1.46C20.25 16.5 21 14.34 21 12c0-4.28-2.99-7.86-7-8.77z" /></svg>
                  : <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" /></svg>
                }
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ── Mobile: carosello cinematografico ─────────────────────────────────────
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
        {lightbox}

        {/* Header */}
        <div className="px-5 pt-12 mb-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.35em] mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
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
            <span ref={mobileCounterRef} className="font-black block leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '3rem', color: 'rgba(255,255,255,0.1)' }}>
              01
            </span>
            <span className="text-[11px] font-black tracking-widest" style={{ color: 'rgba(255,255,255,0.18)' }}>
              / {String(VIDEO_ITEMS.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Carosello */}
        <div
          className="overflow-x-auto scrollbar-hidden snap-x snap-mandatory flex gap-[10px] pb-5"
          style={{ touchAction: 'pan-x', overscrollBehaviorX: 'contain', paddingLeft: '1.25rem', paddingRight: '1.25rem' }}
          onScroll={handleCarouselScroll}
        >
          {VIDEO_ITEMS.map((item, index) => (
            <div key={item.id} className="snap-center shrink-0 w-[90vw]">
              <div
                className="overflow-hidden relative cursor-pointer group"
                style={{
                  aspectRatio: '16/9',
                  background: item.gradient,
                  borderRadius: '2rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 30px 90px rgba(0,0,0,0.85)',
                }}
                onClick={() => openExpanded(index)}
              >
                {/* Gradiente cinematic identico allo Showreel */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/85 via-black/20 to-black/35" />

                {/* Watermark numero */}
                <span
                  className="absolute top-2 right-3 font-black select-none pointer-events-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '7rem', lineHeight: 1, color: 'rgba(255,255,255,0.05)', letterSpacing: '-0.02em' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Play button */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(169,15,33,0.45)] group-hover:scale-110 transition-all duration-500 z-10 pointer-events-none"
                  style={{ backgroundColor: '#a90f21' }}
                >
                  <svg className="w-8 h-8 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <div className="absolute inset-0 rounded-full border border-[#a90f21]/40 animate-ping" style={{ animationDuration: '2.5s' }} />
                </div>

                {/* Bottom */}
                <div className="absolute bottom-8 left-5 pointer-events-none">
                  <span className="text-xs font-black uppercase tracking-[0.35em] block mb-2" style={{ color: '#a90f21' }}>
                    {item.subtitle}
                  </span>
                  <h3
                    className="text-white font-black leading-none tracking-tighter italic"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.5rem, 5.5vw, 2rem)' }}
                  >
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Separatore */}
        <div className="mx-5 mb-5" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

        {/* Pills */}
        <div className="overflow-x-auto scrollbar-hidden flex gap-2 px-5 pb-1" style={{ touchAction: 'pan-x' }}>
          {VIDEO_PILLS.map((pill, i) => (
            <span
              key={pill}
              className="shrink-0 flex items-center gap-2 border border-white/[0.07] border-l-2 border-l-[#a90f21] active:scale-95 transition-transform duration-150"
              style={{ padding: '8px 14px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}
            >
              <span className="text-[8px] font-black tabular-nums" style={{ color: '#a90f21' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="w-px h-2.5 shrink-0 bg-white/10" />
              <span className="text-[10px] font-black tracking-[0.16em] uppercase text-white/55">
                {pill}
              </span>
            </span>
          ))}
        </div>

        {/* Descrizione */}
        <div className="px-5 mt-5 pb-12">
          <div className="text-sm leading-relaxed space-y-2" style={{ color: 'rgba(237,242,244,0.65)' }}>
            {VIDEO_DESCRIPTION.map((text, idx) => (
              <p key={idx} dangerouslySetInnerHTML={{ __html: text }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Desktop: scroll-driven stacked cards ──────────────────────────────────
  return (
    <section ref={containerRef} className="relative w-full bg-dark z-0 h-screen">
      {lightbox}

      <div className="w-full h-full overflow-hidden bg-dark flex flex-col md:flex-row items-center justify-center">

        {/* Colonna sinistra: slider */}
        <div ref={scrollContainerRef} className="relative w-full md:w-[50%] h-full overflow-y-auto shrink-0 scrollbar-hidden">
          <div className="sticky top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none">
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
                  {/* Gradiente background */}
                  <div className="w-full h-full opacity-80" style={{ background: item.gradient }} aria-hidden="true" />

                  {/* Gradiente scuro cinematic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />

                  {/* Hatch per card inattive */}
                  <div
                    ref={(el) => { overlayRefs.current[index] = el; }}
                    className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                    aria-hidden="true"
                    style={{
                      background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.85) 10px, rgba(0,0,0,0.85) 20px)',
                      backgroundColor: 'rgba(0,0,0,0.55)',
                    }}
                  />

                  {/* Play button */}
                  <div
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_15px_40px_rgba(169,15,33,0.45)] group-hover:shadow-[0_20px_50px_rgba(169,15,33,0.65)] group-hover:scale-110 transition-all duration-500 z-10 pointer-events-none"
                    style={{ backgroundColor: '#a90f21' }}
                  >
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white fill-current translate-x-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <div className="absolute inset-0 rounded-full border border-[#a90f21]/40 animate-ping" style={{ animationDuration: '2.5s' }} />
                  </div>

                  {/* Testo bottom (animato dallo scroll) */}
                  <div
                    ref={(el) => { textRefs.current[index] = el; }}
                    className="absolute bottom-6 left-6 transition-all duration-500 ease-out pointer-events-none"
                    style={{ opacity: 0, transform: 'translate3d(0,20px,0)' }}
                  >
                    <span className="text-xs font-black uppercase tracking-[0.35em] block mb-1" style={{ color: '#a90f21' }}>
                      {item.subtitle}
                    </span>
                    <h3
                      className="text-white font-black tracking-tighter italic leading-none"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Spacer scroll */}
          <div style={{ height: `${(VIDEO_ITEMS.length + 1) * 100}vh` }} />
        </div>

        {/* Colonna destra: contenuto */}
        <div className="relative w-full md:w-[50%] h-full flex flex-col justify-center px-6 md:px-10 lg:pr-20 z-20 py-8 pointer-events-none md:pointer-events-auto mt-[40vh] md:mt-0">
          <div className="rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-visible flex flex-col justify-center gap-6" style={{ backgroundColor: '#2b2d42' }}>

            <h2
              className="font-heading font-black text-[5rem] md:text-[7rem] lg:text-[9rem] leading-none tracking-tighter mb-1 drop-shadow-2xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#ebdb00' }}
            >
              Video
            </h2>

            <div className="flex flex-wrap justify-center gap-2 md:gap-2.5 mt-6">
              {VIDEO_PILLS.map((pill, i) => (
                <div
                  key={pill}
                  className="group relative overflow-hidden cursor-default border border-white/[0.07] border-l-2 border-l-[#a90f21] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(169,15,33,0.3)]"
                  style={{ padding: '9px 16px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)' }}
                >
                  <span className="absolute inset-0 bg-[#a90f21] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center gap-2.5">
                    <span className="text-[9px] font-black tabular-nums text-[#a90f21] group-hover:text-white/50 transition-colors duration-200">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="w-px h-3 shrink-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-200" />
                    <span className="text-[11px] font-black tracking-[0.16em] uppercase text-white/55 group-hover:text-white transition-colors duration-200">
                      {pill}
                    </span>
                  </span>
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
