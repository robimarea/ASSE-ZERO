import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './sectionHeroTitle.css';

export type SectionHeroTitleVariant = 'video' | 'smm';

interface SectionHeroTitleProps {
  text: string;
  variant: SectionHeroTitleVariant;
  isVisible?: boolean;
  className?: string;
}

/** Titolo: reveal dal basso in entrata, esce verso l'alto in uscita (ripetibile) */
export function SectionHeroTitle({
  text,
  variant,
  isVisible = true,
  className = '',
}: SectionHeroTitleProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const words = text.trim().split(/\s+/);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const inners = root.querySelectorAll('.sht__word-inner');

    const ctx = gsap.context(() => {
      gsap.killTweensOf(inners);
      if (isVisible) {
        gsap.fromTo(
          inners,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
            ease: 'power2.out',
            overwrite: 'auto',
          },
        );
      } else {
        gsap.to(inners, {
          yPercent: -100,
          opacity: 0,
          duration: 0.45,
          stagger: 0.03,
          ease: 'power2.in',
          overwrite: 'auto',
        });
      }
    }, root);

    return () => ctx.revert();
  }, [isVisible]);

  return (
    <h2
      ref={rootRef}
      className={`sht sht--${variant} ${className}`.trim()}
    >
      <span className="sht__words">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="sht__word">
            <span className="sht__word-inner">{word}</span>
          </span>
        ))}
      </span>
    </h2>
  );
}
