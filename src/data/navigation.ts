// ============================================
// ASSE ZERO — Navigation Data
// ============================================

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: 'Home',     href: '#home' },
  { label: 'Video',    href: '#servizi' },
  { label: 'Social',   href: '#services-smm' },
  { label: 'Team',     href: '#team' },
  { label: 'Contatti', href: '#contatti' },
];
