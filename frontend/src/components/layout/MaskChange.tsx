import { useRef, useEffect, type ReactNode } from 'react';
import { MASK_PHASES, getMaskProgress } from '@/lib/maskProgress';
import { getViewportHeight } from '@/lib/viewport';

const MAX_LAYERS = 60;
const { wipeInEnd, wipeOutStart, wipeOutEnd } = MASK_PHASES;

/* La linea neon sparisce poco prima del bordo della fase per non restare
   visibile a clip ormai completato (frazione di pct, non di fase). */
const WIPE_LINE_EPS = 0.01;

const GLOW_DOWN = '0 -2px 10px rgba(169,15,33,0.6),0 0 15px 4px rgba(169,15,33,0.85),0 -10px 25px rgba(0,0,0,0.7)';
const GLOW_UP   = '0 2px 10px rgba(169,15,33,0.6),0 0 15px 4px rgba(169,15,33,0.85),0 10px 25px rgba(0,0,0,0.7)';

function setContentVisible(content: HTMLElement | null, visible: boolean) {
  if (!content) return;
  content.style.opacity    = visible ? '1' : '0';
  content.style.visibility = visible ? 'visible' : 'hidden';
}

/* Curtain piena, children nascosti (fase stabile iniziale) */
function applyCurtainFull(curtain: HTMLElement, content: HTMLElement | null, lineEl: HTMLElement | null) {
  curtain.style.clipPath = 'inset(0% 0% 0% 0%)';
  setContentVisible(content, false);
  if (lineEl) lineEl.style.display = 'none';
}

/* Curtain completamente nascosta, children stabili e visibili */
function applyCurtainHidden(curtain: HTMLElement, content: HTMLElement | null, lineEl: HTMLElement | null) {
  curtain.style.clipPath = 'inset(0% 0% 100% 0%)';
  setContentVisible(content, true);
  if (lineEl) lineEl.style.display = 'none';
}

/* Curtain entra dall'alto (wipe-in, solo layer > 0) */
function applyWipeIn(pct: number, curtain: HTMLElement, content: HTMLElement | null, lineEl: HTMLElement | null) {
  const entryProg = pct / wipeInEnd;
  const clipTop   = (1 - entryProg) * 100;
  curtain.style.clipPath = `inset(${clipTop}% 0% 0% 0%)`;
  setContentVisible(content, false);
  if (lineEl) {
    if (pct > WIPE_LINE_EPS) {
      lineEl.style.display   = 'block';
      lineEl.style.bottom    = 'auto';
      lineEl.style.top       = `${clipTop}%`;
      lineEl.style.boxShadow = GLOW_UP;
    } else {
      lineEl.style.display = 'none';
    }
  }
}

/* Curtain esce dal basso (wipe-out), children visibili sotto */
function applyWipeOut(pct: number, curtain: HTMLElement, content: HTMLElement | null, lineEl: HTMLElement | null) {
  const exitProg   = (pct - wipeOutStart) / (wipeOutEnd - wipeOutStart);
  const clipBottom = exitProg * 100;
  curtain.style.clipPath = `inset(0% 0% ${clipBottom}% 0%)`;
  setContentVisible(content, true);
  if (lineEl) {
    if (pct < wipeOutEnd - WIPE_LINE_EPS) {
      lineEl.style.display   = 'block';
      lineEl.style.top       = 'auto';
      lineEl.style.bottom    = `${clipBottom}%`;
      lineEl.style.boxShadow = GLOW_DOWN;
    } else {
      lineEl.style.display = 'none';
    }
  }
}

interface MaskChangeProps {
  curtain: ReactNode;
  children: ReactNode;
  zIndex?: number;
  overlapPrev?: boolean;
  extraStickyDistanceH?: number;
  layerOrder?: number;
}

