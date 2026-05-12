// ============================================
// ASSE ZERO — Hero Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';
import { LogoSVG } from '@/components/LogoSVG';
import { Logo3D } from '@/components/Logo3D';

export function Hero() {
  return (
    <section
      id={SECTION_IDS.home}
      className="w-full min-h-screen bg-dark text-white flex flex-col items-center justify-center overflow-visible"
    >
      <div className="text-center px-4 w-full flex flex-col items-center max-w-5xl mx-auto">
        <LogoSVG 
          className="w-full h-auto max-w-4xl" 
          color="var(--color-primary)" 
          outlineColor="var(--color-dark)"
          outlineWidth={6}
        />

        <div className="flex justify-center -mt-8 sm:-mt-12 md:-mt-16 relative z-10">
          <Logo3D />
        </div>
      </div>
    </section>
  );
}
