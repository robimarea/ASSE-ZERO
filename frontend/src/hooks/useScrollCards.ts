import { useRef, useEffect } from 'react';
import { clamp } from '@/lib/math';

interface Options {
  containerRef: React.RefObject<HTMLElement | null>;
  count: number;
  isVisible: boolean;
  paragraphRef?: React.RefObject<HTMLDivElement | null>;
}

export function useScrollCards({ containerRef, count, isVisible, paragraphRef }: Options) {
  const cardRefs    = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs    = useRef<(HTMLElement | null)[]>([]);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (!isVisible) return;

    let frameId = 0;
    let sTop = 0;
    let sHeight = 0;

    const updateMetrics = () => {
      if (!containerRef.current) return;
      const wrapper = containerRef.current.closest('.relative.w-full.font-sans') as HTMLElement;
      if (wrapper) {
        sTop = Math.round(wrapper.getBoundingClientRect().top + window.scrollY);
        sHeight = wrapper.offsetHeight;
      }
    };

    const sync = () => {
      frameId = 0;
      if (!containerRef.current) return;
      const scrollable  = Math.max(1, sHeight - window.innerHeight * 2);
      const scrolled    = Math.max(0, window.scrollY - sTop - window.innerHeight);
      const scrollProg  = clamp(scrolled / scrollable, 0, 1);
      const travel      = scrollProg * (count - 1);
      const newActive   = clamp(Math.round(travel), 0, count - 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const relative = index - travel;
        const distance = Math.abs(relative);
        if (distance > 3) { if (card.style.display !== 'none') card.style.display = 'none'; return; }
        if (card.style.display !== 'block') card.style.display = 'block';

        const isActive = distance < 0.5;
        card.style.transform = `translate3d(${5 - (distance * distance * 1.44) * 6}vw, ${relative * 45}vh, 0) scale(${clamp(1 - distance * 0.25, 0.5, 1)}) rotateZ(${relative * -4}deg)`;
        card.style.opacity   = `${clamp(1.2 - distance * 0.4, 0, 1)}`;
        card.style.zIndex    = isActive ? '20' : `${10 - Math.floor(distance)}`;

        const overlay = overlayRefs.current[index];
        const text    = textRefs.current[index];
        if (overlay) overlay.style.opacity = isActive ? '0' : '1';
        if (text) {
          text.style.opacity   = isActive ? '1' : '0';
          text.style.transform = isActive ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)';
        }
      });

      if (newActive !== activeIndexRef.current) activeIndexRef.current = newActive;
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const vb = window.scrollY + window.innerHeight;
      if (vb < sTop || window.scrollY > sTop + sHeight) return;
      if (frameId !== 0) return;
      frameId = requestAnimationFrame(sync);
    };

    const paraEl = paragraphRef?.current;
    if (paraEl) {
      paraEl.style.opacity    = '0';
      paraEl.style.transform  = 'translateY(48px)';
      paraEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { paraEl.style.opacity = '1'; paraEl.style.transform = 'translateY(0)'; observer.disconnect(); } },
        { threshold: 0.2 }
      );
      observer.observe(paraEl);
    }

    updateMetrics();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => { updateMetrics(); handleScroll(); }, { passive: true });
    sync();

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, containerRef, count, paragraphRef]);

  return { cardRefs, overlayRefs, textRefs, activeIndexRef };
}
