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
  return (
    <section className="w-full h-screen bg-primary flex flex-col px-6 md:px-16 py-10 md:py-12 overflow-hidden">

      {/* Titolo */}
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
          Il nostro{' '}
          <span style={{ fontStyle: 'italic' }}>METODO</span>
        </h2>
      </div>

      {/* Steps — riempiono il resto */}
      <div className="flex-1 flex flex-col min-h-0">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex-1 flex items-center gap-4 md:gap-6"
            style={{ borderTop: '1px solid rgba(169,15,33,0.25)', borderBottom: i === 4 ? '1px solid rgba(169,15,33,0.25)' : 'none' }}
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
                  fontSize: 'clamp(0.9rem, 1.6vw, 1.2rem)',
                  color: '#2b2d42',
                  lineHeight: 1.2,
                  marginBottom: '0.2em',
                }}
              >
                {step.title}
              </p>
              <p
                style={{
                  fontFamily: "'Satoshi', sans-serif",
                  fontWeight: 400,
                  fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
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
