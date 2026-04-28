// ============================================
// ASSE ZERO — Navbar
// Fisso, trasparente, anchor links
// Layout: logo sinistra | link centrati | hamburger destra
// ============================================

import { useState, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { navLinks } from '@/data/navigation';
import { useActiveSection } from '@/hooks/useActiveSection';
import { SPRING_CONFIG } from '@/lib/constants';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Aggiunge sfondo glass dopo 20px di scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const mobileMenuSpring = useSpring({
    transform: mobileOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: mobileOpen ? 1 : 0,
    config: SPRING_CONFIG.bouncy,
  });

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');

    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] px-6 md:px-12 lg:px-16 transition-all duration-500 ${
          scrolled
            ? 'bg-dark/80 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_30px_rgba(0,0,0,0.4)]'
            : ''
        }`}
        id="main-navbar"
      >
        {/* Griglia 3 colonne: logo | link centrati | hamburger */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 md:h-20">

          {/* Logo — sinistra */}
          <div className="flex justify-start">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
              className="hover:opacity-80 transition-opacity"
              id="nav-logo"
            >
              <img src="/logo.png" alt="ASSE ZERO Logo" className="h-10 md:h-12 w-auto object-contain" />
            </a>
          </div>

          {/* Link desktop — centro assoluto */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={`relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-text-primary ${
                  activeSection === link.href.replace('#', '') ? 'text-text-primary' : 'text-text-secondary'
                }`}
                id={`nav-link-${link.href.replace('#', '')}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                    activeSection === link.href.replace('#', '') ? 'w-full' : 'w-0'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Hamburger mobile — destra */}
          <div className="flex justify-end">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5 z-[60]"
              id="mobile-menu-toggle"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-text-primary transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay — z-50, sopra il contenuto ma sotto la navbar */}
      <animated.div
        style={mobileMenuSpring}
        className="fixed inset-0 z-50 bg-dark/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-10"
        id="mobile-menu"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
            className={`text-3xl font-heading font-bold tracking-tight transition-colors duration-300 ${
              activeSection === link.href.replace('#', '') ? 'gradient-text' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {link.label}
          </a>
        ))}
      </animated.div>
    </>
  );
}
