// ============================================
// ASSE ZERO — Video Info (curtain)
// Parte testuale della sezione Video: titolo,
// categorie e descrizione del servizio.
// Curtain del layer subito dopo la VideoGallery,
// che ora contiene solo il player.
// ============================================

import { useReveal } from '@/hooks/useReveal';
import {
  MaskCurtain,
  MaskRevealInline,
  MASK_EXPO,
} from '@/components/layout/maskCurtain';
import { VIDEO_PILLS, VIDEO_DESCRIPTION } from '@/data/services';

// Griglia bento su 3 colonne: cella larga + cella singola, poi riga piena
const BENTO_SPANS = ['mask-bento__cell--span2', '', 'mask-bento__cell--full'];

export function VideoInfo() {
  const { ref, isRevealed } = useReveal({ threshold: 0.2 });

  return (
    <MaskCurtain ref={ref}>
      <header className="mask-curtain__head">
        <div className="mask-curtain__title-row">
          {['IL', 'SERVIZIO', 'VIDEO'].map((word, i) => (
            <MaskRevealInline key={word} isRevealed={isRevealed} delay={i * 110}>
              <span className="mask-display mask-display--inline">{word}</span>
            </MaskRevealInline>
          ))}
        </div>

        <div className="mask-video__pills">
          {VIDEO_PILLS.map((pill, i) => (
            <span
              key={pill}
              className="mask-video__pill"
              style={{
                opacity: isRevealed ? 1 : 0,
                transform: isRevealed ? 'translateY(0)' : 'translateY(16px)',
                transition: `opacity 0.5s ease ${300 + i * 70}ms, transform 0.5s ${MASK_EXPO} ${300 + i * 70}ms`,
              }}
            >
              <span className="mask-video__pill-num">{String(i + 1).padStart(2, '0')}</span>
              {pill}
            </span>
          ))}
        </div>
      </header>

      <div className={`mask-bento ${isRevealed ? 'mask-bento--revealed' : ''}`}>
        {VIDEO_DESCRIPTION.map((text, i) => (
          <div
            key={i}
            className={`mask-bento__cell ${BENTO_SPANS[i] ?? ''}`}
            style={{ transitionDelay: `${480 + i * 130}ms` }}
          >
            <span className="mask-bento__num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <p
              className="mask-body"
              dangerouslySetInnerHTML={{
                __html: text.replace(/<strong>/g, '<strong class="mask-em">'),
              }}
            />
          </div>
        ))}
      </div>
    </MaskCurtain>
  );
}
