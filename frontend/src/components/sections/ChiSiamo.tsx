const R = ({ children }: { children: React.ReactNode }) => (
  <strong style={{ color: '#a90f21', fontStyle: 'italic' }}>{children}</strong>
);

export function ChiSiamo() {
  return (
    <section className="w-full h-screen bg-primary flex flex-col px-6 md:px-16 py-10 md:py-14 overflow-hidden">

      {/* Titolo display — grande, occupa il suo spazio */}
      <div className="shrink-0 mb-6 md:mb-8">
        <h2
          style={{
            fontFamily: "'Nohemi', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(4rem, 11vw, 9rem)',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            color: '#a90f21',
          }}
        >
          Chi<br />siamo?
        </h2>
      </div>

      {/* Separatore */}
      <div className="shrink-0 mb-6 md:mb-8" style={{ height: '1.5px', backgroundColor: 'rgba(169,15,33,0.35)', width: '100%' }} />

      {/* Corpo — su due colonne su desktop */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 md:gap-16 min-h-0">

        {/* Colonna sinistra */}
        <div className="flex-1 flex flex-col justify-between">
          <p
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 500,
              fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
              lineHeight: 1.65,
              color: '#2b2d42',
            }}
          >
            AsseZero è un collettivo di giovani professionisti che si occupa di{' '}
            <R>produrre e gestire contenuti digitali,</R> offrendo servizi quali
            videomaking, videoediting e social media management.
          </p>

          <p
            className="mt-4 md:mt-0"
            style={{
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(0.88rem, 1.3vw, 1.05rem)',
              lineHeight: 1.65,
              color: 'rgba(43,45,66,0.75)',
            }}
          >
            La nostra realtà nasce per portare un approccio <R>strategico</R> e
            consapevole alla comunicazione digitale, dove ogni contenuto nasce da
            analisi, obiettivi chiari e una visione coerente del <R>brand</R>.
          </p>
        </div>

        {/* Separatore verticale */}
        <div
          className="hidden md:block shrink-0"
          style={{ width: '1.5px', backgroundColor: 'rgba(169,15,33,0.25)' }}
        />

        {/* Colonna destra — Target */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-start gap-4 md:gap-6">
            <span
              className="shrink-0 font-black uppercase rounded-full px-5 py-2"
              style={{
                fontFamily: "'Nohemi', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                backgroundColor: '#a90f21',
                color: 'white',
                letterSpacing: '0.08em',
              }}
            >
              Target
            </span>
            <div
              style={{
                fontFamily: "'Satoshi', sans-serif",
                fontWeight: 500,
                fontSize: 'clamp(0.88rem, 1.3vw, 1.05rem)',
                lineHeight: 1.7,
                color: '#2b2d42',
              }}
            >
              <p>
                — <strong>Piccole e Medie aziende</strong> che desiderano mostrare
                il proprio prodotto al pubblico
              </p>
              <p className="mt-2">
                — Realtà del settore{' '}
                <strong>Hospitality &amp; Food:</strong> ristoranti, hotel, bar,
                locali, strutture turistiche
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
