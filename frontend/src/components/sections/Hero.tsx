// ============================================
// ASSE ZERO — Hero Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';
import { Logo3D } from '@/components/Logo3D';
import { Viewport } from '@/components/layout/Viewport';

export function Hero() {
  return (
    <section
      id={SECTION_IDS.home}
      className="w-full min-h-screen bg-primary text-white relative overflow-visible"
    >
      {/* Logo 3D: absolute in cima, fuori dal flusso, non clippato */}
      <div
        className="absolute top-0 left-0 w-full flex justify-center z-10 overflow-visible"
        style={{ pointerEvents: 'auto' }}
      >
        <Viewport threshold={0.1}>
          {(isVisible) => <Logo3D isVisible={isVisible} />}
        </Viewport>
      </div>

      {/* Testo centrato sotto il logo */}
      <div
        className="relative z-0 flex flex-col items-center justify-center md:justify-end w-full min-h-screen pt-[38vh] md:pt-0 pb-10 md:pb-16"
      >
        <h1
          className="text-white uppercase font-black leading-none text-center"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            textShadow: '0 0 20px rgba(0,0,0,0.2)',
          }}
        >
          Video & Media
        </h1>
      </div>
    </section>
  );
}
