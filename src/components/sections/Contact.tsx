// ============================================
// ASSE ZERO — Contact Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';

export function Contact() {
  return (
    <section id={SECTION_IDS.contact} className="w-full min-h-screen bg-secondary text-dark flex flex-col items-center justify-center py-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
        <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter mb-12">
          CONTATTI
        </h2>
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl opacity-50">
           <div className="flex-1 bg-dark/10 h-64 rounded-xl items-center justify-center flex font-bold tracking-widest text-dark/50">
              [ FORM PLACEHOLDER ]
           </div>
           <div className="flex-1 bg-dark/10 h-64 rounded-xl items-center justify-center flex font-bold tracking-widest text-dark/50">
              [ INFO PLACEHOLDER ]
           </div>
        </div>
      </div>
    </section>
  );
}
