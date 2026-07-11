import { getLenis } from '@/lib/lenis';
import { MASK_PHASES, scrollYForMaskProgress } from '@/lib/maskProgress';
import { getViewportHeight } from '@/lib/viewport';

function scrollToTop(top: number): void {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(top);
  else window.scrollTo({ top, behavior: 'smooth' });
}

export function scrollToSection(id: string): void {
  if (id === 'home') {
    scrollToTop(0);
    return;
  }

  const element = document.getElementById(id);
  if (!element) return;

  const maskWrapper = element.closest('[data-mask-wrapper="true"]') as HTMLElement | null;
  if (maskWrapper) {
    /* Atterra nella fase di contenuto stabile (dopo il wipe-out del curtain) */
    scrollToTop(scrollYForMaskProgress(maskWrapper, MASK_PHASES.contentStable, getViewportHeight()));
    return;
  }

  const lenis = getLenis();
  if (lenis) lenis.scrollTo(element);
  else element.scrollIntoView({ behavior: 'smooth' });
}
