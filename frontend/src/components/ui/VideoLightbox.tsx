import { useRef, useEffect } from 'react';
import { VideoItem } from '@/data/videos';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { VideoPlayerControls, VideoSpinner } from '@/components/ui/VideoPlayerControls';

interface Props {
  item: VideoItem;
  itemIndex: number;
  onClose: () => void;
}

export function VideoLightbox({ item, itemIndex, onClose }: Props) {
  const videoRef     = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isPlaying, isMuted, progress, currentTime, duration, isLoading, showControls,
    togglePlay, toggleMute, handleTimeUpdate, handleLoadedMetadata, handleTimelineClick,
  } = useVideoPlayer({
    videoRef,
    containerRef: containerRef as React.RefObject<HTMLElement | null>,
    isActive: true,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePlay(); }
      else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay, onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(5, 5, 8, 0.88)' }}
      onClick={onClose}
    >
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
          onClick={onClose}
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
