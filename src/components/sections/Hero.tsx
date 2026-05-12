// ============================================
// ASSE ZERO — Hero Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';
import { Logo3D } from '@/components/Logo3D';

export function Hero() {
  return (
    <section
      id={SECTION_IDS.home}
      className="w-full min-h-screen bg-secondary text-dark flex flex-col items-center justify-center"
    >
      <div className="text-center px-4 w-full flex flex-col items-center">
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-heading font-black tracking-tighter mb-4 text-dark font-sans"
          style={{ lineHeight: 0.9 }}
        >
          Video &amp; Media
        </h1>

        <div className="flex justify-center -mt-4 sm:-mt-8 md:-mt-12">
          <Logo3D />
        </div>
      </div>
    </section>
  );
}
