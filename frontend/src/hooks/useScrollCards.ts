import { useRef, useEffect, useState, useCallback } from 'react';
import { clamp } from '@/lib/math';

interface Options {
  containerRef: React.RefObject<HTMLElement | null>;
  count: number;
  isVisible: boolean;
  paragraphRef?: React.RefObject<HTMLDivElement | null>;
  /** Card stack driven by wheel inside the section, not page scroll */
  decoupleFromPageScroll?: boolean;
}

/** ~1 video ogni 900–1100px di rotella (fluido, non a scatti) */
const WHEEL_SENSITIVITY = 0.00072;
/** Evita salti enormi con trackpad / Lenis in un solo evento */
const MAX_TRAVEL_PER_WHEEL = 0.1;

export function useScrollCards({
  containerRef,
  count,
  isVisible,
  paragraphRef,
  decoupleFromPageScroll = false,
}: Options) {
  const cardRefs       = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs    = useRef<(HTMLElement | null)[]>([]);
  const textRefs       = useRef<(HTMLElement | null)[]>([]);
  const gradientRefs   = useRef<(HTMLElement | null)[]>([]);
  const numberRefs     = useRef<(HTMLElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const travelRef      = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const applyTravel = useCallback(
    (travel: number) => {
      const newActive = clamp(Math.round(travel), 0, count - 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const relative = index - travel;
        const distance = Math.abs(relative);
        if (distance > 3) {
          if (card.style.display !== 'none') card.style.display = 'none';
          return;
        }
        if (card.style.display !== 'block') card.style.display = 'block';

        const isActive = distance < 0.5;
        card.style.transform = `translate3d(${5 - (distance * distance * 1.44) * 6}vw, ${relative * 45}vh, 0) scale(${clamp(1 - distance * 0.25, 0.5, 1)}) rotateZ(${relative * -4}deg)`;
        card.style.opacity   = `${clamp(1.2 - distance * 0.4, 0, 1)}`;
        card.style.zIndex    = isActive ? '20' : `${10 - Math.floor(distance)}`;

        const overlay = overlayRefs.current[index];
        const text    = textRefs.current[index];
        const gradient = gradientRefs.current[index];
        const number  = numberRefs.current[index];

        if (overlay) {
          overlay.style.opacity = `${clamp(distance * 0.85, 0, 1)}`;
          overlay.style.transform = `translate3d(${clamp(relative * 18, -36, 36)}%, 0, 0)`;
        }
        if (text) {
          text.style.opacity   = isActive ? '1' : '0';
          text.style.transform = isActive ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)';
          text.style.letterSpacing = isActive ? '0' : '0.06em';
        }
        if (gradient) {
          const ken = isActive ? 1.03 : clamp(1 - distance * 0.04, 0.96, 1);
          gradient.style.transform = `scale(${ken})`;
        }
        if (number) {
          number.style.opacity = `${clamp(0.12 - distance * 0.04, 0.02, 0.12)}`;
          number.style.transform = `translate3d(${relative * -8}%, 0, 0)`;
        }
      });

      if (newActive !== activeIndexRef.current) {
        activeIndexRef.current = newActive;
        setActiveIndex(newActive);
      }
    },
    [count],
  );

  useEffect(() => {
    if (!isVisible) return;

    let frameId = 0;
    let sTop = 0;
    let sHeight = 0;

    const updateMetrics = () => {
      if (!containerRef.current) return;
      const wrapper = containerRef.current.closest('[data-mask-wrapper]') as HTMLElement;
      if (wrapper) {
        sTop = Math.round(wrapper.getBoundingClientRect().top + window.scrollY);
        sHeight = wrapper.offsetHeight;
      }
    };

    const syncFromPageScroll = () => {
      frameId = 0;
      if (!containerRef.current) return;
      const scrollable  = Math.max(1, sHeight - window.innerHeight * 2);
      const scrolled    = Math.max(0, window.scrollY - sTop - window.innerHeight);
      const scrollProg  = clamp(scrolled / scrollable, 0, 1);
      const travel      = scrollProg * (count - 1);
      travelRef.current = travel;
      applyTravel(travel);
    };

    const handleScroll = () => {
      if (decoupleFromPageScroll) return;
      if (!containerRef.current) return;
      const vb = window.scrollY + window.innerHeight;
      if (vb < sTop || window.scrollY > sTop + sHeight) return;
      if (frameId !== 0) return;
      frameId = requestAnimationFrame(syncFromPageScroll);
    };

    const isSectionActive = () => {
      const section = containerRef.current;
      if (!section) return false;
      const rect = section.getBoundingClientRect();
      return rect.top <= 4 && rect.bottom >= window.innerHeight * 0.55;
    };

    const wheelDelta = (e: WheelEvent) => {
      let delta = e.deltaY;
      if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
      else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight * 0.85;
      return delta;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!decoupleFromPageScroll || !isSectionActive()) return;

      const rawDelta = wheelDelta(e);
      const travel = travelRef.current;
      const atStart = travel <= 0.01;
      const atEnd = travel >= count - 1 - 0.01;

      if ((rawDelta > 0 && atEnd) || (rawDelta < 0 && atStart)) return;

      e.preventDefault();
      e.stopPropagation();

      const step = clamp(rawDelta * WHEEL_SENSITIVITY, -MAX_TRAVEL_PER_WHEEL, MAX_TRAVEL_PER_WHEEL);
      const next = clamp(travel + step, 0, count - 1);
      travelRef.current = next;
      applyTravel(next);
    };

    const paraEl = paragraphRef?.current;
    if (paraEl) {
      paraEl.style.opacity    = '0';
      paraEl.style.transform  = 'translateY(48px)';
      paraEl.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            paraEl.style.opacity = '1';
            paraEl.style.transform = 'translateY(0)';
            observer.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      observer.observe(paraEl);
    }

    updateMetrics();
    applyTravel(travelRef.current);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      updateMetrics();
      if (!decoupleFromPageScroll) handleScroll();
    }, { passive: true });

    if (decoupleFromPageScroll) {
      window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    } else {
      syncFromPageScroll();
    }

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      if (decoupleFromPageScroll) {
        window.removeEventListener('wheel', handleWheel, true);
      }
    };
  }, [isVisible, containerRef, count, paragraphRef, decoupleFromPageScroll, applyTravel]);

  return { cardRefs, overlayRefs, textRefs, gradientRefs, numberRefs, activeIndex, activeIndexRef };
}
