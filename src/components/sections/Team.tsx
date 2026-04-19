// ============================================
// ASSE ZERO — Team Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';

export function Team() {
  return (
    <section id={SECTION_IDS.team} className="w-full min-h-screen bg-dark flex flex-col items-center justify-center py-24">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center">
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black text-white mb-16 tracking-tighter text-center">
          IL NOSTRO TEAM
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-4xl">
          {[1, 2, 3].map((num) => (
            <div key={`team-${num}`} className="w-64 h-80 bg-gray-800 rounded-3xl overflow-hidden border-2 border-white/10 shadow-xl">
               <img 
                 src={`https://i.pravatar.cc/300?img=${num+10}`} 
                 alt={`Team placeholder ${num}`} 
                 className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
               />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
