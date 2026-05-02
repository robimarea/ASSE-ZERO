import { useRef, ReactNode, memo, ElementType } from 'react';
import { useInViewport } from '@/hooks/useInViewport';

interface ViewportProps {
  children: ReactNode | ((isVisible: boolean) => ReactNode);
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  reveal?: boolean;
  stagger?: boolean;
  className?: string;
  id?: string;
  as?: ElementType;
}

/**
 * A wrapper component that detects visibility and provides it to children.
 * Useful for performance optimization and triggering animations.
 */
export const Viewport = memo(({
  children,
  threshold = 0.01,
  rootMargin = '10% 0px 10% 0px',
  once = false,
  reveal = false,
  stagger = false,
  className = '',
  id,
  as: Component = 'section'
}: ViewportProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const isVisible = useInViewport(containerRef, { threshold, rootMargin, once });

  const classes = [
    'viewport-container',
    reveal ? 'viewport-reveal' : '',
    stagger ? 'stagger-children' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component
      ref={containerRef as any}
      id={id}
      className={classes}
      data-visible={isVisible}
    >
      {typeof children === 'function' ? children(isVisible) : children}
    </Component>
  );
});
