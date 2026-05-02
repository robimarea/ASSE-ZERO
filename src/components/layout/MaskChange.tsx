import { useRef, useEffect, useState, type ReactNode } from 'react';

interface MaskChangeProps {
  curtain: ReactNode;
  children: ReactNode;
  zIndex?: number;
  overlapPrev?: boolean;
  extraStickyDistanceH?: number;
}

export function MaskChangeUI({ 
  curtain, 
  children, 
  zIndex = 10,
  overlapPrev = false,
  extraStickyDistanceH = 0 
}: MaskChangeProps) {
  const curtainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastHeightRef = useRef('200vh');
  const [wrapperHeight, setWrapperHeight] = useState('200vh');

  useEffect(() => {
    const updateHeight = () => {
      if (curtainRef.current && contentRef.current) {
        const curtainH = curtainRef.current.offsetHeight;
        const contentH = contentRef.current.offsetHeight;
        const extraH = extraStickyDistanceH * window.innerHeight;
        const nextHeight = `${curtainH + contentH + extraH}px`;
        if (nextHeight !== lastHeightRef.current) {
          lastHeightRef.current = nextHeight;
          setWrapperHeight(nextHeight);
        }
      }
    };
    
    // Initial update
    updateHeight();
    
    // Use ResizeObserver for more robust updates
    const observer = new ResizeObserver(updateHeight);
    if (curtainRef.current) observer.observe(curtainRef.current);
    if (contentRef.current) observer.observe(contentRef.current);

    return () => {
      observer.disconnect();
    };
  }, [extraStickyDistanceH]);

  return (
    <div 
      className="relative w-full z-0 font-sans" 
      style={{ 
        minHeight: wrapperHeight,
        marginTop: overlapPrev ? '-100vh' : '0' 
      }}
    >
      {/* The background content that will be revealed */}
      <div 
        className="sticky top-0 w-full z-0" 
        ref={contentRef}
      >
        {children}
      </div>

      {/* The curtain that covers it initially and scrolls up */}
      <div 
        ref={curtainRef}
        className="absolute top-0 left-0 w-full shadow-[0_30px_60px_rgba(0,0,0,0.4)]" 
        style={{ zIndex }}
      >
        {curtain}
      </div>
    </div>
  );
}
