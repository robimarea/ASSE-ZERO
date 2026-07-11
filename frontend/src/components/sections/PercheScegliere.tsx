import { useReveal } from '@/hooks/useReveal';
import {
  MaskCurtain,
  MaskEm,
  MaskRevealInline,
} from '@/components/layout/maskCurtain';

// Griglia bento su 3 colonne: cella alta a sinistra (2 righe),
// due celle larghe impilate a destra
const BENTO_SPANS = [
  'mask-bento__cell--tall',
  'mask-bento__cell--span2',
  'mask-bento__cell--span2',
];

const reasons = [
  {
    num: '01',
    text: (
      <>
        Perchè il cliente è <MaskEm>univoco</MaskEm> — così come la <MaskEm>strategia</MaskEm> elaborata
        attorno a lui. Niente pacchetti standard: ogni progetto nasce da zero.
      </>
    ),
  },
  {
    num: '02',
    text: (
      <>
        Siamo giovani professionisti, ma sopratutto <MaskEm>nativi digitali</MaskEm> che sanno
        come interfacciarsi a logiche social moderne con un approccio{' '}
        <MaskEm>fresco e dinamico.</MaskEm>
      </>
    ),
  },
  {
    num: '03',
    text: (
      <>
        Perchè passo dopo passo lavoriamo <MaskEm>a fianco del cliente,</MaskEm> rimanendo
        sempre disponibili per garantire comunicazione e{' '}
        <MaskEm>risultati sinergici.</MaskEm>
      </>
    ),
  },
];

export function PercheScegliere() {
  const { ref, isRevealed } = useReveal({ threshold: 0.2 });

  return (
    <MaskCurtain ref={ref}>
      <header className="mask-curtain__head">
        <div className="mask-curtain__title-row">
          {['PERCHÈ', 'SCEGLIERE'].map((word, i) => (
            <MaskRevealInline key={word} isRevealed={isRevealed} delay={i * 110}>
              <span className="mask-display mask-display--inline">{word}</span>
            </MaskRevealInline>
          ))}
          <MaskRevealInline isRevealed={isRevealed} delay={220}>
            <img src="/logo.png" alt="AsseZero" className="mask-curtain__logo" />
          </MaskRevealInline>
          <MaskRevealInline isRevealed={isRevealed} delay={320}>
            <span className="mask-display mask-display--inline">?</span>
          </MaskRevealInline>
        </div>
      </header>

      <div className={`mask-bento ${isRevealed ? 'mask-bento--revealed' : ''}`}>
        {reasons.map((r, i) => (
          <div
            key={r.num}
            className={`mask-bento__cell ${BENTO_SPANS[i] ?? ''}`}
            style={{ transitionDelay: `${420 + i * 130}ms` }}
          >
            <span className="mask-bento__num" aria-hidden="true">
              {r.num}
            </span>
            <p className="mask-body">{r.text}</p>
          </div>
        ))}
      </div>
    </MaskCurtain>
  );
}
