// ============================================
// ASSE ZERO — SEO Component
// ============================================

import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_URL } from '@/lib/constants';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
}

export function SEO({
  title = `${SITE_NAME} — Produzione Video & Social Media Management`,
  description = 'ASSE ZERO è un team creativo specializzato in produzione video professionale e social media management. Strategia, produzione e gestione completa per il tuo brand.',
  canonical = SITE_URL,
  ogImage,
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
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
}
