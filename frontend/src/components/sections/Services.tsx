// ============================================
// ASSE ZERO — Services Section
// Sezione Social Media Management (SMM)
// Layout statico ottimizzato per MaskChangeUI
// ============================================

import { useRef, useEffect } from 'react';
import SpotlightCard from '@/components/SpotlightCard';
import { Button } from '@/components/ui/Button';
import '@/components/social-pricing.css';
import { SMM_PILLS, SMM_PRICE_PLANS } from '@/data/services';
import { SECTION_IDS } from '@/lib/constants';

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
    let rafId = 0;
    let pendingUp = false;

    const handleScroll = () => {
      pendingUp = window.scrollY < lastScrollY;
      lastScrollY = window.scrollY;
      if (rafId !== 0) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        section.style.zIndex = pendingUp ? '50' : '0';
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  return (
    <section
      ref={containerRef}
      className="relative w-full z-0 bg-dark h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center py-6 md:py-10">

        <div className="w-full mx-auto flex flex-col items-center mb-6 md:mb-12 shrink-0">
          <h2
            className="font-black uppercase tracking-tighter mb-4 md:mb-6 text-primary text-center"
            style={{
              fontFamily: "'Nohemi', sans-serif",
              fontSize: 'clamp(1.6rem, 6vw, 9rem)',
              lineHeight: 0.9,
            }}
          >
            SOCIAL MEDIA MANAGEMENT
          </h2>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-4xl">
            {SMM_PILLS.map((pill, i) => (
              <div
                key={pill}
                className="group relative overflow-hidden cursor-default border border-white/[0.07] border-l-2 border-l-[#a90f21] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(169,15,33,0.3)]"
                style={{ padding: '9px 16px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', whiteSpace: 'nowrap' }}
              >
                <span className="absolute inset-0 bg-[#a90f21] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2.5">
                  <span className="text-[9px] font-black tabular-nums text-[#a90f21] group-hover:text-white/50 transition-colors duration-200">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="w-px h-3 shrink-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-200" />
                  <span className="text-[11px] font-black tracking-[0.16em] uppercase text-white/55 group-hover:text-white transition-colors duration-200">
                    {pill}
                  </span>
                </span>
              </div>
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
                        <span className="font-bold" style={{ color: '#a90f21' }}>✓</span>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      const el = document.getElementById(SECTION_IDS.contact);
                      if (!el) return;
                      const maskWrapper = el.closest('[data-mask-wrapper="true"]');
                      if (maskWrapper) {
                        const top = maskWrapper.getBoundingClientRect().top + window.scrollY + window.innerHeight;
                        window.scrollTo({ top, behavior: 'smooth' });
                      } else {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
