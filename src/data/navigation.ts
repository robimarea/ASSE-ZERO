// ============================================
// ASSE ZERO — Navigation Data
// ============================================

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Servizi', href: '#servizi' },
  { label: 'Team', href: '#team' },
  { label: 'Contatti', href: '#contatti' },
];
