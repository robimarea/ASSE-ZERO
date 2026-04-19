// ============================================
// ASSE ZERO — App Root Component
// ============================================

import { HelmetProvider } from 'react-helmet-async';
import { SEO } from '@/lib/seo';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Showreel } from '@/components/sections/Showreel';
import { Services } from '@/components/sections/Services';
import { Philosophy } from '@/components/sections/Philosophy';
import { Team } from '@/components/sections/Team';
import { Contact } from '@/components/sections/Contact';
import { CurtainReveal } from '@/components/layout/CurtainReveal';

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <Navbar />

      <main className="bg-dark">
        <CurtainReveal curtain={<Hero />} zIndex={50}>
          <Showreel />
        </CurtainReveal>

        <Services section="video" />
        <Services section="smm" overlapNext={true} />

        <CurtainReveal curtain={<Philosophy />} zIndex={40} overlapPrev={true} extraStickyDistanceH={1}>
          <Team />
        </CurtainReveal>

        <CurtainReveal curtain={<Contact />} zIndex={30} overlapPrev={true}>
          <div className="bg-dark w-full">
            <Footer />
          </div>
        </CurtainReveal>
      </main>
    </HelmetProvider>
  );
}

export default App;
