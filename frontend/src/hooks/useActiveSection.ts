// ============================================
// ASSE ZERO — useActiveSection Hook
// ============================================

import { useState, useEffect } from 'react';
import { SECTION_IDS } from '@/lib/constants';
import { navLinks } from '@/data/navigation';

const NAV_IDS = new Set(navLinks.map((l) => l.href.replace('#', '')));

export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS.home);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter(e => e.isIntersecting);
        const last = intersecting[intersecting.length - 1];
        if (last) setActiveSection(last.target.id);
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    NAV_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return activeSection;
}
