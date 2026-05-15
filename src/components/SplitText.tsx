import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

function splitIntoUnits(text: string, type: string): string[] {
  if (type.includes('chars')) return text.split('');
  if (type.includes('words')) return text.split(/(\s+)/);
  return [text];
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-50px',
  textAlign = 'center',
  tag = 'p',
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  // Aspetta fonts
  useEffect(() => {
    if (document.fonts.status === 'loaded') { setReady(true); return; }
    document.fonts.ready.then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !ref.current) return;
    const el = ref.current;

    // Costruisci span per ogni unità
    const units = splitIntoUnits(text, splitType).filter(u => u.length > 0);
    el.innerHTML = units
      .map(u =>
        u.trim() === ''
          ? '<span style="display:inline-block;white-space:pre"> </span>'
          : `<span class="split-unit" style="display:inline-block;will-change:transform,opacity">${u}</span>`
      )
      .join('');

    const targets = Array.from(el.querySelectorAll<HTMLElement>('.split-unit'));
    if (!targets.length) return;

    // Imposta stato iniziale
    gsap.set(targets, from as gsap.TweenVars);

    let triggered = false;
    const fire = () => {
      if (triggered) return;
      triggered = true;
      gsap.to(targets, {
        ...to,
        duration,
        ease: ease as string,
        stagger: delay / 1000,
        onComplete: onLetterAnimationComplete,
        clearProps: 'willChange',
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { fire(); observer.disconnect(); } },
      { threshold, rootMargin }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      gsap.killTweensOf(targets);
      el.innerHTML = text;
    };
  }, [ready, text, splitType, delay, duration, ease, threshold, rootMargin,
      JSON.stringify(from), JSON.stringify(to)]);

  const Tag = (tag || 'p') as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={`split-parent ${className}`}
      style={{ textAlign, display: 'block', whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {text}
    </Tag>
  );
};

export default SplitText;
