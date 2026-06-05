import { useReveal } from '@/hooks/useReveal';

const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

const R = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: '#a90f21', fontStyle: 'italic' }}>{children}</strong>
);

const reasons = [
  {
    num: '01',
    text: (
      <>
        Perchè il cliente è <R>univoco</R> — così come la <R>strategia</R> elaborata
        attorno a lui. Niente pacchetti standard: ogni progetto nasce da zero.
      </>
    ),
  },
  {
    num: '02',
    text: (
      <>
        Siamo giovani professionisti, ma sopratutto <R>nativi digitali</R> che sanno
        come interfacciarsi a logiche social moderne con un approccio{' '}
        <R>fresco e dinamico.</R>
      </>
    ),
  },
  {
    num: '03',
    text: (
      <>
        Perchè passo dopo passo lavoriamo <R>a fianco del cliente,</R> rimanendo
        sempre disponibili per garantire comunicazione e{' '}
        <R>risultati sinergici.</R>
      </>
    ),
  },
];

export function PercheScegliere() {
  const { ref, isRevealed } = useReveal({ threshold: 0.2 });

  return (
    <section ref={ref} className="w-full h-screen bg-primary flex flex-col px-6 md:px-16 py-10 md:py-14 overflow-hidden">

      {/* Titolo display — clip reveal per elemento */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-8 md:mb-10 shrink-0">
        {['PERCHÈ', 'SCEGLIERE'].map((word, i) => (
          <span key={word} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <span
              style={{
                fontFamily: "'Nohemi', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                color: '#a90f21',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                display: 'block',
                transform: isRevealed ? 'translateY(0)' : 'translateY(110%)',
                transition: `transform 0.85s ${EXPO} ${i * 110}ms`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
        <span style={{ overflow: 'hidden', display: 'inline-block' }}>
          <img
            src="/logo.png"
            alt="AsseZero"
            style={{
              height: 'clamp(2.5rem, 6vw, 5.5rem)',
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              transform: isRevealed ? 'translateY(0)' : 'translateY(110%)',
              transition: `transform 0.85s ${EXPO} 220ms`,
            }}
          />
        </span>
        <span style={{ overflow: 'hidden', display: 'inline-block' }}>
          <span
            style={{
              fontFamily: "'Nohemi', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(2.8rem, 7vw, 6rem)',
              color: '#a90f21',
              lineHeight: 1,
              display: 'block',
              transform: isRevealed ? 'translateY(0)' : 'translateY(110%)',
              transition: `transform 0.85s ${EXPO} 320ms`,
            }}
          >
            ?
          </span>
        </span>
      </div>

      {/* Tre motivi — fade + lift staggerati */}
      <div className="flex-1 flex flex-col min-h-0">
        {reasons.map((r, i) => (
          <div
            key={i}
            className="flex-1 flex items-center gap-6 md:gap-10 px-4 md:px-8"
            style={{
              borderTop: '1.5px solid rgba(169,15,33,0.35)',
              borderBottom: i === 2 ? '1.5px solid rgba(169,15,33,0.35)' : 'none',
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(28px)',
              transition: `opacity 0.7s ease ${420 + i * 120}ms, transform 0.7s ${EXPO} ${420 + i * 120}ms`,
            }}
          >
            <span
              className="shrink-0 select-none"
              style={{
                fontFamily: "'Nohemi', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(2rem, 5vw, 4rem)',
                color: 'rgba(169,15,33,0.2)',
                lineHeight: 1,
                letterSpacing: '-0.03em',
              }}
            >
              {r.num}
            </span>
            <p
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(0.95rem, 1.6vw, 1.25rem)',
                color: '#2b2d42',
                lineHeight: 1.55,
              }}
            >
              {r.text}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
