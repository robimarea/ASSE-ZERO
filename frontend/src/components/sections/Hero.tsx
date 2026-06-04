import { useEffect, useState } from 'react';
import { SECTION_IDS } from '@/lib/constants';
import { Logo3D } from '@/components/Logo3D';
import { Viewport } from '@/components/layout/Viewport';

const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function Hero() {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id={SECTION_IDS.home}
      className="w-full min-h-screen bg-primary text-white relative overflow-visible"
    >
      <div
        className="absolute top-0 left-0 w-full flex justify-center z-10 overflow-visible"
        style={{ pointerEvents: 'auto' }}
      >
        <Viewport threshold={0.1}>
          {(isVisible) => <Logo3D isVisible={isVisible} />}
        </Viewport>
      </div>

      <div className="relative z-0 flex flex-col items-center justify-center md:justify-end w-full min-h-screen pt-[38vh] md:pt-0 pb-10 md:pb-16">
        <h1
          className="uppercase font-black leading-none text-center"
          style={{
            fontFamily: "'Satoshi', sans-serif",
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            textShadow: '0 0 20px rgba(0,0,0,0.2)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: '0 0.22em',
          }}
        >
          {['Video', '&', 'Media'].map((word, i) => (
            <span
              key={word}
              style={{ overflow: 'hidden', display: 'inline-block', verticalAlign: 'bottom' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  color: 'white',
                  transform: revealed ? 'translateY(0)' : 'translateY(110%)',
                  transition: `transform 0.85s ${EXPO} ${i * 120}ms`,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <div style={{ overflow: 'hidden', marginTop: '1.1rem' }}>
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 300,
              fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)',
              letterSpacing: '0.38em',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              transform: revealed ? 'translateY(0)' : 'translateY(115%)',
              opacity: revealed ? 1 : 0,
              transition: `transform 0.75s ${EXPO} 520ms, opacity 0.75s ease 520ms`,
            }}
          >
            Studio di produzione — Rimini
          </p>
        </div>
      </div>
    </section>
  );
}
