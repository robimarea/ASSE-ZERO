import { useRef, useEffect, useState, type ReactNode } from 'react';

const MAX_LAYERS = 60;

interface MaskChangeProps {
  curtain: ReactNode;
  children: ReactNode;
  zIndex?: number;
  overlapPrev?: boolean;
  extraStickyDistanceH?: number;
  layerOrder?: number;
}

export function MaskChangeUI({
  curtain,
  children,
  zIndex = 10,
  overlapPrev = false,
  extraStickyDistanceH = 0,
  layerOrder = 0,
}: MaskChangeProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef('200vh');
  const [wrapperHeight, setWrapperHeight] = useState('200vh');

  useEffect(() => {
    const updateHeight = () => {
      if (curtainRef.current && contentRef.current) {
        const nextHeight = `${curtainRef.current.offsetHeight + contentRef.current.offsetHeight + extraStickyDistanceH * window.innerHeight}px`;
        if (nextHeight !== lastHeightRef.current) {
          lastHeightRef.current = nextHeight;
          setWrapperHeight(nextHeight);
        }
      }
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (curtainRef.current) observer.observe(curtainRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    return () => { observer.disconnect(); };
  }, [extraStickyDistanceH]);

  // Z-index dinamico: scroll verso l'alto → sezioni precedenti tornano sopra
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId = 0;
    let pendingUp = false;

    const handleScroll = () => {
      pendingUp = window.scrollY < lastScrollY;
      lastScrollY = window.scrollY;
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!wrapperRef.current) return;
        wrapperRef.current.style.zIndex = pendingUp
          ? String(MAX_LAYERS + layerOrder)
          : String(layerOrder);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [layerOrder]);

  return (
    <div
      ref={wrapperRef}
      data-mask-wrapper="true"
      className="relative w-full font-sans"
      style={{
        minHeight: wrapperHeight,
        marginTop: overlapPrev ? '-100vh' : '0',
        zIndex: layerOrder,
      }}
    >
      <div className="sticky top-0 w-full z-0" ref={contentRef}>
        {children}
      </div>
      <div
        ref={curtainRef}
        data-mask-curtain="true"
        className="absolute top-0 left-0 w-full shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
        style={{ zIndex, transform: 'translateZ(0)', willChange: 'transform' }}
      >
        {curtain}
      </div>
    </div>
  );
}
