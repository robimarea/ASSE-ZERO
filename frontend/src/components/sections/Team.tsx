import { useRef } from 'react';
import { SECTION_IDS } from '@/lib/constants';
import { TEAM_MEMBERS } from '@/data/team';
import { useScrollTeam } from '@/hooks/useScrollTeam';
import { useIsMobile } from '@/hooks/useIsMobile';

const COUNT = TEAM_MEMBERS.length;

interface TeamProps {
  isVisible?: boolean;
}

export function Team({ isVisible = true }: TeamProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { textRefs, photoRefs, counterRef } = useScrollTeam({
    containerRef,
    count: COUNT,
    isVisible,
  });

  return (
    <section ref={containerRef} id={SECTION_IDS.team} className="relative w-full bg-dark h-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-16">

          <div className="mb-4 md:mb-16">
            <h2
              className="tracking-tighter leading-none"
              style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)', color: '#ebdb00' }}
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

          <div className="flex flex-col md:flex-row items-start gap-3 md:gap-32">

            <div className="w-full md:w-5/12 relative order-2 md:order-1" style={{ minHeight: isMobile ? 'min(220px, 28vh)' : 'min(300px, 35vh)' }}>
              {TEAM_MEMBERS.map((m, i) => (
                <div
                  key={m.id}
                  ref={(el) => { textRefs.current[i] = el; }}
                  className="absolute inset-x-0 top-0 will-change-[transform,opacity]"
                  style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateX(0)' : 'translateX(-100px)', pointerEvents: i === 0 ? 'auto' : 'none' }}
                >
                  <div className="mb-6 md:mb-10">
                    <p className="text-primary text-sm tracking-[0.4em] uppercase font-black mb-3">RUOLO:</p>
                    <p className="text-white font-black uppercase" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(1.5rem, 3vw, 3rem)', letterSpacing: '0.05em', lineHeight: 1.1 }}>
                      {m.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary text-sm tracking-[0.4em] uppercase font-black mb-4">BIO:</p>
                    <p className="text-white/90 leading-relaxed font-medium" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.4rem)' }} dangerouslySetInnerHTML={{ __html: m.bio }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-7/12 flex items-center justify-center md:justify-end order-1 md:order-2">
              <div style={{ width: 'min(520px, 85vw)', height: isMobile ? 'min(340px, 46vh)' : 'min(700px, 72vh)', position: 'relative', borderRadius: '2rem', boxShadow: '0 30px 70px rgba(0,0,0,0.7)' }}>
                {TEAM_MEMBERS.map((m, i) => (
                  <div
                    key={m.id}
                    ref={(el) => { photoRefs.current[i] = el; }}
                    className="absolute inset-0 flex flex-col will-change-[opacity,transform]"
                    style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'scale(1)' : 'scale(0.97)', transition: 'opacity 0.45s ease, transform 0.45s ease', padding: 'clamp(1.5rem, 5vw, 4rem)', backgroundColor: '#363853', borderRadius: '2rem', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <div className="mb-6 md:mb-10">
                      <h3 className="font-black tracking-tighter" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', lineHeight: 0.85, color: '#ebdb00' }}>
                        {m.name.split(' ')[0]}<br />
                        <span>{m.name.split(' ').slice(1).join(' ')}</span>
                      </h3>
                    </div>
                    <div className="flex-1 w-full bg-white rounded-2xl overflow-hidden border border-white/5 relative">
                      {m.photo
                        ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center bg-white">
                            <span className="text-black/10 font-black select-none" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '12rem', lineHeight: 1 }}>{m.name.charAt(0)}</span>
                          </div>
                      }
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
