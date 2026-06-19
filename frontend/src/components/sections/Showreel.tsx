import { useEffect, useRef, useState, useCallback } from 'react';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { VideoPlayerControls, VideoSpinner } from '@/components/ui/VideoPlayerControls';

interface ShowreelProps {
  isVisible?: boolean;
}

export function Showreel({ isVisible = true }: ShowreelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const [shouldLoad, setShouldLoad] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    isPlaying, isMuted, progress, currentTime, duration, isLoading, showControls,
    play, pause, togglePlay, toggleMute, setMuted,
    handleTimeUpdate, handleLoadedMetadata, handleTimelineClick,
  } = useVideoPlayer({
    videoRef,
    containerRef: containerRef as React.RefObject<HTMLElement | null>,
    isActive: isExpanded,
    initialMuted: true,
    autoPlayOnLoad: false,
  });

  // Lazy-load: assign src only the first time the section becomes visible
  useEffect(() => {
    if (isVisible && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setShouldLoad(true);
    }
  }, [isVisible]);

  // Drive play/pause from section visibility
  useEffect(() => {
    if (isVisible) {
      if (!isExpanded) setMuted(true);
      play();
    } else {
      pause();
    }
  }, [isVisible, isExpanded, play, pause, setMuted]);

  const releaseCursor = useCallback(() => {
    document.querySelectorAll('.cursor-target').forEach((el) => {
      el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
  }, []);

  const minimize = useCallback(() => {
    releaseCursor();
    setIsExpanded(false);
    setMuted(true);
    play();
  }, [releaseCursor, setMuted, play]);

  const expand = useCallback(() => {
    releaseCursor();
    setIsExpanded(true);
    setMuted(false);
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    play();
  }, [releaseCursor, setMuted, play]);

  // Keyboard: Space = play/pause, Esc = minimize
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isExpanded) return;
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'Escape') { e.preventDefault(); minimize(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isExpanded, togglePlay, minimize]);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] bg-dark flex items-center justify-center overflow-hidden z-0"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(169,15,33,0.12),transparent_40%),radial-gradient(circle_at_18%_24%,rgba(169,15,33,0.06),transparent_25%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,8,0.2),rgba(5,5,8,0.8))] pointer-events-none" />

      <div
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        onClick={!isExpanded ? expand : undefined}
        className={`relative transition-all duration-700 bg-black overflow-hidden group ${
          isExpanded
            ? 'fixed inset-0 w-screen h-[100dvh] z-[999] rounded-none border-none'
            : 'w-[90vw] md:w-[75vw] lg:w-[65vw] aspect-video rounded-[2rem] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] hover:border-[#a90f21]/25 pointer-events-auto cursor-pointer'
        }`}
      >
        {isLoading && <VideoSpinner />}

        <video
          ref={videoRef}
          src={shouldLoad ? '/videos/show_reel.mp4' : undefined}
          preload="auto"
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={isExpanded ? togglePlay : undefined}
          style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}
          className={`w-full h-full select-none transition-all duration-700 ${
            isExpanded
              ? 'object-contain cursor-pointer'
              : 'object-cover cursor-target scale-100 group-hover:scale-[1.02] filter contrast-[1.02] saturate-[1.05]'
          }`}
        />

        {/* Windowed mode overlay */}
        {!isExpanded && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 pointer-events-none" />
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 pointer-events-none">
              <div style={{ overflow: 'hidden' }}>
                <span
                  className="text-xs md:text-sm font-black uppercase tracking-[0.35em] block mb-2 md:mb-3"
                  style={{
                    color: '#a90f21',
                    transform: isVisible ? 'translateY(0)' : 'translateY(115%)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1) 150ms, opacity 0.6s ease 150ms',
                  }}
                >
                  ASSE ZERO — SHOWREEL
                </span>
              </div>
              <h2
                className="font-heading font-black text-4xl md:text-6xl tracking-tighter uppercase italic leading-none"
                style={{ fontFamily: "'Nohemi', sans-serif" }}
              >
                {[
                  { text: 'PRODUZIONE', color: 'white' },
                  { text: 'VIDEO', color: '#a90f21' },
                ].map(({ text, color }, i) => (
                  <span key={text} style={{ display: 'block', overflow: 'hidden' }}>
                    <span
                      style={{
                        display: 'block',
                        color,
                        transform: isVisible ? 'translateY(0)' : 'translateY(105%)',
                        transition: `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${320 + i * 120}ms`,
                      }}
                    >
                      {text}
                    </span>
                  </span>
                ))}
              </h2>
            </div>
          </>
        )}

        {/* Expanded mode: close button */}
        {isExpanded && (
          <button
            onClick={minimize}
            aria-label="Esci dalla modalità cinema"
            className={`absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-white text-2xl transition-all duration-300 hover:scale-105 cursor-target z-[1010] ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            &times;
          </button>
        )}

        <VideoPlayerControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          progress={progress}
          currentTime={currentTime}
          duration={isExpanded ? duration : 0}
          showControls={showControls}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onTimelineClick={handleTimelineClick}
          onMinimize={minimize}
        />
      </div>
    </section>
  );
}
