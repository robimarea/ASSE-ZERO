import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { clamp } from '@/lib/math';

interface Options {
  count: number;
  isVisible: boolean;
  /** Applica lo stato visivo per un travel continuo (0..count-1). Deve essere stabile (useCallback). */
  applyTravel: (travel: number) => void;
  /** Notificato quando cambia l'indice attivo. Deve essere stabile (useCallback). */
  onActiveChange?: (active: number) => void;
  tweenDuration?: number;
}

/**
 * Motore condiviso dei caroselli (VideoGallery, Team): travel continuo
 * animato con GSAP, indice attivo derivato e navigazione via bottoni.
 */
export function useCarouselTravel({
  count,
  isVisible,
  applyTravel,
  onActiveChange,
  tweenDuration = 0.75,
}: Options) {
  const activeIndexRef = useRef(0);
  const travelRef      = useRef({ value: 0 });
  const travelTweenRef = useRef<gsap.core.Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const update = useCallback(
    (travel: number) => {
      applyTravel(travel);
      const active = clamp(Math.round(travel), 0, count - 1);
      if (active !== activeIndexRef.current) {
        activeIndexRef.current = active;
        setActiveIndex(active);
        onActiveChange?.(active);
      }
    },
    [applyTravel, onActiveChange, count],
  );

  const goToIndex = useCallback(
    (index: number) => {
      const goal = clamp(index, 0, count - 1);
      travelTweenRef.current?.kill();

      if (Math.abs(goal - travelRef.current.value) < 0.001) {
        travelRef.current.value = goal;
        update(goal);
        return;
      }

      travelTweenRef.current = gsap.to(travelRef.current, {
        value: goal,
        duration: tweenDuration,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onUpdate: () => update(travelRef.current.value),
      });
    },
    [update, count, tweenDuration],
  );

  const goNext = useCallback(() => {
    goToIndex(activeIndexRef.current + 1);
  }, [goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex(activeIndexRef.current - 1);
  }, [goToIndex]);

  useEffect(() => {
    if (isVisible) {
      update(travelRef.current.value);
    }
    return () => {
      travelTweenRef.current?.kill();
    };
  }, [isVisible, update]);

  return {
    activeIndex,
    goNext,
    goPrev,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < count - 1,
  };
}
