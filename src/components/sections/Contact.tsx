// ============================================
// ASSE ZERO — Contact Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';
import { ContactBlock } from '@/components/contact/ContactBlock';

export function Contact() {
  return (
    <section
      id={SECTION_IDS.contact}
      className="w-full min-h-screen bg-dark text-white flex flex-col items-center justify-center py-24"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter mb-4 text-primary">
          CONTATTI
        </h2>
        <p className="text-white/60 text-base sm:text-lg mb-12 max-w-lg">
          Raccontaci il tuo progetto. Ti risponderemo entro 24 ore.
        </p>

        <ContactBlock />
      </div>
    </section>
  );
}
