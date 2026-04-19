// ============================================
// ASSE ZERO — Footer Component
// ============================================

import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-dark" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-heading font-black text-dark mb-4 tracking-tighter">
              {SITE_NAME}
            </h3>
            <p className="text-dark/80 text-sm md:text-base leading-relaxed font-bold">
              Team creativo specializzato in produzione video professionale
              e social media management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-dark uppercase tracking-wider mb-4 border-b border-dark/20 pb-2 inline-block">
              Navigazione
            </h4>
            <ul className="space-y-2">
              {['Home', 'Servizi', 'Team', 'Contatti'].map((label) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase()}`}
                    className="text-sm md:text-base font-bold text-dark/80 hover:text-dark hover:underline underline-offset-4 transition-all duration-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-black text-dark uppercase tracking-wider mb-4 border-b border-dark/20 pb-2 inline-block">
              Servizi
            </h4>
            <ul className="space-y-2">
              {['Produzione Video', 'Post-Produzione', 'Social Media Management', 'Content Strategy'].map(
                (service) => (
                  <li key={service}>
                    <span className="text-sm md:text-base font-bold text-dark/80">{service}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-dark/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm font-black text-dark/60 tracking-wider">
            © {currentYear} {SITE_NAME}. TUTTI I DIRITTI RISERVATI.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs md:text-sm font-black text-dark/60 hover:text-dark transition-colors tracking-wider">
              PRIVACY POLICY
            </a>
            <a href="#" className="text-xs md:text-sm font-black text-dark/60 hover:text-dark transition-colors tracking-wider">
              COOKIE POLICY
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
