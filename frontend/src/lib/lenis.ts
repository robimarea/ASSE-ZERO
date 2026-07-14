import Lenis from 'lenis';

let instance: Lenis | null = null;

export function createLenis(): Lenis {
  instance = new Lenis({
    duration: 1.8,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.55,
    touchMultiplier: 1.2,
  });
  return instance;
}

export function destroyLenis(): void {
  instance?.destroy();
  instance = null;
}

export function getLenis(): Lenis | null {
  return instance;
}
