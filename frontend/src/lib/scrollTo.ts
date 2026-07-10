import { getLenis } from '@/lib/lenis';

export function scrollToSection(id: string): void {
  const lenis = getLenis();

  if (id === 'home') {
    lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const element = document.getElementById(id);
  if (!element) return;

  const maskWrapper = element.closest('[data-mask-wrapper="true"]') as HTMLElement | null;
  if (maskWrapper) {
    // Target pct=0.80 (stable-content phase): wrapperTop + 0.80 * (wrapperH - vh)
    const wrapperTop = maskWrapper.getBoundingClientRect().top + window.scrollY;
    const wrapperH   = maskWrapper.offsetHeight;
    const vh         = window.innerHeight;
    const target     = wrapperTop + 0.80 * (wrapperH - vh);
    lenis ? lenis.scrollTo(target) : window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    lenis ? lenis.scrollTo(element) : element.scrollIntoView({ behavior: 'smooth' });
  }
}
