export function Philosophy() {
  return (
    <section className="w-full h-screen bg-dark flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 overflow-hidden">
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
        "assestiamo
        <br />
        la tua idea,
        <br />
        <span style={{ color: '#ebdb00' }}>
          dalla{' '}
          <img
            src="/lettere/letter_a.png"
            alt="a"
            style={{ height: '0.85em', width: 'auto', verticalAlign: 'middle', display: 'inline' }}
          />
          {' '}alla{' '}
          <img
            src="/lettere/letter_z.png"
            alt="z"
            style={{ height: '0.85em', width: 'auto', verticalAlign: 'middle', display: 'inline' }}
          />
        </span>
        "
      </h2>
    </section>
  );
}
