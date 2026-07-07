export function normalizeWheelDelta(e: WheelEvent): number {
  let delta = e.deltaY;
  if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
  else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight * 0.85;
  
  // Accelera leggermente il delta per migliore responsività
  return delta * (Math.abs(delta) > 100 ? 0.8 : 1);
}

interface CarouselWheelOptions {
  count: number;
  getTravel: () => number;
  getActiveIndex: () => number;
  goToIndex: (index: number) => void;
  cooldownMs?: number;
  minDelta?: number;
}

/** Intercetta la rotella solo con il puntatore sopra la zona (Lenis escluso). */
export function attachCarouselWheel(
  element: HTMLElement,
  {
    count,
    getTravel,
    getActiveIndex,
    goToIndex,
    cooldownMs = 320,
    minDelta = 4,
  }: CarouselWheelOptions,
): () => void {
  element.setAttribute('data-lenis-prevent-wheel', '');

  let pointerInside = false;
  let lastWheelTime = 0;

  const onPointerEnter = () => {
    pointerInside = true;
  };

  const onPointerLeave = () => {
    pointerInside = false;
  };

  const handler = (e: Event) => {
    if (!(e instanceof WheelEvent)) return;
    if (!pointerInside) return;

    const rawDelta = normalizeWheelDelta(e);
    if (Math.abs(rawDelta) < minDelta) return;

    const isScrollDown = rawDelta > 0;
    const travel = getTravel();
    const atStart = travel <= 0.05;
    const atEnd = travel >= count - 1 - 0.05;

    if ((isScrollDown && atEnd) || (!isScrollDown && atStart)) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const now = Date.now();
    if (now - lastWheelTime < cooldownMs) return;
    lastWheelTime = now;

    const active = getActiveIndex();
    goToIndex(
      isScrollDown
        ? Math.min(count - 1, active + 1)
        : Math.max(0, active - 1),
    );
  };

  element.addEventListener('pointerenter', onPointerEnter);
  element.addEventListener('pointerleave', onPointerLeave);
  element.addEventListener('wheel', handler, { passive: false, capture: true });

  return () => {
    element.removeAttribute('data-lenis-prevent-wheel');
    element.removeEventListener('pointerenter', onPointerEnter);
    element.removeEventListener('pointerleave', onPointerLeave);
    element.removeEventListener('wheel', handler, { capture: true });
  };
}

export function getCarouselScrollZone(container: HTMLElement | null): HTMLElement | null {
  if (!container) return null;
  return (
    container.querySelector<HTMLElement>('[data-carousel-scroll]')
    ?? container
  );
}

/** Attacca la rotella quando la zona DOM è pronta (ref + isVisible). */
export function attachCarouselWheelWhenReady(
  container: HTMLElement | null,
  options: CarouselWheelOptions,
): () => void {
  let detach = () => {};
  let rafId = 0;

  const tryAttach = () => {
    const zone = getCarouselScrollZone(container);
    if (!zone) return false;
    detach();
    detach = attachCarouselWheel(zone, options);
    return true;
  };

  if (!tryAttach()) {
    rafId = requestAnimationFrame(() => {
      tryAttach();
    });
  }

  return () => {
    if (rafId !== 0) cancelAnimationFrame(rafId);
    detach();
  };
}
