// ============================================
// ASSE ZERO — Showreel Video Section
// Immersive premium video player with cinematic frame & expanded state
// ============================================

import { useEffect, useRef, useState } from 'react';

interface ShowreelProps {
  isVisible?: boolean;
}

export function Showreel({ isVisible = true }: ShowreelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Play/pause based on section visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      // In windowed view, we force-mute to comply with autoplay policy.
      // If expanded view was active, we preserve the unmute state.
      if (!isExpanded) {
        video.muted = true;
        setIsMuted(true);
      }
      video.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('Showreel autoplay delayed:', err));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isVisible, isExpanded]);

  // Hide controls after 2.5s of inactivity when expanded
  useEffect(() => {
    if (!isExpanded) {
      setShowControls(true);
      return;
    }

    let timeoutId: number;

    const resetControlsTimeout = () => {
      setShowControls(true);
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 2500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', resetControlsTimeout);
      container.addEventListener('click', resetControlsTimeout);
    }

    resetControlsTimeout();

    return () => {
      if (container) {
        container.removeEventListener('mousemove', resetControlsTimeout);
        container.removeEventListener('click', resetControlsTimeout);
      }
      clearTimeout(timeoutId);
    };
  }, [isExpanded, isPlaying]);

  // Keyboard navigation when expanded
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isExpanded) return;
      
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        minimizeVideo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, isPlaying]);

  // Toggle body class 'video-expanded' to hide global navbar when in Cinema Mode
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('video-expanded');
    } else {
      document.body.classList.remove('video-expanded');
    }

    return () => {
      document.body.classList.remove('video-expanded');
    };
  }, [isExpanded]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error(err));
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const releaseCursor = () => {
    const activeTargets = document.querySelectorAll('.cursor-target');
    activeTargets.forEach((el) => {
      el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
  };

  const expandVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    releaseCursor();
    setIsExpanded(true);
    // Unmute when expanded so user gets full sound experience
    video.muted = false;
    setIsMuted(false);
    
    // Smooth scroll page to showreel section to align correctly
    const container = containerRef.current;
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    video.play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error(err));
  };

  const minimizeVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    releaseCursor();
    setIsExpanded(false);
    // Re-mute when returning to windowed mode
    video.muted = true;
    setIsMuted(true);
    
    video.play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.error(err));
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const current = video.currentTime;
    const dur = video.duration || 1;
    setCurrentTime(current);
    setProgress((current / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setIsLoading(false);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || duration === 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickRatio = Math.max(0, Math.min(1, clickX / width));
    const newTime = clickRatio * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(clickRatio * 100);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] bg-dark flex items-center justify-center overflow-hidden z-0"
    >
      {/* Background Gradients for depth and premium feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(233,172,6,0.11),transparent_40%),radial-gradient(circle_at_18%_24%,rgba(191,51,32,0.06),transparent_25%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,8,0.2),rgba(5,5,8,0.8))] pointer-events-none" />

      {/* Main Video Box */}
      <div
        style={{
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative transition-all duration-700 bg-black overflow-hidden group ${
          isExpanded
            ? 'fixed inset-0 w-screen h-[100dvh] z-[999] rounded-none border-none'
            : 'w-[90vw] md:w-[75vw] lg:w-[65vw] aspect-video rounded-[2rem] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] hover:border-primary/20 pointer-events-auto'
        }`}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 bg-black flex items-center justify-center z-30">
            <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          src="/show_reel.mp4"
          preload="auto"
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onClick={isExpanded ? togglePlay : expandVideo}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'translate3d(0,0,0)',
          }}
          className={`w-full h-full select-none transition-all duration-700 ${
            isExpanded
              ? 'object-contain cursor-pointer'
              : 'object-cover cursor-target scale-100 group-hover:scale-[1.02] filter contrast-[1.02] saturate-[1.05]'
          }`}
        />

        {/* Windowed Mode: Dark gradient overlay & Title text */}
        {!isExpanded && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/35 opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Title & Category text overlay */}
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 transition-all duration-500 pointer-events-none">
              <span className="text-primary text-xs md:text-sm font-black uppercase tracking-[0.35em] block mb-2 md:mb-3">
                ASSE ZERO — SHOWREEL
              </span>
              <h2
                className="text-white font-heading font-black text-4xl md:text-6xl tracking-tighter uppercase italic leading-none"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                PRODUZIONE<br />
                <span className="text-primary">VIDEO</span>
              </h2>
            </div>

            {/* Play Button - Windowed Mode */}
            <button
              onClick={expandVideo}
              aria-label="Avvia video in modalità cinema"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-26 md:h-26 rounded-full bg-primary flex items-center justify-center shadow-[0_15px_40px_rgba(233,172,6,0.35)] hover:shadow-[0_20px_50px_rgba(233,172,6,0.55)] transition-all duration-500 hover:scale-108 active:scale-95 group/btn cursor-target z-10"
            >
              <svg
                className="w-8 h-8 md:w-9 md:h-9 text-black fill-current translate-x-0.5 group-hover/btn:scale-105 transition-transform duration-300"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              {/* Outer wave rings */}
              <div
                className="absolute inset-0 rounded-full border border-primary/40 animate-ping"
                style={{ animationDuration: '2.5s' }}
              />
            </button>
          </>
        )}

        {/* Expanded Mode: Close Button */}
        {isExpanded && (
          <button
            onClick={minimizeVideo}
            aria-label="Esci dalla modalità cinema"
            className={`absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 backdrop-blur-md flex items-center justify-center text-white text-2xl transition-all duration-300 hover:scale-105 cursor-target z-[1010] ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
            }`}
          >
            &times;
          </button>
        )}

        {/* Expanded Mode: Bottom Controls Overlay */}
        {isExpanded && (
          <div
            className={`absolute bottom-0 left-0 w-full px-6 py-8 md:px-12 md:py-10 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-5 transition-all duration-500 z-20 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
            }`}
          >
            {/* Timeline slider */}
            <div
              onClick={handleTimelineClick}
              className="group/timeline w-full py-2 flex items-center cursor-pointer"
            >
              <div className="relative h-1.5 w-full bg-white/20 rounded-full transition-all duration-300 group-hover/timeline:h-2">
                {/* Active progress bar */}
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  style={{ width: `${progress}%` }}
                />
                {/* Drag handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-primary shadow-[0_0_8px_rgba(0,0,0,0.5)] scale-0 group-hover/timeline:scale-100 transition-transform duration-200"
                  style={{ left: `calc(${progress}% - 8px)` }}
                />
              </div>
            </div>

            {/* Control buttons & time display */}
            <div className="flex items-center justify-between">
              {/* Left Column: Play/Pause, Time */}
              <div className="flex items-center gap-6">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pausa' : 'Avvia'}
                  className="text-white hover:text-primary transition-colors cursor-target"
                >
                  {isPlaying ? (
                    /* Pause SVG */
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    /* Play SVG */
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Time Display */}
                <span className="text-white/70 text-sm font-semibold select-none">
                  {formatTime(currentTime)} <span className="text-white/30 font-light">/</span> {formatTime(duration)}
                </span>
              </div>

              {/* Right Column: Audio details, Minimize */}
              <div className="flex items-center gap-6">
                {/* Volume Toggle */}
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Riattiva audio' : 'Disattiva audio'}
                  className="text-white hover:text-primary transition-colors cursor-target"
                >
                  {isMuted ? (
                    /* Volume Mute SVG */
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M3.63 3.63L2.36 4.9 7.47 10H4.5v4h3l4.17 4.17V14.3l3.65 3.65c-.71.55-1.51.98-2.38 1.25v2.06c1.4-.38 2.67-1.12 3.69-2.11l2.62 2.62 1.27-1.27L3.63 3.63zM10.17 6.83L12 5v4.3L10.17 7.47zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.24l2.48 2.48c.01-.23.02-.45.02-.69zM14 3.23v2.06c2.89.86 5 3.54 5 6.71 0 1.9-.53 3.67-1.44 5.17l1.46 1.46C20.25 16.5 21 14.34 21 12c0-4.28-2.99-7.86-7-8.77z" />
                    </svg>
                  ) : (
                    /* Volume Up SVG */
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                {/* Minimize button (bottom-right) */}
                <button
                  onClick={minimizeVideo}
                  aria-label="Riduci video"
                  className="text-white hover:text-primary transition-colors cursor-target"
                >
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
