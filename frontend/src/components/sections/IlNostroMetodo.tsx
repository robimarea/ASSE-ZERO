import { useReveal } from '@/hooks/useReveal';
import {
  MaskCurtain,
  MaskRevealLine,
  MASK_EXPO,
} from '@/components/layout/maskCurtain';

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
    <MaskCurtain ref={ref}>
      <header className="mask-curtain__head">
        <h2 className="mask-display mask-display--compact">
          <MaskRevealLine isRevealed={isRevealed} delay={0}>
            Il nostro
          </MaskRevealLine>
          <MaskRevealLine isRevealed={isRevealed} delay={110}>
            <span style={{ fontStyle: 'italic' }}>METODO</span>
          </MaskRevealLine>
        </h2>
      </header>

      <div className="mask-curtain__rows">
        {steps.map((step, i) => (
          <div
            key={step.title}
            className="mask-curtain__row mask-curtain__row--thin"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateX(0)' : 'translateX(-28px)',
              transition: `opacity 0.65s ease ${220 + i * 90}ms, transform 0.65s ${MASK_EXPO} ${220 + i * 90}ms`,
            }}
          >
            <span className="mask-step-num" aria-hidden="true">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="mask-step-title">{step.title}</p>
              <p className="mask-step-desc hidden sm:block">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </MaskCurtain>
  );
}
