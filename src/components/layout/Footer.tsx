// ============================================
// ASSE ZERO — Footer Component
// Layout pulito a griglia, no scroll animation
// (la reveal è gestita da MaskChangeUI in App)
// ============================================

import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white w-full py-16 md:py-24 px-6 md:px-12 lg:px-20" id="footer">
      <div className="max-w-6xl mx-auto">

        {/* ── Top: Brand ── */}
        <div className="mb-16">
          <h3
            className="text-primary font-black tracking-tighter mb-3"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1 }}
          >
            {SITE_NAME}
          </h3>
          <p className="text-white/60 text-base md:text-lg max-w-lg leading-relaxed">
            Team creativo specializzato in produzione video professionale
            e social media management.
          </p>
        </div>

        {/* ── Middle: 3 columns ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 mb-16">

          {/* Navigazione */}
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              Navigazione
            </p>
            <nav className="flex flex-col gap-2">
              {['Home', 'Video', 'SMM', 'Team', 'Contatti'].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="text-white/70 hover:text-primary text-sm md:text-base font-medium transition-colors duration-300"
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
            <div className="flex flex-col gap-2">
              {['Produzione Video', 'Post-Produzione', 'Social Media Management', 'Content Strategy'].map((s) => (
                <span key={s} className="text-white/70 text-sm md:text-base font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Contatti */}
          <div>
            <p className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-4">
              Contatti
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:info@assezero.com"
                className="text-white/70 hover:text-primary text-sm md:text-base font-medium transition-colors duration-300 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                info@assezero.com
              </a>
              <a
                href="https://instagram.com/assezero"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-primary text-sm md:text-base font-medium transition-colors duration-300 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
