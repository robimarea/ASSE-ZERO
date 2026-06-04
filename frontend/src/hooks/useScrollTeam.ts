import { useRef, useEffect } from 'react';
import { clamp } from '@/lib/math';

interface Options {
  containerRef: React.RefObject<HTMLElement | null>;
  count: number;
  isVisible: boolean;
}

export function useScrollTeam({ containerRef, count, isVisible }: Options) {
  const textRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef     = useRef<HTMLSpanElement | null>(null);
  const prevActiveRef  = useRef(0);
  const prevPointerRef = useRef<(boolean | null)[]>(new Array(count).fill(null));

  useEffect(() => {
    if (!isVisible) return;

    let frameId = 0;
    let sTop = 0;
    let sHeight = 0;

    const updateMetrics = () => {
      if (!containerRef.current) return;
      const wrapper = containerRef.current.closest('.relative.w-full.font-sans') as HTMLElement;
      const el = wrapper ?? containerRef.current;
      sTop = el.getBoundingClientRect().top + window.scrollY;
      sHeight = el.offsetHeight;
    };

    const sync = () => {
      frameId = 0;
      if (!containerRef.current) return;

      const scrollable = Math.max(1, sHeight - window.innerHeight * 2);
      const scrolled   = Math.max(0, window.scrollY - sTop - window.innerHeight);
      const travel     = clamp(scrolled / scrollable, 0, 1) * (count - 1);
      const active     = clamp(Math.round(travel), 0, count - 1);

      textRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(i - travel);
        const opacity = dist <= 0.2 ? 1 : dist < 0.5
          ? (() => { const t = 1 - ((dist - 0.2) / 0.3); return t * t * (3 - 2 * t); })()
          : 0;
        const moveEase   = Math.sign(i - travel) * Math.pow(Math.abs(i - travel), 1.5);
        el.style.opacity   = opacity.toFixed(3);
        el.style.transform = `translateX(${(-moveEase * 100).toFixed(1)}px)`;
        const wantsAuto = opacity > 0.5;
        if (prevPointerRef.current[i] !== wantsAuto) {
          prevPointerRef.current[i] = wantsAuto;
          el.style.pointerEvents = wantsAuto ? 'auto' : 'none';
        }
      });

      if (active !== prevActiveRef.current) {
        prevActiveRef.current = active;
        photoRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.opacity   = i === active ? '1' : '0';
          el.style.transform = i === active ? 'scale(1)' : 'scale(0.97)';
        });
        if (counterRef.current) {
          counterRef.current.textContent = `${active + 1}`;
          counterRef.current.classList.remove('counter-flash');
          void (counterRef.current as HTMLElement).offsetWidth;
          counterRef.current.classList.add('counter-flash');
        }
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const vb = window.scrollY + window.innerHeight;
      if (vb < sTop || window.scrollY > sTop + sHeight) return;
      if (frameId !== 0) return;
      frameId = requestAnimationFrame(sync);
    };

    const handleResize = () => { updateMetrics(); handleScroll(); };

    updateMetrics();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    sync();

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, containerRef, count]);

  return { textRefs, photoRefs, counterRef };
}
