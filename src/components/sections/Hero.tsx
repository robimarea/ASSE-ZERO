// ============================================
// ASSE ZERO — Hero Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';

export function Hero() {
  return (
    <section
      id={SECTION_IDS.home}
      className="w-full min-h-screen bg-secondary text-dark flex flex-col items-center justify-center"
    >
      <div className="text-center px-4 w-full flex flex-col items-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-heading font-black tracking-tighter mb-4 text-dark font-sans" style={{lineHeight: 0.9}}>
          Video &amp; Media
        </h1>
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto flex justify-center -mt-4 sm:-mt-8 md:-mt-12">
           <img src="/logo.png" alt="ASSE ZERO Logo" className="w-[80%] h-auto drop-shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
