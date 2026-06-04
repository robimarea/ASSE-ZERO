// ============================================
// ASSE ZERO — Services Section
// Sezione Social Media Management (SMM)
// Layout statico ottimizzato per MaskChangeUI
// ============================================

import { useRef, useEffect } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import '@/components/social-pricing.css';
import { SMM_PILLS, SMM_PRICE_PLANS } from '@/data/services';

interface ServicesProps {
  isVisible?: boolean;
}

export function Services({ isVisible = true }: ServicesProps) {
  const containerRef = useRef<HTMLElement>(null);

  // SMM: z-index dinamico in base alla direzione di scroll
  // Quando si scrolla verso l'alto, la sezione sale sopra la Philosophy curtain (zIndex 40)
  // così il titolo rimane visibile
  useEffect(() => {
    const section = containerRef.current;
    if (!section || !isVisible) return;

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const scrollingUp = window.scrollY < lastScrollY;
      lastScrollY = window.scrollY;
      section.style.zIndex = scrollingUp ? '50' : '0';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return (
    <section
      ref={containerRef}
      className="relative w-full z-0 bg-dark py-24 min-h-screen flex items-center justify-center"
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">

        <div className="w-full mx-auto flex flex-col items-center mb-12 shrink-0">
          <h2
            className="font-black uppercase tracking-tighter mb-6 text-primary text-center"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 8vw, 9rem)',
              lineHeight: 0.9,
            }}
          >
            SOCIAL MEDIA MANAGEMENT
          </h2>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl">
            {SMM_PILLS.map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 md:px-4 md:py-2 text-xs sm:text-sm font-medium text-white/70 bg-white/5 border border-white/10 rounded-full whitespace-nowrap"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        <div className="price-scroll-container">
          {SMM_PRICE_PLANS.map((plan) => (
            <div key={plan.name} className="price-card-wrapper">
              <SpotlightCard spotlightColor="rgba(233, 172, 6, 0.25)" className="h-full flex flex-col bg-dark/90 backdrop-blur-sm rounded-3xl border border-white/5">
                <div className="flex flex-col gap-5 h-full p-2">
                  <div>
                    <h3 className="text-white font-heading font-black text-2xl mb-1 tracking-tight">{plan.name}</h3>
                    <p className="font-heading font-black text-3xl text-primary">{plan.price}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-white/50">{plan.description}</p>
                  <ul className="flex flex-col gap-3 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                        <span className="text-primary font-bold">✓</span>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-4 px-6 rounded-2xl font-heading font-black text-sm tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer bg-primary text-dark uppercase">
                    {plan.cta}
                  </button>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
