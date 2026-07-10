// ============================================
// ASSE ZERO — Services Section
// Sezione Social Media Management (SMM)
// ============================================

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import SpotlightCard from '@/components/SpotlightCard';
import { Button } from '@/components/ui/Button';
import { SectionHeroTitle } from '@/components/ui/SectionHeroTitle';
import '@/components/social-pricing.css';
import { SMM_PILLS, SMM_PRICE_PLANS } from '@/data/services';
import { SECTION_IDS } from '@/lib/constants';

interface ServicesProps {
  isVisible?: boolean;
}

export function Services({ isVisible = true }: ServicesProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const pillsWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const pills = pillsWrapRef.current;
    if (!header || !pills) return;

    const pillEls = pills.querySelectorAll('[data-smm-pill]');

    const ctx = gsap.context(() => {
      gsap.killTweensOf(pillEls);
      if (isVisible) {
        gsap.fromTo(
          pillEls,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.25 },
        );
      } else {
        gsap.to(pillEls, { opacity: 0, y: -12, duration: 0.35, stagger: 0.03, ease: 'power2.in' });
      }
    }, header);

    return () => ctx.revert();
  }, [isVisible]);

  return (
    <section
      className="relative w-full z-0 bg-dark h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center py-6 md:py-10">

        <div ref={headerRef} className="w-full mx-auto flex flex-col items-center mb-6 md:mb-12 shrink-0">
          <SectionHeroTitle
            text="SOCIAL MEDIA MANAGEMENT"
            variant="smm"
            isVisible={isVisible}
            className="sht-size-smm mb-4 md:mb-6"
          />

          <div ref={pillsWrapRef} className="flex flex-wrap justify-center gap-2 sm:gap-2.5 max-w-4xl">
            {SMM_PILLS.map((pill, i) => (
              <div
                key={pill}
                data-smm-pill
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
