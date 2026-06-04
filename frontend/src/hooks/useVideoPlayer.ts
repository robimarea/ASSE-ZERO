import { useState, useEffect, useCallback, useRef } from 'react';

interface Options {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  isActive: boolean;
  initialMuted?: boolean;
  autoPlayOnLoad?: boolean;
}

export function useVideoPlayer({
  videoRef,
  containerRef,
  isActive,
  initialMuted = false,
  autoPlayOnLoad = true,
}: Options) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const durationRef = useRef(0);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    durationRef.current = 0;
    setIsLoading(true);
    setShowControls(true);
  }, []);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setIsPlaying(true);
    } catch {
      // autoplay policy blocks are expected; caller decides whether to warn
    }
  }, [videoRef]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setIsPlaying(false);
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    if (videoRef.current?.paused) play(); else pause();
  }, [videoRef, play, pause]);

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, [videoRef]);

  const setMuted = useCallback((value: boolean) => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = value;
    setIsMuted(value);
  }, [videoRef]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / (video.duration || 1)) * 100);
  }, [videoRef]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    durationRef.current = video.duration;
    setDuration(video.duration);
    setIsLoading(false);
    if (autoPlayOnLoad) play();
  }, [videoRef, autoPlayOnLoad, play]);

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !durationRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = ratio * durationRef.current;
    setCurrentTime(video.currentTime);
    setProgress(ratio * 100);
  }, [videoRef]);

  // Toggle body class so the navbar can hide itself
  useEffect(() => {
    document.body.classList.toggle('video-expanded', isActive);
    return () => { document.body.classList.remove('video-expanded'); };
  }, [isActive]);

  // Auto-hide controls after 2.5s of inactivity
  useEffect(() => {
    if (!isActive) { setShowControls(true); return; }
    let tid: number;
    const show = () => {
      setShowControls(true);
      clearTimeout(tid);
      tid = window.setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 2500);
    };
    const el = containerRef?.current;
    el?.addEventListener('mousemove', show);
    el?.addEventListener('touchstart', show);
    show();
    return () => {
      el?.removeEventListener('mousemove', show);
      el?.removeEventListener('touchstart', show);
      clearTimeout(tid);
    };
  }, [isActive, isPlaying, containerRef]);

  return {
    isPlaying, isMuted, progress, currentTime, duration, isLoading, showControls,
    play, pause, togglePlay, toggleMute, setMuted,
    handleTimeUpdate, handleLoadedMetadata, handleTimelineClick,
    reset,
  };
}
