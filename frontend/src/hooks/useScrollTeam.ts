import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { clamp } from '@/lib/math';
import { attachCarouselWheelWhenReady } from '@/lib/carouselWheel';

interface Options {
  containerRef: React.RefObject<HTMLElement | null>;
  count: number;
  isVisible: boolean;
}

export function useScrollTeam({ containerRef, count, isVisible }: Options) {
  const textRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef     = useRef<HTMLSpanElement | null>(null);
  const activeIndexRef = useRef(0);
  const travelRef      = useRef(0);
  const travelProxy    = useRef({ value: 0 });
  const travelTweenRef = useRef<gsap.core.Tween | null>(null);
  const prevPointerRef = useRef<(boolean | null)[]>(new Array(count).fill(null));

  const [activeIndex, setActiveIndex] = useState(0);

  const applyTravel = useCallback(
    (travel: number) => {
      const active = clamp(Math.round(travel), 0, count - 1);

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

      photoRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(i - travel);
        const photoOpacity = clamp(1 - dist, 0, 1);
        const photoScale = clamp(1 - dist * 0.03, 0.97, 1);
        el.style.opacity = photoOpacity.toFixed(3);
        el.style.transform = `scale(${photoScale.toFixed(3)})`;
      });

      if (active !== activeIndexRef.current) {
        activeIndexRef.current = active;
        setActiveIndex(active);

        if (counterRef.current) {
          counterRef.current.textContent = `${active + 1}`;
          counterRef.current.classList.remove('counter-flash');
          void (counterRef.current as HTMLElement).offsetWidth;
          counterRef.current.classList.add('counter-flash');
        }
      }
    },
    [count]
  );

  const animateToTravel = useCallback(
    (target: number) => {
      const goal = clamp(target, 0, count - 1);
      travelTweenRef.current?.kill();

      if (Math.abs(goal - travelRef.current) < 0.001) {
        travelRef.current = goal;
        travelProxy.current.value = goal;
        applyTravel(goal);
        return;
      }

      travelProxy.current.value = travelRef.current;
      travelTweenRef.current = gsap.to(travelProxy.current, {
        value: goal,
        duration: 0.75,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onUpdate: () => {
          travelRef.current = travelProxy.current.value;
          applyTravel(travelRef.current);
        },
        onComplete: () => {
          travelRef.current = goal;
          travelProxy.current.value = goal;
          applyTravel(goal);
        },
      });
    },
    [applyTravel, count]
  );

  const goToIndex = useCallback(
    (index: number) => animateToTravel(index),
    [animateToTravel]
  );

  const goNext = useCallback(() => {
    goToIndex(activeIndexRef.current + 1);
  }, [goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex(activeIndexRef.current - 1);
  }, [goToIndex]);

  useEffect(() => {
    if (isVisible) {
      applyTravel(travelRef.current);
    }
    return () => {
      travelTweenRef.current?.kill();
    };
  }, [applyTravel, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    return attachCarouselWheelWhenReady(containerRef.current, {
      count,
      getTravel: () => travelRef.current,
      getActiveIndex: () => activeIndexRef.current,
      goToIndex,
    });
  }, [isVisible, containerRef, count, goToIndex]);



  return {
    textRefs,
    photoRefs,
    counterRef,
    activeIndex,
    goNext,
    goPrev,
    canGoNext: activeIndex < count - 1,
    canGoPrev: activeIndex > 0,
  };
}
