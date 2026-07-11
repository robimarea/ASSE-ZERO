// ============================================
// ASSE ZERO — Footer Component
// Layout pulito a griglia, no scroll animation
// (la reveal è gestita da MaskChangeUI in App)
// ============================================

import { SITE_NAME, CONTACT_EMAIL, WHATSAPP_URL, INSTAGRAM_URL } from '@/lib/constants';
import { scrollToSection } from '@/lib/scrollTo';
import { IconEmail, IconWhatsApp, IconInstagram } from '@/components/ui/Icons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-dark text-white w-full px-6 md:px-12 lg:px-20"
      id="footer"
      style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div
        className="max-w-6xl mx-auto w-full"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingTop: 'clamp(3rem, 8vh, 6rem)', paddingBottom: 'clamp(1.5rem, 4vh, 3rem)' }}
      >

        {/* ── Top: Brand ── */}
        <div>
          <h3
            className="text-primary font-black tracking-tighter mb-4"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1 }}
          >
            {SITE_NAME}
          </h3>
          <p className="text-white/60 text-base md:text-lg max-w-lg leading-relaxed">
            Team creativo specializzato in produzione video professionale
            e social media management.
          </p>
        </div>

        {/* ── Middle: 3 columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 py-12 md:py-0">

          {/* Navigazione */}
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              Navigazione
            </p>
            <nav className="flex flex-col gap-3 md:gap-4">
              {['Home', 'Video', 'SMM', 'Team', 'Contatti'].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  onClick={(e) => { e.preventDefault(); scrollToSection(label.toLowerCase()); }}
                  className="text-white/70 hover:text-primary text-base md:text-lg font-medium transition-colors duration-300"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Servizi */}
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              Servizi
            </p>
            <div className="flex flex-col gap-3 md:gap-4">
              {['Produzione Video', 'Post-Produzione', 'Social Media Management', 'Content Strategy'].map((s) => (
                <span key={s} className="text-white/70 text-base md:text-lg font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Contatti */}
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              Contatti
            </p>
            <div className="flex flex-col gap-4">

              {/* Email */}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-white/70 hover:text-primary text-base md:text-lg font-medium transition-colors duration-300 flex items-center gap-3"
              >
                <IconEmail size={18} />
                {CONTACT_EMAIL}
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary text-base md:text-lg font-medium transition-colors duration-300 flex items-center gap-3"
              >
                <IconWhatsApp size={18} />
                WhatsApp
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary text-base md:text-lg font-medium transition-colors duration-300 flex items-center gap-3"
              >
                <IconInstagram size={18} />
                @assezero
              </a>

            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-white/30 text-xs tracking-wider">
            © {year} {SITE_NAME}. TUTTI I DIRITTI RISERVATI.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 hover:text-primary text-xs tracking-wider transition-colors">
              PRIVACY POLICY
            </a>
            <a href="#" className="text-white/30 hover:text-primary text-xs tracking-wider transition-colors">
              COOKIE POLICY
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
