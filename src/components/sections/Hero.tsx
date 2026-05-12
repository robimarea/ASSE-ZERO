// ============================================
// ASSE ZERO — Hero Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';
import { Logo3D } from '@/components/Logo3D';

export function Hero() {
  return (
    <section
      id={SECTION_IDS.home}
      className="w-full min-h-screen bg-dark text-white relative overflow-visible"
    >
      {/* Logo 3D: absolute in cima, fuori dal flusso, non clippato */}
      <div
        className="absolute top-0 left-0 w-full flex justify-center z-10 overflow-visible"
        style={{ pointerEvents: 'auto' }}
      >
        <Logo3D />
      </div>

      {/* Testo centrato sotto il logo - padding-top compensa l'altezza del logo */}
      <div
        className="relative z-0 flex flex-col items-center justify-end w-full min-h-screen pb-16"
      >
        <h1
          className="text-primary uppercase font-black leading-none text-center"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3rem, 12vw, 9rem)',
            textShadow: '0 0 20px rgba(0,0,0,0.5)',
            WebkitTextStroke: '2px var(--color-dark)'
          }}
        >
          Video &amp; Media
        </h1>
      </div>
    </section>
  );
}
