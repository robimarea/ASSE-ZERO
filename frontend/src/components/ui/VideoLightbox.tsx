import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { VideoItem } from '@/data/videos';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { VideoPlayerControls, VideoSpinner } from '@/components/ui/VideoPlayerControls';

interface Props {
  item: VideoItem;
  itemIndex: number;
  onClose: () => void;
  originRect?: DOMRect | null;
}

export function VideoLightbox({ item, itemIndex, onClose, originRect }: Props) {
  const videoRef      = useRef<HTMLVideoElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const backdropRef   = useRef<HTMLDivElement>(null);
  const closeBtnRef   = useRef<HTMLButtonElement>(null);
  const closingRef    = useRef(false);

  const {
    isPlaying, isMuted, progress, currentTime, duration, isLoading, showControls,
    togglePlay, toggleMute, handleTimeUpdate, handleLoadedMetadata, handleTimelineClick,
  } = useVideoPlayer({
    videoRef,
    containerRef: containerRef as React.RefObject<HTMLElement | null>,
    isActive: true,
  });

  const animateClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const el = containerRef.current;
    const backdrop = backdropRef.current;
    if (!el || !backdrop) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ onComplete: onClose });

    if (originRect) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const ox = originRect.left + originRect.width / 2;
      const oy = originRect.top + originRect.height / 2;
      const rect = el.getBoundingClientRect();
      const scaleX = originRect.width / rect.width;
      const scaleY = originRect.height / rect.height;

      tl.to(backdrop, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 0)
        .to(
          el,
          {
            x: ox - cx,
            y: oy - cy,
            scaleX,
            scaleY,
            borderRadius: '2rem',
            opacity: 0.85,
            duration: 0.42,
            ease: 'power3.inOut',
          },
          0
        );
    } else {
      tl.to(backdrop, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
        .to(el, { scale: 0.94, opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
    }
  }, [onClose, originRect]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'Escape') { e.preventDefault(); animateClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, animateClose]);

  useEffect(() => {
    const el = containerRef.current;
    const backdrop = backdropRef.current;
    const closeBtn = closeBtnRef.current;
    if (!el || !backdrop) return;

    gsap.set(el, { transformOrigin: 'center center' });

    const ctx = gsap.context(() => {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });

      if (originRect) {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const ox = originRect.left + originRect.width / 2;
        const oy = originRect.top + originRect.height / 2;
        const rect = el.getBoundingClientRect();
        const scaleX = originRect.width / rect.width;
        const scaleY = originRect.height / rect.height;

        gsap.fromTo(
          el,
          {
            x: ox - cx,
            y: oy - cy,
            scaleX,
            scaleY,
            opacity: 0.7,
          },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.inOut',
            clearProps: 'transform',
          }
        );
      } else {
        gsap.fromTo(el, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: 'power3.out' });
      }

      if (closeBtn) {
        gsap.fromTo(closeBtn, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.35, delay: 0.2, ease: 'power2.out' });
      }
    });

    return () => ctx.revert();
  }, [originRect]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[999] flex items-center justify-center video-lightbox-backdrop"
      style={{ backgroundColor: 'rgba(5, 5, 8, 0.88)' }}
      onClick={animateClose}
    >
      <div
        className="absolute inset-0 pointer-events-none video-lightbox-vignette"
        style={{ background: item.gradient, opacity: 0.12 }}
        aria-hidden="true"
      />

      <div
        ref={containerRef}
        className="relative w-[90vw] md:w-[78vw] lg:w-[68vw] aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: item.gradient, opacity: 0.18 }} />

        {isLoading && <VideoSpinner />}

        <video
          key={itemIndex}
          ref={videoRef}
          src={item.src}
          preload="auto"
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => {}}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer select-none"
          style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}
        />

        {!isLoading && !duration && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="absolute inset-0" style={{ background: item.gradient, opacity: 0.55 }} />
            <div className="relative z-10 text-center px-8">
              <p className="text-xs font-black uppercase tracking-[0.35em] mb-3" style={{ color: '#a90f21' }}>
                {item.subtitle}
              </p>
              <h3
                className="text-white font-black tracking-tighter italic leading-none"
                style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(2rem, 6vw, 4rem)' }}
              >
                {item.title}
              </h3>
              <p className="mt-4 text-white/40 text-sm font-black tracking-[0.3em] uppercase">Prossimamente</p>
            </div>
          </div>
        )}

        <button
          ref={closeBtnRef}
          onClick={animateClose}
          aria-label="Chiudi"
          className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 backdrop-blur-md flex items-center justify-center text-white text-xl transition-all duration-300 hover:scale-105 z-[1010] ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          &times;
        </button>

        <VideoPlayerControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          progress={progress}
          currentTime={currentTime}
          duration={duration}
          showControls={showControls}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onTimelineClick={handleTimelineClick}
          title={item.title}
          subtitle={item.subtitle}
        />
      </div>
    </div>
  );
}
