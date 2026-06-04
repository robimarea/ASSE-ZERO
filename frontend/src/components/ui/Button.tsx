// ============================================
// ASSE ZERO — Button
// Effetto fill-from-bottom (da uiverse.io/adamgiebl)
// variant="primary" → su sfondo scuro (testo bianco)
// variant="light"   → su sfondo chiaro/giallo (testo rosso)
// ============================================

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'light';
  children: ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`btn-fill btn-fill--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
