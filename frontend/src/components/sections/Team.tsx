// ============================================
// ASSE ZERO — Team Section
// Scroll-driven: testo crossfade + photo crossfade (no 3D flip)
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
    photo: '/profile_photos/AlessiaDebrova.PNG',
  },
  {
    id: 2,
    name: 'Vittorio Milandri',
    role: 'Videomaker: Operatore di camera, Montatore, Sound designer',
    bio: 'Con più di tre anni di esperienza nel settore, ho lavorato con importanti realtà come "Sanremo Newtalent", "IcaroTV", strutture turistiche di alto livello nel panorama romagnolo e in set cinematografici per la compagnia "RAI". Inoltre ho collaborato con case di produzione come "301 Filmont" e "Riccione Video Produzioni" per Aquafan. Con AsseZero, il mio obiettivo è portare qualità visiva che valorizzi l\'identità del brand e renda ogni contenuto riconoscibile ed efficace.',
    photo: '/profile_photos/VittorioMilandri.png',
  },
  {
    id: 3,
    name: 'Salvattore Muratori',
    role: 'Regista, Direttore della fotografia',
    bio: "Da cinque anni a questa parte, ho gestito contenuti di canali youtube da 5 milioni di visualizzazioni totali e collaborato con streamers statunitensi. Ho inoltre lavorato per grandi realtà del territorio come Mediaset e Icaro tv. Il mio ruolo in Asse Zero è quello di curare la pre-produzione dei progetti, occupandomi della scrittura del prodotto e spalleggiando la post-produzione dei contenuti.",
    photo: '/profile_photos/SalvattoreMuratori.png',
  },
  {
    id: 4,
    name: 'Gerardo Romani',
    role: 'Montatore, Colorist',
    bio: 'Per due anni, ho lavorato per eventi musicali, set cinematografici, videoclip e progetti per brand, sviluppando competenze operative in diversi contesti di produzione. Mi occupo principalmente di montaggio e post-produzione, curando ritmo, struttura e qualità del contenuto. Contribuisco alla realizzazione di contenuti efficaci e coerenti, adattati agli obiettivi e alle esigenze specifiche del cliente.',
    photo: '/profile_photos/GerardoRomani.png',
  },
];

const COUNT = TEAM_MEMBERS.length;

interface TeamProps {
  isVisible?: boolean;
}

