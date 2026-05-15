// ============================================
// ASSE ZERO — Team Section
// Scroll-driven: testo crossfade + card rotateY flip
// Zero React re-renders pattern
// ============================================

import { useRef, useEffect } from 'react';
import { SECTION_IDS } from '@/lib/constants';
import { clamp } from '@/lib/math';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Alessia Debrova',
    role: 'Social media strategist, Content manager',
    bio: 'Ho lavorato su contenuti che hanno raggiunto +800.000 visualizzazioni, relativi a canali social sia internazionali che italiani, per ben 4 profili differenti instagram e youtube, sviluppando una forte capacità nella creazione di contenuti efficaci e coerenti con le logiche delle piattaforme. Al centro della mia formazione, c\'è stato lo studio del RETENTION RATE, fondamentale per mantenere alta l\'attenzione dello spettatore e migliorare le performance dei contenuti.',
    photo: null as string | null,
  },
  {
    id: 2,
    name: 'Vittorio Milandri',
    role: 'Videomaker: Operatore di camera, Montatore, Sound designer',
    bio: 'Con più di tre anni di esperienza nel settore, ho lavorato con importanti realtà come "Sanremo Newtalent", "IcaroTV", strutture turistiche di alto livello nel panorama romagnolo e in set cinematografici per la compagnia "RAI". Inoltre ho collaborato con case di produzione come "301 Filmont" e "Riccione Video Produzioni" per Aquafan. Con AsseZero, il mio obiettivo è portare qualità visiva che valorizzi l\'identità del brand e renda ogni contenuto riconoscibile ed efficace.',
    photo: null as string | null,
  },
  {
    id: 3,
    name: 'Salvattore Muratori',
    role: 'Regista, Direttore della fotografia',
    bio: "Da cinque anni a questa parte, ho gestito contenuti di canali youtube da 5 milioni di visualizzazioni totali e collaborato con streamers statunitensi. Ho inoltre lavorato per grandi realtà del territorio come Mediaset e Icaro tv. Il mio ruolo in Asse Zero è quello di curare la pre-produzione dei progetti, occupandomi della scrittura del prodotto e spalleggiando la post-produzione dei contenuti.",
    photo: null as string | null,
  },
  {
    id: 4,
    name: 'Gerardo Romani',
    role: 'Montatore, Colorist',
    bio: 'Per due anni, ho lavorato per eventi musicali, set cinematografici, videoclip e progetti per brand, sviluppando competenze operative in diversi contesti di produzione. Mi occupo principalmente di montaggio e post-produzione, curando ritmo, struttura e qualità del contenuto. Contribuisco alla realizzazione di contenuti efficaci e coerenti, adattati agli obiettivi e alle esigenze specifiche del cliente.',
    photo: null as string | null,
  },
];

const COUNT = TEAM_MEMBERS.length;

interface TeamProps {
  isVisible?: boolean;
}

