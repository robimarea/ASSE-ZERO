// ============================================
// ASSE ZERO — Navbar
// Overlay parziale da destra, testo outline
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { navLinks } from '@/data/navigation';
import DarkVeil from '@/components/DarkVeil';
import { useActiveSection } from '@/hooks/useActiveSection';

const PANEL_WIDTH = '75%';
const EASING = 'cubic-bezier(0.76, 0, 0.24, 1)';
const DURATION = '0.6s';
const HIDE_DELAY = 2500;
const TOP_ZONE = 72; // px dal bordo superiore per riattivare

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [navHidden, setNavHidden] = useState(false);
  const activeSection = useActiveSection();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showNav = useCallback((startTimer = true) => {
    setNavHidden(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (startTimer) {
      hideTimer.current = setTimeout(() => setNavHidden(true), HIDE_DELAY);
    }
  }, []);

  // Auto-hide on mount, show on mouse near top
  useEffect(() => {
    hideTimer.current = setTimeout(() => setNavHidden(true), HIDE_DELAY);
    const onMove = (e: MouseEvent) => {
      if (e.clientY < TOP_ZONE) showNav();
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [showNav]);

  // Menu aperto → sempre visibile
  useEffect(() => {
    if (open) showNav(false);
    else showNav();
  }, [open, showNav]);

  // Blocca scroll e interazione col resto della pagina
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const handleNavClick = (href: string) => {
    close();
    const id = href.replace('#', '');
    setTimeout(() => {
      if (id === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(id);
        if (element) {
          const maskWrapper = element.closest('[data-mask-wrapper="true"]');
          if (maskWrapper) {
            // Il curtain è alto 100vh. Scrolliamo al top del wrapper + altezza viewport
            // in modo che il curtain venga completamente rimosso.
            const wrapperTop = maskWrapper.getBoundingClientRect().top + window.scrollY;
            const targetScroll = wrapperTop + window.innerHeight;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
          } else {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }, 450);
  };

  return (
    <>
      {/* ── LOGO 2D (Top Left) ── */}
      <div
        className="navbar-logo"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 197,
          padding: '18px 0px',
          pointerEvents: 'none',
          transform: navHidden ? 'translateY(-120%)' : 'translateY(0)',
        }}
      >
        <img
          src="/logo.png"
          alt="ASSE ZERO"
          style={{ height: '64px', width: 'auto', display: 'block' }}
        />
      </div>

      {/* ── TRIGGER ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Apri menu"
        aria-expanded={open}
        className="navbar-trigger-btn cursor-target"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 197,
          background: 'transparent',
          border: 'none',
          cursor: 'none',
          padding: '18px 32px',
          opacity: open ? 0 : 1,
          pointerEvents: open || navHidden ? 'none' : 'auto',
          transform: navHidden ? 'translateY(-120%)' : 'translateY(0)',
          transition: 'opacity 0.3s ease',
        }}
      >
        <span style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 700, fontSize: '24px', color: '#edf2f4', letterSpacing: '2px', textTransform: 'uppercase' }}>Menù</span>
      </button>

      {/* ── BACKDROP semitrasparente (lato sinistro) ── */}
      <div
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 198,
          background: 'rgba(0,0,0,0.55)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: `opacity ${DURATION} ${EASING}`,
        }}
        aria-hidden="true"
      />

      {/* ── PANNELLO OVERLAY con DarkVeil come sfondo ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: PANEL_WIDTH,
          height: '100vh',
          zIndex: 199,
          transform: open ? 'translateX(0%)' : 'translateX(100%)',
          transition: `transform ${DURATION} ${EASING}`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu di navigazione"
        aria-hidden={!open}
      >
        {/* DarkVeil sfondo — tonalità rossa */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {open && (
            <>
              <DarkVeil
                speed={3}
                hueShift={211}
                noiseIntensity={0}
                scanlineFrequency={5}
                scanlineIntensity={0.15}
                warpAmount={4.3}
              />
              {/* Overlay blu navy */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(8,18,58,0.55)',
                pointerEvents: 'none',
              }} />
            </>
          )}
        </div>

        {/* Contenuto sopra DarkVeil */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header pannello */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '18px 24px',
            gap: '12px',
          }}>
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Chiudi menu"
              className="cursor-target"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#edf2f4',
                cursor: 'none',
                fontSize: '32px',
                fontWeight: 200,
                lineHeight: 1,
                padding: '8px 12px',
              }}
            >
              ×
            </button>
          </div>

          {/* Voci di navigazione */}
          <nav style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingRight: '8vw',
            paddingLeft: '4vw',
            gap: '4px',
          }}>
            {navLinks.map((link) => {
              const isHovered = hovered === link.href;
              const isActive = activeSection === link.href.replace('#', '');
              const isSelected = isHovered || isActive;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  onMouseEnter={() => setHovered(link.href)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-target"
                  style={{
                    display: 'inline-block',
                    fontSize: 'clamp(2.6rem, 6.5vw, 6.5rem)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em',
                    color: isSelected ? 'var(--color-primary)' : 'transparent',
                    WebkitTextStroke: isSelected ? '0px transparent' : '1.5px rgba(255,255,255,0.85)',
                    transition: 'color 0.4s ease, -webkit-text-stroke-color 0.4s ease',
                    cursor: 'none',
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Footer pannello */}
          <div style={{ padding: '24px 8vw 24px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
              © {new Date().getFullYear()} Asse Zero
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
