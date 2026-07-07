// ============================================
// ASSE ZERO — WhatsApp Floating Button
// Pulsante fisso bottom-right, visibile su tutta la pagina
// ============================================

import { WHATSAPP_URL } from '@/lib/constants';
import { IconWhatsApp } from '@/components/ui/Icons';

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contattaci su WhatsApp"
      className="wa-float-btn"
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 9000,
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        backgroundColor: '#25D366',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease, opacity 0.4s ease',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 28px rgba(37,211,102,0.65)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 20px rgba(37,211,102,0.45)';
      }}
    >
      {/* Pulse ring */}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '2px solid rgba(37,211,102,0.6)',
          animation: 'wa-pulse 2.5s ease-out infinite',
        }}
        aria-hidden="true"
      />
      <IconWhatsApp size={30} style={{ color: '#ffffff' }} />
    </a>
  );
}