export function Team({ isVisible = true }: TeamProps) {
  const containerRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);
  const prevActiveRef = useRef(0);

  useEffect(() => {
    if (!isVisible) return;

    let frameId = 0;
    let sTop = 0;
    let sHeight = 0;

    const updateMetrics = () => {
      if (!containerRef.current) return;
      
      // All'interno di MaskChangeUI, il containerRef (section) è sticky o dentro un parent sticky.
      // Per ottenere lo sTop "reale" (statico), dobbiamo trovare il wrapper del MaskChangeUI.
      // In App.tsx, Team è avvolto in Viewport -> MaskChangeUI.
      const wrapper = containerRef.current.closest('.relative.w-full.font-sans') as HTMLElement;
      
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        sTop = rect.top + window.scrollY;
        sHeight = wrapper.offsetHeight;
      } else {
        // Fallback classico se non siamo in MaskChangeUI
        const rect = containerRef.current.getBoundingClientRect();
        sTop = rect.top + window.scrollY;
        sHeight = containerRef.current.offsetHeight;
      }
    };

    const sync = () => {
      frameId = 0;
      if (!containerRef.current) return;

      // Il primo 100vh di scroll serve a rimuovere la tendina di MaskChangeUI.
      // L'animazione interna vera e propria inizia dopo quell'offset.
      const offset = window.innerHeight;
      const scrollable = Math.max(1, sHeight - window.innerHeight * 2);
      const scrolled = Math.max(0, window.scrollY - sTop - offset);
      const progress = clamp(scrolled / scrollable, 0, 1);

      const travel = progress * (COUNT - 1);
      const active = clamp(Math.round(travel), 0, COUNT - 1);

      // ── Text blocks: Role + Bio (Name moved to card) ──
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(i - travel);

        let opacity: number;
        if (dist < 0.15) {
          opacity = 1;
        } else if (dist < 0.45) {
          opacity = 1 - ((dist - 0.15) / 0.3);
        } else {
          opacity = 0;
        }

        const dir = i - travel;
        const translateY = dir * 40;

        el.style.opacity = `${opacity.toFixed(3)}`;
        el.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      });

      // ── Card: 3D rotateY flip con plateau frontali ──
      if (cardRef.current) {
        const floorTravel = Math.floor(travel);
        const remainder = travel - floorTravel;
        
        // La rotazione avviene solo tra lo 0.45 e lo 0.55 del passaggio tra membri
        // Altrimenti la card rimane ferma a 0, 180, 360...
        const flipZone = 0.15; // ampiezza della zona di flip
        const startFlip = 0.5 - flipZone / 2;
        const endFlip = 0.5 + flipZone / 2;
        
        let rotationValue;
        if (remainder < startFlip) {
          rotationValue = floorTravel * 180;
        } else if (remainder > endFlip) {
          rotationValue = (floorTravel + 1) * 180;
        } else {
          // Interpolazione fluida nella zona di flip
          const t = (remainder - startFlip) / flipZone;
          const ease = t * t * (3 - 2 * t); // smoothstep
          rotationValue = (floorTravel + ease) * 180;
        }

        cardRef.current.style.transform = `rotateY(${rotationValue.toFixed(1)}deg)`;
      }

      // ── Swap profile at midpoint ──
      if (active !== prevActiveRef.current) {
        prevActiveRef.current = active;
        photoRefs.current.forEach((el, i) => {
          if (el) {
             el.style.opacity = i === active ? '1' : '0';
             // If card flipped 180deg (odd index relative to start), we might need to counter-rotate text 
             // but here the whole card flips so text on card also flips. 
             // To keep text readable, we swap content.
          }
        });
        if (counterRef.current) {
          counterRef.current.textContent = `${active + 1}`;
        }
      }
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const vb = window.scrollY + window.innerHeight;
      const sb = sTop + sHeight;
      if (vb < sTop || window.scrollY > sb) return;
      if (frameId !== 0) return;
      frameId = requestAnimationFrame(sync);
    };

    const handleResize = () => { updateMetrics(); handleScroll(); };

    updateMetrics();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    sync();

    return () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <section
      ref={containerRef}
      id={SECTION_IDS.team}
      className="relative w-full bg-dark h-full"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16">

          {/* Title row */}
          <div className="mb-16 md:mb-20">
            <h2
              className="tracking-tighter leading-none text-white"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              }}
            >
              IL NOSTRO TEAM
            </h2>
            <div className="flex items-center gap-4 mt-4">
               <div className="h-[2px] w-12 bg-primary/30" />
               <p className="text-white/40 text-xs tracking-[0.4em] uppercase font-black">
                 MEMBER <span ref={counterRef} className="text-primary ml-1">1</span> / {COUNT}
               </p>
            </div>
          </div>

          {/* Content: text left + card right */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-32">

            {/* ── Left: Role + Bio ── */}
            <div className="w-full md:w-5/12 relative" style={{ minHeight: '300px' }}>
              {TEAM_MEMBERS.map((m, i) => (
                <div
                  key={m.id}
                  ref={(el) => { textRefs.current[i] = el; }}
                  className="absolute inset-x-0 top-0 will-change-[transform,opacity]"
                  style={{
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? 'translateY(0)' : 'translateY(40px)',
                    pointerEvents: i === 0 ? 'auto' : 'none',
                  }}
                >
                  <div className="mb-10">
                    <p className="text-primary text-sm tracking-[0.4em] uppercase font-black mb-3">
                      RUOLO:
                    </p>
                    <p
                      className="text-white font-black uppercase"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 'clamp(2rem, 3vw, 3rem)',
                        letterSpacing: '0.05em',
                        lineHeight: 1.1
                      }}
                    >
                      {m.role}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-primary text-sm tracking-[0.4em] uppercase font-black mb-4">
                      BIO:
                    </p>
                    <p 
                      className="text-white/90 leading-relaxed font-medium" 
                      style={{ 
                        fontSize: 'clamp(1.1rem, 1.4vw, 1.4rem)' 
                      }}
                    >
                      {m.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right: Rectangular Card (Name + Photo) ── */}
            <div
              className="w-full md:w-7/12 flex items-center justify-center md:justify-end"
              style={{ perspective: '2000px' }}
            >
              <div
                ref={cardRef}
                className="will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  style={{
                    width: 'min(520px, 85vw)',
                    height: 'min(700px, 90vh)',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {TEAM_MEMBERS.map((m, i) => {
                    return (
                      <div
                        key={m.id}
                        ref={(el) => { photoRefs.current[i] = el; }}
                        className="absolute inset-0 flex flex-col shadow-[0_50px_120px_rgba(0,0,0,0.6)]"
                        style={{ 
                          opacity: i === 0 ? 1 : 0,
                          padding: '4rem',
                          backgroundColor: '#111',
                          borderRadius: '2rem',
                          border: '1px solid rgba(255,255,255,0.1)',
                          backfaceVisibility: 'hidden',
                          transform: (i % 2 !== 0) ? 'rotateY(180deg)' : 'none',
                          willChange: 'opacity'
                        }}
                      >
                        {/* Name on top of card */}
                        <div className="mb-10">
                          <h3
                            className="text-white font-black tracking-tighter"
                            style={{
                              fontFamily: "'Bebas Neue', sans-serif",
                              fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)',
                              lineHeight: 0.85,
                            }}
                          >
                            {m.name.split(' ')[0]}<br/>
                            <span>{m.name.split(' ').slice(1).join(' ')}</span>
                          </h3>
                        </div>

                        {/* Photo below name */}
                        <div className="flex-1 w-full bg-dark/50 rounded-2xl overflow-hidden border border-white/5 relative">
                          {m.photo ? (
                            <img
                              src={m.photo}
                              alt={m.name}
                              className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                               <span
                                className="text-white/5 font-black select-none"
                                style={{
                                  fontFamily: "'Bebas Neue', sans-serif",
                                  fontSize: '12rem',
                                  lineHeight: 1,
                                }}
                              >
                                {m.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          
                          {/* Decorative accent */}
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
