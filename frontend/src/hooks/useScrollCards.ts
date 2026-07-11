import { useRef, useEffect, useCallback } from 'react';
import { clamp } from '@/lib/math';
import { useCarouselTravel } from '@/hooks/useCarouselTravel';
import { useInViewport } from '@/hooks/useInViewport';

interface Options {
  count: number;
  isVisible: boolean;
  paragraphRef?: React.RefObject<HTMLDivElement | null>;
}

const TRAVEL_TWEEN_DURATION = 0.92;

export function useScrollCards({ count, isVisible, paragraphRef }: Options) {
  const cardRefs     = useRef<(HTMLElement | null)[]>([]);
  const overlayRefs  = useRef<(HTMLElement | null)[]>([]);
  const textRefs     = useRef<(HTMLElement | null)[]>([]);
  const gradientRefs = useRef<(HTMLElement | null)[]>([]);
  const numberRefs   = useRef<(HTMLElement | null)[]>([]);

  const applyTravel = useCallback((travel: number) => {
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
      card.style.transform = `translate3d(${-(distance * distance * 1.44) * 6}vw, ${relative * 45}vh, 0) scale(${clamp(1 - distance * 0.25, 0.5, 1)}) rotateZ(${relative * -4}deg)`;
      card.style.opacity   = `${clamp(1.2 - distance * 0.4, 0, 1)}`;
      card.style.zIndex    = isActive ? '20' : `${10 - Math.floor(distance)}`;

      const overlay  = overlayRefs.current[index];
      const text     = textRefs.current[index];
      const gradient = gradientRefs.current[index];
      const number   = numberRefs.current[index];

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
  }, []);

  const travel = useCarouselTravel({
    count,
    isVisible,
    applyTravel,
    tweenDuration: TRAVEL_TWEEN_DURATION,
  });

  /* ── Reveal del paragrafo introduttivo (indipendente dal travel) ── */
  const fallbackParaRef = useRef<HTMLDivElement | null>(null);
  const paraRef = paragraphRef ?? fallbackParaRef;
  const isParaVisible = useInViewport(paraRef, { threshold: 0.15 });

  useEffect(() => {
    const paraEl = paraRef.current;
    if (!paraEl) return;
    paraEl.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    paraEl.style.opacity = isParaVisible ? '1' : '0';
    paraEl.style.transform = isParaVisible ? 'translateY(0)' : 'translateY(32px)';
  }, [paraRef, isParaVisible]);

  return {
    cardRefs,
    overlayRefs,
    textRefs,
    gradientRefs,
    numberRefs,
    ...travel,
  };
}
