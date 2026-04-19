// ============================================
// ASSE ZERO — Footer Component
// ============================================

import { SITE_NAME } from '@/lib/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-secondary border-t border-glass-border" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-heading font-bold gradient-text mb-4">
              {SITE_NAME}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Team creativo specializzato in produzione video professionale
              e social media management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Navigazione
            </h4>
            <ul className="space-y-2">
              {['Home', 'Servizi', 'Team', 'Contatti'].map((label) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase()}`}
                    className="text-sm text-text-secondary hover:text-primary-light transition-colors duration-300"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">
              Servizi
            </h4>
            <ul className="space-y-2">
              {['Produzione Video', 'Post-Produzione', 'Social Media Management', 'Content Strategy'].map(
                (service) => (
                  <li key={service}>
                    <span className="text-sm text-text-secondary">{service}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {currentYear} {SITE_NAME}. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
