// ============================================
// ASSE ZERO — Footer Component
// Layout pulito a griglia, no scroll animation
// (la reveal è gestita da MaskChangeUI in App)
// ============================================

import { SITE_NAME, CONTACT_EMAIL, WHATSAPP_URL, INSTAGRAM_URL } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="bg-dark text-white w-full px-6 md:px-12 lg:px-20"
      id="footer"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      <div
        className="max-w-6xl mx-auto w-full"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, paddingTop: 'clamp(3rem, 8vh, 6rem)', paddingBottom: 'clamp(1.5rem, 4vh, 3rem)' }}
      >

        {/* ── Top: Brand ── */}
        <div>
          <h3
            className="text-primary font-black tracking-tighter mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 1 }}
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                {CONTACT_EMAIL}
              </a>

              {/* WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary text-base md:text-lg font-medium transition-colors duration-300 flex items-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary text-base md:text-lg font-medium transition-colors duration-300 flex items-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
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