export function MaskChangeUI({
  curtain,
  children,
  zIndex = 10,
  overlapPrev = false,
  extraStickyDistanceH = 0,
  layerOrder = 0,
}: MaskChangeProps) {
  const curtainRef  = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);

  const isFirstLayer = layerOrder === 0;

  /* ── Scroll handler: gestisce clipPath, opacità e z-index ── */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId = 0;
    let vh = getViewportHeight();

    /* Cache della linea neon — elemento statico, non viene mai ricreato */
    const lineEl = wrapperRef.current?.querySelector<HTMLDivElement>('[data-wipe-line="true"]') ?? null;

    const handleScroll = () => {
      const wrapper  = wrapperRef.current;
      const curtain  = curtainRef.current;
      const content  = contentRef.current;
      if (!wrapper || !curtain) return;

      const pendingUp       = window.scrollY < lastScrollY;
      lastScrollY           = window.scrollY;

      /* pct: 0 = wrapper appena entrato, 1 = wrapper quasi uscito */
      const pct             = getMaskProgress(wrapper, vh);

      /* z-index dinamico sul wrapper per gestire la risalita */
      wrapper.style.zIndex = pendingUp
        ? String(MAX_LAYERS + layerOrder)
        : String(layerOrder);

      if (isFirstLayer) {
        /* ── PRIMO LAYER: Hero → Showreel ──
         * Nessun wipe-in: la curtain è visibile dall'inizio. */
        if (pct > wipeOutEnd)        applyCurtainHidden(curtain, content, lineEl);
        else if (pct > wipeOutStart) applyWipeOut(pct, curtain, content, lineEl);
        else                         applyCurtainFull(curtain, content, lineEl);
      } else {
        /* ── LAYER SUCCESSIVI: Wipe-In + Stabile + Wipe-Out + Stabile Children ── */
        if (pct < wipeInEnd)         applyWipeIn(pct, curtain, content, lineEl);
        else if (pct < wipeOutStart) applyCurtainFull(curtain, content, lineEl);
        else if (pct < wipeOutEnd)   applyWipeOut(pct, curtain, content, lineEl);
        else                         applyCurtainHidden(curtain, content, lineEl);
      }

      /* ── Pointer-events: solo chi è visibile cattura i click ── */
      if (pct <= 0.05) {
        curtain.style.pointerEvents = isFirstLayer ? 'auto' : 'none';
        if (content) content.style.pointerEvents = isFirstLayer ? 'none' : 'auto';
      } else if (pct >= wipeOutEnd) {
        curtain.style.pointerEvents = 'none';
        if (content) content.style.pointerEvents = 'auto';
      } else {
        curtain.style.pointerEvents = 'auto';
        if (content) content.style.pointerEvents = 'none';
      }
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(() => { rafId = 0; handleScroll(); });
    };

    const onResize = () => { vh = getViewportHeight(); handleScroll(); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    handleScroll(); // Calcolo sincrono iniziale

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [layerOrder, isFirstLayer]);

  return (
    <div
      ref={wrapperRef}
      data-mask-wrapper="true"
      className="relative w-full font-sans pointer-events-none"
      style={{
        /* (1 + extra) viewport di spazio scroll per lo sticky; in dvh il
           browser lo tiene in lockstep con sticky/curtain senza JS. */
        minHeight: `calc(${1 + extraStickyDistanceH} * 100dvh)`,
        marginTop: overlapPrev ? '-100dvh' : '0',
        zIndex: layerOrder,
      }}
    >
      {/*
       * ┌─────────────────────────────────────────────────────┐
       * │  UN SOLO div sticky per layer.                      │
       * │  Dentro: children e curtain sono entrambi           │
       * │  absolute inset-0, sovrapposti.                     │
       * │  Nessun secondo sticky → zero sezioni "allungate".  │
       * │  Wrapper e sticky sono pointer-events-none: i layer │
       * │  si sovrappongono (overlapPrev) e i contenitori     │
       * │  trasparenti non devono rubare il mouse al layer    │
       * │  sotto; curtain/children riattivano i pointer       │
       * │  events in base alla fase (handleScroll).           │
       * └─────────────────────────────────────────────────────┘
       */}
      <div
        className="sticky top-0 w-full h-dvh overflow-hidden pointer-events-none"
        style={{ zIndex }}
      >
        {/* ── Children (sotto) ── */}
        <div
          ref={contentRef}
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: zIndex - 1,
            /* Stato iniziale: nascosti finché il curtain non si apre. */
            opacity:    '0',
            visibility: 'hidden',
          }}
        >
          {children}
        </div>

        {/* ── Curtain (sopra) ── */}
        <div
          ref={curtainRef}
          data-mask-curtain="true"
          className="absolute inset-0 w-full h-full shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
          style={{
            zIndex,
            willChange: 'clip-path',
            /* Stato iniziale: layer 0 → completamente visibile;
               altri layer → completamente nascosti (il wipe-in li rivela). */
            clipPath: isFirstLayer ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
          }}
        >
          {curtain}
        </div>

        {/* ── Linea neon di transizione ── */}
        <div
          data-wipe-line="true"
          className="absolute left-0 w-full h-[2px] bg-[#a90f21] pointer-events-none"
          style={{ display: 'none', zIndex: zIndex + 1, bottom: '0%' }}
        />
      </div>
    </div>
  );
}