export function Team({ isVisible = true }: TeamProps) {
  const containerRef  = useRef<HTMLElement>(null);
  const textRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const photoRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const counterRef    = useRef<HTMLSpanElement>(null);
  const prevActiveRef = useRef(0);
  const prevPointerRef = useRef<(boolean | null)[]>(new Array(COUNT).fill(null));

  useEffect(() => {
    if (!isVisible) return;

    let frameId = 0;
    let sTop = 0;
    let sHeight = 0;

    const updateMetrics = () => {
      if (!containerRef.current) return;
      const wrapper = containerRef.current.closest('.relative.w-full.font-sans') as HTMLElement;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        sTop = rect.top + window.scrollY;
        sHeight = wrapper.offsetHeight;
      } else {
        const rect = containerRef.current.getBoundingClientRect();
        sTop = rect.top + window.scrollY;
        sHeight = containerRef.current.offsetHeight;
      }
    };

    const sync = () => {
      frameId = 0;
      if (!containerRef.current) return;

      const offset   = window.innerHeight;
      const scrollable = Math.max(1, sHeight - window.innerHeight * 2);
      const scrolled   = Math.max(0, window.scrollY - sTop - offset);
      const progress   = clamp(scrolled / scrollable, 0, 1);
      const travel     = progress * (COUNT - 1);
      const active     = clamp(Math.round(travel), 0, COUNT - 1);

      // ── Text blocks: opacity + translateX ──
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        const dist = Math.abs(i - travel);

        let opacity: number;
        if (dist <= 0.2) {
          opacity = 1;
        } else if (dist < 0.5) {
          const t = 1 - ((dist - 0.2) / 0.3);
          opacity = t * t * (3 - 2 * t);
        } else {
          opacity = 0;
        }

        const dir       = i - travel;
        const moveEase  = Math.sign(dir) * Math.pow(Math.abs(dir), 1.5);
        const translateX = -moveEase * 100;

        el.style.opacity   = opacity.toFixed(3);
        el.style.transform = `translateX(${translateX.toFixed(1)}px)`;

        const wantsAuto = opacity > 0.5;
        if (prevPointerRef.current[i] !== wantsAuto) {
          prevPointerRef.current[i] = wantsAuto;
          el.style.pointerEvents = wantsAuto ? 'auto' : 'none';
        }
      });

      // ── Photo crossfade: opacity + scale, CSS transition fa il resto ──
      if (active !== prevActiveRef.current) {
        prevActiveRef.current = active;
        photoRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.opacity   = i === active ? '1' : '0';
          el.style.transform = i === active ? 'scale(1)' : 'scale(0.97)';
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
        <div className="w-full max-w-7xl mx-auto px-6 md:px-16">

          {/* Title row */}
          <div className="mb-8 md:mb-16">
            <h2
              className="tracking-tighter leading-none"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#ebdb00' }}
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
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-32">

            {/* ── Left: Role + Bio ── */}
            <div className="w-full md:w-5/12 relative" style={{ minHeight: 'min(300px, 35vh)' }}>
              {TEAM_MEMBERS.map((m, i) => (
                <div
                  key={m.id}
                  ref={(el) => { textRefs.current[i] = el; }}
                  className="absolute inset-x-0 top-0 will-change-[transform,opacity]"
                  style={{
                    opacity:       i === 0 ? 1 : 0,
                    transform:     i === 0 ? 'translateX(0)' : 'translateX(-100px)',
                    pointerEvents: i === 0 ? 'auto' : 'none',
                  }}
                >
                  <div className="mb-6 md:mb-10">
                    <p className="text-primary text-sm tracking-[0.4em] uppercase font-black mb-3">RUOLO:</p>
                    <p
                      className="text-white font-black uppercase"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 3rem)', letterSpacing: '0.05em', lineHeight: 1.1 }}
                    >
                      {m.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary text-sm tracking-[0.4em] uppercase font-black mb-4">BIO:</p>
                    <p className="text-white/90 leading-relaxed font-medium" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.4rem)' }}>
                      {m.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Right: Card con crossfade pulito ── */}
            <div className="w-full md:w-7/12 flex items-center justify-center md:justify-end">
              {/* Wrapper dimensionato — ombra qui, fuori dagli strati animati */}
              <div
                style={{
                  width: 'min(520px, 85vw)',
                  height: 'min(700px, 72vh)',
                  position: 'relative',
                  borderRadius: '2rem',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
                }}
              >
                {TEAM_MEMBERS.map((m, i) => (
                  <div
                    key={m.id}
                    ref={(el) => { photoRefs.current[i] = el; }}
                    className="absolute inset-0 flex flex-col will-change-[opacity,transform]"
                    style={{
                      opacity:    i === 0 ? 1 : 0,
                      transform:  i === 0 ? 'scale(1)' : 'scale(0.97)',
                      transition: 'opacity 0.45s ease, transform 0.45s ease',
                      padding:    'clamp(1.5rem, 5vw, 4rem)',
                      backgroundColor: '#363853',
                      borderRadius: '2rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {/* Nome */}
                    <div className="mb-6 md:mb-10">
                      <h3
                        className="font-black tracking-tighter"
                        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', lineHeight: 0.85, color: '#ebdb00' }}
                      >
                        {m.name.split(' ')[0]}<br />
                        <span>{m.name.split(' ').slice(1).join(' ')}</span>
                      </h3>
                    </div>

                    {/* Foto */}
                    <div className="flex-1 w-full bg-white rounded-2xl overflow-hidden border border-white/5 relative">
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white">
                          <span
                            className="text-black/10 font-black select-none"
                            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '12rem', lineHeight: 1 }}
                          >
                            {m.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
