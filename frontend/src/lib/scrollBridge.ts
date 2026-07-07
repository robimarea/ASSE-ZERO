type ScrollHandler = () => void;

const handlers = new Set<ScrollHandler>();

/** Lenis (e altri motori di scroll) notificano qui; gli hook scroll-driven si registrano. */
export function notifyScroll() {
  handlers.forEach((handler) => handler());
}

export function onScrollSync(handler: ScrollHandler) {
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}
