export function scrollToSection(id: string): void {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const element = document.getElementById(id);
  if (!element) return;
  const maskWrapper = element.closest('[data-mask-wrapper="true"]');
  if (maskWrapper) {
    const wrapperTop = maskWrapper.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: wrapperTop + window.innerHeight, behavior: 'smooth' });
  } else {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
