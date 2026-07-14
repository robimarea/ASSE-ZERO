import { clamp } from '@/lib/math';

/**
 * Fasi dello scroll dentro un [data-mask-wrapper] (pct 0..1).
 * Unica fonte di verità per le soglie: MaskChange, useMaskCurtainReveal
 * e scrollTo derivano tutti da qui.
 */
export const MASK_PHASES = {
  /** Fine del wipe-in della curtain (solo layer > 0) */
  wipeInEnd: 0.2,
  /** Inizio del wipe-out della curtain */
  wipeOutStart: 0.55,
  /** Fine del wipe-out: da qui i children sono stabili e interattivi */
  wipeOutEnd: 0.75,
  /** Punto di atterraggio della navigazione (contenuto stabile) */
  contentStable: 0.8,
} as const;

/**
 * Isteresi dei reveal legati al curtain: si mostra a contentStable,
 * si nasconde sotto wipeOutEnd + REVEAL_HYSTERESIS.
 * Invariante da preservare ritarando le fasi:
 * contentStable > wipeOutEnd + REVEAL_HYSTERESIS.
 */
export const REVEAL_HYSTERESIS = 0.01;

/** Progresso 0..1 dello scroll nel wrapper: 0 = appena entrato, 1 = quasi uscito. */
export function getMaskProgress(wrapper: Element, vh: number): number {
  const rect = wrapper.getBoundingClientRect();
  const totalRange = rect.height - vh;
  if (totalRange <= 0) return 0;
  return clamp(-rect.top / totalRange, 0, 1);
}

/** Posizione assoluta di scroll corrispondente a un dato progresso del wrapper. */
export function scrollYForMaskProgress(wrapper: HTMLElement, pct: number, vh: number): number {
  const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
  return wrapperTop + pct * (wrapper.offsetHeight - vh);
}
