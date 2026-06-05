import { forwardRef, type ComponentPropsWithoutRef, type ReactNode, type CSSProperties } from 'react';

export const MASK_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

type RevealProps = {
  isRevealed: boolean;
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

/** Blocco display con clip reveal verticale (righe impilate) */
export function MaskRevealLine({
  children,
  isRevealed,
  delay = 0,
  className = '',
  style,
}: RevealProps & { children: ReactNode; style?: CSSProperties }) {
  return (
    <span className={`mask-reveal-clip ${className}`.trim()} style={style}>
      <span
        style={{
          display: 'block',
          transform: isRevealed ? 'translateY(0)' : 'translateY(105%)',
          transition: `transform 0.85s ${MASK_EXPO} ${delay}ms`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/** Parola / logo inline nel titolo (Perchè scegliere) */
export function MaskRevealInline({
  children,
  isRevealed,
  delay = 0,
  className = '',
}: RevealProps & { children: ReactNode }) {
  return (
    <span className={`mask-reveal-clip mask-reveal-clip--inline ${className}`.trim()}>
      <span
        style={{
          display: 'block',
          transform: isRevealed ? 'translateY(0)' : 'translateY(110%)',
          transition: `transform 0.85s ${MASK_EXPO} ${delay}ms`,
        }}
      >
        {children}
      </span>
    </span>
  );
}

/** Evidenza rossa corsiva nel corpo (stessa size del paragrafo) */
export function MaskEm({ children }: { children: ReactNode }) {
  return <strong className="mask-em">{children}</strong>;
}

/** Grassetto scuro in liste (Target, bullet) */
export function MaskListStrong({ children }: { children: ReactNode }) {
  return <strong className="mask-list-strong">{children}</strong>;
}

export const MaskCurtain = forwardRef<HTMLElement, ComponentPropsWithoutRef<'section'>>(
  function MaskCurtain({ className = '', children, ...props }, ref) {
    return (
      <section ref={ref} className={`mask-curtain ${className}`.trim()} {...props}>
        {children}
      </section>
    );
  }
);
