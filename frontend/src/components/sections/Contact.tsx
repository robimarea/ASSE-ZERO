// ============================================
// ASSE ZERO — Contact Section
// ============================================

import { SECTION_IDS } from '@/lib/constants';
import { ContactBlock } from '@/components/contact/ContactBlock';

export function Contact() {
  return (
    <section
      id={SECTION_IDS.contact}
      className="w-full min-h-dvh bg-dark text-white flex flex-col items-center justify-center py-24"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter mb-12 text-primary">
          CONTATTI
        </h2>

        <ContactBlock />
      </div>
    </section>
  );
}
