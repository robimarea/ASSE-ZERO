import { useReveal } from '@/hooks/useReveal';

const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

export function Philosophy() {
  const { ref, isRevealed } = useReveal({ threshold: 0.2 });

  const lines: { text: string; delay: number }[] = [
    { text: '"assestiamo', delay: 0 },
    { text: 'la tua idea,', delay: 160 },
  ];

  return (
    <section ref={ref} className="w-full h-screen bg-dark flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
      <h2
        style={{
          fontFamily: "'Nohemi', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(4.5rem, 11vw, 10rem)',
          lineHeight: 0.97,
          letterSpacing: '-0.03em',
          color: 'white',
          textAlign: 'center',
        }}
      >
        {lines.map(({ text, delay }) => (
          <span key={text} style={{ display: 'block', overflow: 'hidden' }}>
            <span
              style={{
                display: 'block',
                transform: isRevealed ? 'translateY(0)' : 'translateY(105%)',
                transition: `transform 0.85s ${EXPO} ${delay}ms`,
              }}
            >
              {text}
            </span>
          </span>
        ))}

        {/* Riga gialla con immagini inline */}
        <span style={{ display: 'block', overflow: 'hidden' }}>
          <span
            style={{
              display: 'block',
              color: '#ebdb00',
              transform: isRevealed ? 'translateY(0)' : 'translateY(105%)',
              transition: `transform 0.85s ${EXPO} 320ms`,
            }}
          >
            dalla{' '}
            <img
              src="/lettere/letter_a.png"
              alt="a"
              style={{
                height: '0.85em',
                width: 'auto',
                verticalAlign: 'middle',
                display: 'inline',
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'scale(1)' : 'scale(0.65)',
                transition: `opacity 0.5s ease 520ms, transform 0.55s ${SPRING} 520ms`,
              }}
            />
            {' '}alla{' '}
            <img
              src="/lettere/letter_z.png"
              alt="z"
              style={{
                height: '0.85em',
                width: 'auto',
                verticalAlign: 'middle',
                display: 'inline',
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'scale(1)' : 'scale(0.65)',
                transition: `opacity 0.5s ease 640ms, transform 0.55s ${SPRING} 640ms`,
              }}
            />
            "
          </span>
        </span>
      </h2>
    </section>
  );
}
