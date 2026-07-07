// ============================================
// ASSE ZERO — useActiveSection Hook
// ============================================

import { useState, useEffect } from 'react';
import { SECTION_IDS } from '@/lib/constants';

/**
 * Uses IntersectionObserver to determine which section
 * is currently most visible in the viewport.
 * Returns the active section ID for navbar highlighting.
 */
export function useActiveSection(): string {
  const [activeSection, setActiveSection] = useState<string>(SECTION_IDS.home);

  useEffect(() => {
    const sectionIds = Object.values(SECTION_IDS);

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

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return activeSection;
}
