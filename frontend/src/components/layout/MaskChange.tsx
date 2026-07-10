import { useRef, useEffect, useMemo, type ReactNode } from 'react';

const MAX_LAYERS = 60;

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

  /*
   * Calcola l'altezza iniziale senza useState per evitare flash di layout.
   * Il wrapper deve essere alto (1 + extraStickyDistanceH) * 100vh per creare
   * lo spazio di scroll necessario all'effetto sticky.
   */
  const initialHeight = useMemo(
    () => `${(1 + extraStickyDistanceH) * (typeof window !== 'undefined' ? window.innerHeight : 800)}px`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* ── Aggiorna l'altezza al resize ── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const update = () => {
      wrapper.style.minHeight = `${(1 + extraStickyDistanceH) * window.innerHeight}px`;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [extraStickyDistanceH]);

  /* ── Scroll handler: gestisce clipPath, opacità e z-index ── */
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let rafId = 0;
    let vh = window.innerHeight;

    /* Cache della linea neon — elemento statico, non viene mai ricreato */
    const lineEl = wrapperRef.current?.querySelector<HTMLDivElement>('[data-wipe-line="true"]') ?? null;

    const handleScroll = () => {
      const wrapper  = wrapperRef.current;
      const curtain  = curtainRef.current;
      const content  = contentRef.current;
      if (!wrapper || !curtain) return;

      const rect            = wrapper.getBoundingClientRect();
      const wrapperH        = rect.height;
      const pendingUp       = window.scrollY < lastScrollY;
      lastScrollY           = window.scrollY;

      /* pct: 0 = wrapper appena entrato, 1 = wrapper quasi uscito */
      const scrollProgress  = -rect.top;
      const totalRange      = wrapperH - vh;
      const pct             = totalRange > 0
        ? Math.max(0, Math.min(1, scrollProgress / totalRange))
        : 0;

      /* z-index dinamico sul wrapper per gestire la risalita */
      wrapper.style.zIndex = pendingUp
        ? String(MAX_LAYERS + layerOrder)
        : String(layerOrder);

      /* ── PRIMO LAYER: Hero → Showreel ──
       * Nessun wipe-in: la curtain è visibile dall'inizio.
       * Wipe-out nella fase intermedia (pct 0.55 -> 0.75).
       * Children stabili e visibili nella fase finale (pct > 0.75). */
      if (isFirstLayer) {
        if (pct > 0.75) {
          /* Fase 3 – curtain completamente nascosta, children stabili e visibili */
          curtain.style.clipPath = 'inset(0% 0% 100% 0%)';
          if (content) {
            content.style.opacity    = '1';
            content.style.visibility = 'visible';
          }
          if (lineEl) lineEl.style.display = 'none';
        } else if (pct > 0.55) {
          /* Fase 2 – curtain esce dal basso (wipe-out) */
          const exitProg        = (pct - 0.55) / 0.20;
          const clipBottom      = exitProg * 100;
          curtain.style.clipPath = `inset(0% 0% ${clipBottom}% 0%)`;
          if (content) {
            content.style.opacity    = '1';
            content.style.visibility = 'visible';
          }
          if (lineEl) {
            if (pct < 0.74) {
              lineEl.style.display   = 'block';
              lineEl.style.top       = 'auto';
              lineEl.style.bottom    = `${clipBottom}%`;
              lineEl.style.boxShadow = '0 -2px 10px rgba(169,15,33,0.6),0 0 15px 4px rgba(169,15,33,0.85),0 -10px 25px rgba(0,0,0,0.7)';
            } else {
              lineEl.style.display = 'none';
            }
          }
        } else {
          /* Fase 1 – curtain stabile e visibile (Hero) */
          curtain.style.clipPath = 'inset(0% 0% 0% 0%)';
          if (content) {
            content.style.opacity    = '0';
            content.style.visibility = 'hidden';
          }
          if (lineEl) lineEl.style.display = 'none';
        }

      /* ── LAYER SUCCESSIVI: doppio Wipe-In + Stabile + Wipe-Out + Stabile Children ── */
      } else {
        if (pct < 0.20) {
          /* Fase 1 – curtain entra dall'alto (wipe-in) */
          const entryProg       = pct / 0.20;
          const clipTop         = (1 - entryProg) * 100;
          curtain.style.clipPath = `inset(${clipTop}% 0% 0% 0%)`;
          if (content) {
            content.style.opacity    = '0';
            content.style.visibility = 'hidden';
          }
          if (lineEl) {
            if (pct > 0.01) {
              lineEl.style.display   = 'block';
              lineEl.style.bottom    = 'auto';
              lineEl.style.top       = `${clipTop}%`;
              lineEl.style.boxShadow = '0 2px 10px rgba(169,15,33,0.6),0 0 15px 4px rgba(169,15,33,0.85),0 10px 25px rgba(0,0,0,0.7)';
            } else {
              lineEl.style.display = 'none';
            }
          }
        } else if (pct < 0.55) {
          /* Fase 2 – curtain stabile, children nascosti */
          curtain.style.clipPath = 'inset(0% 0% 0% 0%)';
          if (content) {
            content.style.opacity    = '0';
            content.style.visibility = 'hidden';
          }
          if (lineEl) lineEl.style.display = 'none';
        } else if (pct < 0.75) {
          /* Fase 3 – curtain esce dal basso (wipe-out) */
          const exitProg        = (pct - 0.55) / 0.20;
          const clipBottom      = exitProg * 100;
          curtain.style.clipPath = `inset(0% 0% ${clipBottom}% 0%)`;
          if (content) {
            content.style.opacity    = '1';
            content.style.visibility = 'visible';
          }
          if (lineEl) {
            if (pct < 0.74) {
              lineEl.style.display   = 'block';
              lineEl.style.top       = 'auto';
              lineEl.style.bottom    = `${clipBottom}%`;
              lineEl.style.boxShadow = '0 -2px 10px rgba(169,15,33,0.6),0 0 15px 4px rgba(169,15,33,0.85),0 -10px 25px rgba(0,0,0,0.7)';
            } else {
              lineEl.style.display = 'none';
            }
          }
        } else {
          /* Fase 4 – curtain completamente nascosta, children stabili e visibili */
          curtain.style.clipPath = 'inset(0% 0% 100% 0%)';
          if (content) {
            content.style.opacity    = '1';
            content.style.visibility = 'visible';
          }
          if (lineEl) lineEl.style.display = 'none';
        }
      }

      /* ── Pointer-events: solo chi è visibile cattura i click ── */
      if (pct <= 0.05) {
        curtain.style.pointerEvents = isFirstLayer ? 'auto' : 'none';
        if (content) content.style.pointerEvents = isFirstLayer ? 'none' : 'auto';
      } else if (pct >= 0.75) {
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

    const onResize = () => { vh = window.innerHeight; handleScroll(); };

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
      className="relative w-full font-sans"
      style={{
        minHeight: initialHeight,
        marginTop: overlapPrev ? '-100vh' : '0',
        zIndex: layerOrder,
      }}
    >
      {/*
       * ┌─────────────────────────────────────────────────────┐
       * │  UN SOLO div sticky per layer.                      │
       * │  Dentro: children e curtain sono entrambi           │
       * │  absolute inset-0, sovrapposti.                     │
       * │  Nessun secondo sticky → zero sezioni "allungate".  │
       * └─────────────────────────────────────────────────────┘
       */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
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
