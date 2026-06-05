import { useReveal } from '@/hooks/useReveal';

const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

const steps = [
  {
    title: 'Raccolta e analisi del brand',
    desc: 'Raccogliamo informazioni attraverso un questionario strutturato per comprendere valori, obiettivi e identità del cliente.',
  },
  {
    title: 'Analisi di mercato e competitors',
    desc: 'Studiamo il mercato di riferimento e i principali competitor per individuare opportunità, posizionamento e linguaggio efficace.',
  },
  {
    title: 'Sviluppo del concept e direzione creativa',
    desc: 'Definiamo idee, format e visione dei contenuti, costruendo un carattere e un sentimento coerente con il brand.',
  },
  {
    title: 'Pianificazione e scrittura dei contenuti',
    desc: 'Organizziamo una giornata dedicata alla definizione degli script e della struttura dei contenuti.',
  },
  {
    title: 'Produzione e realizzazione dei contenuti',
    desc: 'Realizziamo i contenuti video e visivi, curando ogni fase dalla ripresa al montaggio.',
  },
];

export function IlNostroMetodo() {
  const { ref, isRevealed } = useReveal({ threshold: 0.15 });

  return (
    <section ref={ref} className="w-full h-screen bg-primary flex flex-col px-6 md:px-16 py-10 md:py-12 overflow-hidden">

      {/* Titolo — clip reveal riga per riga */}
      <div className="shrink-0 mb-6 md:mb-8">
        <h2
          style={{
            fontFamily: "'Nohemi', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.4rem, 6vw, 5rem)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: '#a90f21',
          }}
        >
          {[
            { text: 'Il nostro', italic: false },
            { text: 'METODO', italic: true },
          ].map(({ text, italic }, i) => (
            <span key={text} style={{ display: 'block', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  fontStyle: italic ? 'italic' : 'normal',
                  transform: isRevealed ? 'translateY(0)' : 'translateY(105%)',
                  transition: `transform 0.85s ${EXPO} ${i * 110}ms`,
                }}
              >
                {text}
              </span>
            </span>
          ))}
        </h2>
      </div>

      {/* Steps — slide da sinistra staggerati */}
      <div className="flex-1 flex flex-col min-h-0">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex-1 flex items-center gap-4 md:gap-6"
            style={{
              borderTop: '1px solid rgba(169,15,33,0.25)',
              borderBottom: i === 4 ? '1px solid rgba(169,15,33,0.25)' : 'none',
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateX(0)' : 'translateX(-28px)',
              transition: `opacity 0.65s ease ${220 + i * 90}ms, transform 0.65s ${EXPO} ${220 + i * 90}ms`,
            }}
          >
            {/* Numero */}
            <div
              className="shrink-0 flex items-center justify-center rounded-full"
              style={{
                width: 'clamp(2rem, 3.5vw, 2.8rem)',
                height: 'clamp(2rem, 3.5vw, 2.8rem)',
                backgroundColor: '#a90f21',
              }}
            >
              <span
                style={{
                  fontFamily: "'Nohemi', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                  color: 'white',
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
            </div>

            {/* Testo */}
            <div className="flex-1 min-w-0">
              <p
                style={{
                  fontFamily: "'Nohemi', sans-serif",
                  fontWeight: 700,
                  fontSize: 'clamp(0.85rem, 1.6vw, 1.2rem)',
                  color: '#2b2d42',
                  lineHeight: 1.2,
                  marginBottom: '0.15em',
                }}
              >
                {step.title}
              </p>
              <p
                className="hidden sm:block"
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 400,
                  fontSize: 'clamp(0.72rem, 1.1vw, 0.9rem)',
                  color: 'rgba(43,45,66,0.65)',
                  lineHeight: 1.5,
                }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
