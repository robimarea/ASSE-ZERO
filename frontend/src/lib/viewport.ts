/**
 * Altezza del viewport dinamico in px (equivale a 100dvh).
 *
 * Unico punto di lettura JS: tutta la geometria scroll (MaskChange,
 * maskProgress, scrollTo) deve usare questa misura, e il CSS deve
 * usare l'unità corrispondente (h-dvh / 100dvh). Mai mischiare con
 * 100vh o 100svh: su mobile divergono quando la barra URL collassa.
 *
 * Si usa documentElement.clientHeight (layout viewport) e non
 * window.innerHeight: su iOS innerHeight segue il visual viewport
 * (pinch-zoom, tastiera) e divergerebbe da 100dvh.
 */
export function getViewportHeight(): number {
  return document.documentElement.clientHeight;
}
