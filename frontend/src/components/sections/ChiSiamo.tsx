import { useReveal } from '@/hooks/useReveal';
import {
  MaskCurtain,
  MaskEm,
  MaskListStrong,
  MaskRevealLine,
  MASK_EXPO,
} from '@/components/layout/maskCurtain';

const TARGET_ITEMS = [
  {
    title: 'Piccole e medie imprese',
    desc: 'Raccontare prodotto e valori al proprio pubblico.',
  },
  {
    title: 'Hospitality & Food',
    desc: 'Ristoranti, hotel, bar, locali e strutture turistiche.',
  },
] as const;

const reveal = (isRevealed: boolean, delayMs: number, exitUp = false) => ({
  opacity: isRevealed ? 1 : 0,
  transform: isRevealed ? 'translateY(0)' : exitUp ? 'translateY(-28px)' : 'translateY(28px)',
  transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ${MASK_EXPO} ${delayMs}ms`,
});

export function ChiSiamo() {
  const { ref, isRevealed } = useReveal({ threshold: 0.2 });

  return (
    <MaskCurtain ref={ref} className="mask-curtain--chi-siamo">
      <header className="mask-curtain__head mask-curtain__head--chi">
        <h2 className="mask-display mask-display--chi">
          <MaskRevealLine isRevealed={isRevealed} delay={0}>
            Chi siamo
          </MaskRevealLine>
        </h2>
        <p className="mask-curtain__kicker" style={reveal(isRevealed, 180, true)}>
          Collettivo creativo · Rimini
        </p>
      </header>

      <div
        className="mask-curtain__rule"
        style={{
          transform: isRevealed ? 'scaleX(1)' : 'scaleX(0)',
          transition: `transform 0.85s ${MASK_EXPO} 220ms`,
        }}
      />

      <div className="mask-curtain__body mask-curtain__body--chi">
        <div className="mask-chi__narrative" style={reveal(isRevealed, 340)}>
          <p className="mask-body mask-body--lead">
            AsseZero è un collettivo di giovani professionisti che{' '}
            <MaskEm>produce e gestisce contenuti digitali</MaskEm>.
          </p>

          <ul className="mask-chi__services" aria-label="Servizi">
            <li>Videomaking</li>
            <li>Video editing</li>
            <li>Social media management</li>
          </ul>

          <p className="mask-body mask-body--muted">
            Portiamo un approccio <MaskEm>strategico</MaskEm> alla comunicazione online: analisi,
            obiettivi chiari e coerenza di <MaskEm>brand</MaskEm>, senza pacchetti standard.
          </p>
        </div>

        <aside className="mask-chi__aside" style={reveal(isRevealed, 460, true)}>
          <div className="mask-chi__panel">
            <span className="mask-label">Target</span>
            <ul className="mask-target-list">
              {TARGET_ITEMS.map((item) => (
                <li key={item.title} className="mask-chi__target-item">
                  <p className="mask-chi__target-title">
                    <MaskListStrong>{item.title}</MaskListStrong>
                  </p>
                  <p className="mask-chi__target-desc">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </MaskCurtain>
  );
}
