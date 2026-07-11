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

      <div className="mask-curtain__rows">
        {VIDEO_DESCRIPTION.map((text, i) => (
          <div
            key={i}
            className="mask-curtain__row"
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? 'translateY(0)' : 'translateY(28px)',
              transition: `opacity 0.7s ease ${480 + i * 120}ms, transform 0.7s ${MASK_EXPO} ${480 + i * 120}ms`,
            }}
          >
            <span className="mask-index" aria-hidden="true">
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
