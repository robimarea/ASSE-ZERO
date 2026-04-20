// ============================================
// ASSE ZERO — Global Constants
// ============================================

export const SITE_NAME = 'ASSE ZERO';
export const SITE_TAGLINE = 'Produzione Video & Social Media Management';
export const SITE_DESCRIPTION =
  'ASSE ZERO è un team creativo specializzato in produzione video professionale e social media management. Strategia, produzione e gestione completa per il tuo brand.';
export const SITE_URL = 'https://assezero.com';

export const SECTION_IDS = {
  home: 'home',
  services: 'servizi',
  team: 'team',
  contact: 'contatti',
} as const;

// Spring config usata dal menu mobile
export const SPRING_CONFIG = {
  bouncy: { mass: 1, tension: 280, friction: 14 },
} as const;
