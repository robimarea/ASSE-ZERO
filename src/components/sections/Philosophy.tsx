// ============================================
// ASSE ZERO — Philosophy Section
// ============================================

export function Philosophy() {
  return (
    <section className="w-full min-h-screen bg-secondary flex flex-col items-center justify-center py-32">
      <div className="w-full max-w-5xl mx-auto px-6 lg:px-12 flex flex-col items-start text-dark">
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight mb-8" style={{lineHeight: 1.1}}>
          "assestiamo la tua idea,<br />dalla a alla z"
        </h2>
        <div className="max-w-2xl text-lg sm:text-xl font-medium leading-snug">
          <p className="mb-4">
            Crediamo nel valore del contatto umano: niente formule standard, solo
            soluzioni efficaci costruite su di te.
          </p>
          <p>
            Uniamo professionalità e innovazione per offrirti un servizio fresco,
            dinamico e sviluppato su misura per le tue esigenze.
            Lavoriamo al tuo fianco, passo dopo passo, per garantirti il risultato
            migliore.
          </p>
        </div>
      </div>
    </section>
  );
}
