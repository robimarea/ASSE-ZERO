// ============================================
// ASSE ZERO — SEO Component
// ============================================

import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({
  title = `${SITE_NAME} — Produzione Video & Social Media Management`,
  description = 'ASSE ZERO è un team creativo di 4 professionisti specializzati in produzione video professionale, social media management e content strategy. Spot pubblicitari, videoclip, documentari, reel cinematografici e gestione social su misura per il tuo brand.',
  canonical = SITE_URL,
  ogImage = DEFAULT_OG_IMAGE,
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter / X */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />
    </Helmet>
  );
}
