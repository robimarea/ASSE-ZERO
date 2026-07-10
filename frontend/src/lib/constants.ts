// ============================================
// ASSE ZERO — Global Constants
// ============================================

export const SITE_NAME = 'ASSE ZERO';
export const SITE_URL = 'https://assezero.com';

export const SECTION_IDS = {
  home: 'home',
  showreel: 'showreel',
  video: 'video',
  smm: 'smm',
  team: 'team',
  contact: 'contatti',
} as const;

// ── Contatti Brand ─────────────────────────────────────────────────────────
export const CONTACT_EMAIL = 'assezeroinfo@gmail.com';
export const WHATSAPP_NUMBER = '393492425835'; // formato internazionale senza +
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Ciao ASSE ZERO! Vorrei parlarvi di un progetto.')}`;
export const INSTAGRAM_URL = 'https://www.instagram.com/assezero?igsh=MTFsMDFmb2drcmQxMg==';

// ── Easing condivisi ───────────────────────────────────────────────────────
export const EASE_EXPO   = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const EASE_SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

// ── Endpoint form contatti (Web3Forms — gratuito, invia a qualsiasi Gmail) ──
// Registra l'email su https://web3forms.com/ e ricevi il tuo access_key.
// Poi crea il file frontend/.env con: VITE_WEB3FORMS_KEY=la_tua_chiave
// Se la variabile non è configurata, il form mostra un fallback mailto.
export const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? '';
export const CONTACT_FORM_ENDPOINT = 'https://api.web3forms.com/submit';

