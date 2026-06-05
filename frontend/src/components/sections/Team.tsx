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
      <div className="sticky top-0 h-[100dvh] w-full flex items-start md:items-center justify-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16 py-5 md:py-0 h-full flex flex-col justify-center min-h-0">

          <div className="mb-3 md:mb-16 shrink-0">
            <h2
              className="tracking-tighter leading-none"
              style={{
                fontFamily: "'Nohemi', sans-serif",
                fontSize: isMobile ? 'clamp(1.85rem, 8vw, 2.35rem)' : 'clamp(2.5rem, 7vw, 5rem)',
                color: '#ebdb00',
              }}
            >
              IL NOSTRO TEAM
            </h2>
            <div className="flex items-center gap-3 mt-2 md:mt-4">
              <div className="h-[2px] w-10 md:w-12 bg-primary/30" />
              <p className="text-white/40 text-[10px] md:text-xs tracking-[0.35em] md:tracking-[0.4em] uppercase font-black">
                MEMBER <span ref={counterRef} className="text-primary ml-1">1</span> / {COUNT}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-32 min-h-0 flex-1 md:flex-none">

            <div className="w-full md:w-5/12 relative order-2 md:order-1 min-h-0" style={{ minHeight: isMobile ? 'auto' : 'min(300px, 35vh)' }}>
              {TEAM_MEMBERS.map((m, i) => (
                <div
                  key={m.id}
                  ref={(el) => { textRefs.current[i] = el; }}
                  className="absolute inset-x-0 top-0 will-change-[transform,opacity]"
                  style={{ opacity: i === 0 ? 1 : 0, transform: i === 0 ? 'translateX(0)' : 'translateX(-100px)', pointerEvents: i === 0 ? 'auto' : 'none' }}
                >
                  <div className="mb-4 md:mb-10">
                    <p className="text-primary text-xs md:text-sm tracking-[0.35em] md:tracking-[0.4em] uppercase font-black mb-2 md:mb-3">RUOLO:</p>
                    <p className="text-white font-black uppercase" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(1.25rem, 3vw, 3rem)', letterSpacing: '0.05em', lineHeight: 1.1 }}>
                      {m.role}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary text-xs md:text-sm tracking-[0.35em] md:tracking-[0.4em] uppercase font-black mb-2 md:mb-4">BIO:</p>
                    <p className="text-white/90 leading-relaxed font-medium" style={{ fontSize: 'clamp(0.85rem, 1.4vw, 1.4rem)' }} dangerouslySetInnerHTML={{ __html: m.bio }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-7/12 flex items-center justify-center md:justify-end order-1 md:order-2 shrink-0 md:shrink">
              <div
                className="team-photo-stack w-full"
                style={{
                  maxWidth: 'min(520px, 92vw)',
                  height: isMobile ? 'min(52dvh, 420px)' : 'min(700px, 72vh)',
                  position: 'relative',
                  borderRadius: '2rem',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.7)',
                }}
              >
                {TEAM_MEMBERS.map((m, i) => (
                  <div
                    key={m.id}
                    ref={(el) => { photoRefs.current[i] = el; }}
                    className="absolute inset-0 flex flex-col will-change-[opacity,transform] team-photo-card"
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      transform: i === 0 ? 'scale(1)' : 'scale(0.97)',
                      transition: 'opacity 0.45s ease, transform 0.45s ease',
                      padding: isMobile ? '0.75rem' : 'clamp(1.5rem, 5vw, 4rem)',
                      backgroundColor: '#363853',
                      borderRadius: '2rem',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <div className="mb-3 md:mb-10 shrink-0">
                      <h3 className="font-black tracking-tighter" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: 'clamp(1.5rem, 3.2vw, 2.8rem)', lineHeight: 0.9, color: '#ebdb00' }}>
                        {m.name.split(' ')[0]}<br />
                        <span>{m.name.split(' ').slice(1).join(' ')}</span>
                      </h3>
                    </div>
                    <div className="flex-1 w-full min-h-0 bg-white rounded-2xl overflow-hidden border border-white/5 relative team-photo-frame">
                      {m.photo
                        ? (
                          <img
                            src={m.photo}
                            alt={m.name}
                            className="w-full h-full object-cover team-photo-img"
                          />
                        )
                        : (
                          <div className="w-full h-full flex items-center justify-center bg-white">
                            <span className="text-black/10 font-black select-none" style={{ fontFamily: "'Nohemi', sans-serif", fontSize: '12rem', lineHeight: 1 }}>{m.name.charAt(0)}</span>
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
