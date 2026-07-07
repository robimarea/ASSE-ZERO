import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { clamp } from '@/lib/math';
import { onScrollSync } from '@/lib/scrollBridge';
import { attachCarouselWheelWhenReady } from '@/lib/carouselWheel';

interface Options {
  containerRef: React.RefObject<HTMLElement | null>;
  count: number;
  isVisible: boolean;
  paragraphRef?: React.RefObject<HTMLDivElement | null>;
  /** Se true, il carosello segue lo scroll della pagina. Default: rotella/controlli nella zona locale */
  scrollDriven?: boolean;
}

const TRAVEL_TWEEN_DURATION = 0.92;

export function useScrollCards({
  containerRef,
  count,
  isVisible,
  paragraphRef,
  scrollDriven = false,
}: Options) {
  const cardRefs       = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs    = useRef<(HTMLElement | null)[]>([]);
  const textRefs       = useRef<(HTMLElement | null)[]>([]);
  const gradientRefs   = useRef<(HTMLElement | null)[]>([]);
  const numberRefs     = useRef<(HTMLElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const travelRef      = useRef(0);
  const travelProxy    = useRef({ value: 0 });
  const travelTweenRef = useRef<gsap.core.Tween | null>(null);
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
        duration: TRAVEL_TWEEN_DURATION,
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
    [applyTravel, count],
  );

  const goToIndex = useCallback(
    (index: number) => animateToTravel(index),
    [animateToTravel],
  );

  const goNext = useCallback(() => {
    goToIndex(activeIndexRef.current + 1);
  }, [goToIndex]);

  const goPrev = useCallback(() => {
    goToIndex(activeIndexRef.current - 1);
  }, [goToIndex]);

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
      travelTweenRef.current?.kill();
      const scrollable  = Math.max(1, sHeight - window.innerHeight * 2);
      const scrolled    = Math.max(0, window.scrollY - sTop - window.innerHeight);
      const scrollProg  = clamp(scrolled / scrollable, 0, 1);
      const travel      = scrollProg * (count - 1);
      travelRef.current = travel;
      travelProxy.current.value = travel;
      applyTravel(travel);
    };

    const handleScroll = () => {
      if (!scrollDriven || !containerRef.current) return;
      const vb = window.scrollY + window.innerHeight;
      if (vb < sTop || window.scrollY > sTop + sHeight) return;
      if (frameId !== 0) return;
      frameId = requestAnimationFrame(syncFromPageScroll);
    };

    const paraEl = paragraphRef?.current;
    let paraObserver: IntersectionObserver | undefined;
    if (paraEl) {
      paraObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            paraEl.style.opacity = '1';
            paraEl.style.transform = 'translateY(0)';
          } else {
            paraEl.style.opacity = '0';
            paraEl.style.transform = 'translateY(32px)';
          }
        },
        { threshold: 0.15 },
      );
      paraEl.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
      paraObserver.observe(paraEl);
    }

    updateMetrics();
    travelProxy.current.value = travelRef.current;
    applyTravel(travelRef.current);

    let offLenisScroll = () => {};
    if (scrollDriven) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', () => {
        updateMetrics();
        handleScroll();
      }, { passive: true });
      offLenisScroll = onScrollSync(handleScroll);
      syncFromPageScroll();
    }

    let detachWheel = () => {};
    if (!scrollDriven) {
      detachWheel = attachCarouselWheelWhenReady(containerRef.current, {
        count,
        getTravel: () => travelRef.current,
        getActiveIndex: () => activeIndexRef.current,
        goToIndex,
      });
    }

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      travelTweenRef.current?.kill();
      offLenisScroll();
      detachWheel();
      if (scrollDriven) window.removeEventListener('scroll', handleScroll);
      paraObserver?.disconnect();
    };
  }, [isVisible, containerRef, count, paragraphRef, scrollDriven, applyTravel, goToIndex]);

  return {
    cardRefs,
    overlayRefs,
    textRefs,
    gradientRefs,
    numberRefs,
    activeIndex,
    activeIndexRef,
    goToIndex,
    goNext,
    goPrev,
    canGoPrev: activeIndex > 0,
    canGoNext: activeIndex < count - 1,
  };
}
