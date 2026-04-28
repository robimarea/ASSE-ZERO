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
import { MaskChangeUI } from '@/components/layout/MaskChange';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import SplashCursor from '@/components/ui/SplashCursor';

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <SplashCursor
        DENSITY_DISSIPATION={5}
        VELOCITY_DISSIPATION={8}
        PRESSURE={0.15}
        CURL={5}
        SPLAT_RADIUS={0.07}
        SPLAT_FORCE={11000}
        COLOR_UPDATE_SPEED={9}
        SHADING
        RAINBOW_MODE={false}
        COLOR="var(--color-primary)"
      />
      <ScrollProgress />
      <Navbar />

      <main className="bg-dark">
        <MaskChangeUI curtain={<Hero />} zIndex={50}>
          <Showreel />
        </MaskChangeUI>

        <Services section="video" />
        <Services section="smm" overlapNext={true} />

        <MaskChangeUI curtain={<Philosophy />} zIndex={40} overlapPrev={true} extraStickyDistanceH={1}>
          <Team />
        </MaskChangeUI>

        <MaskChangeUI curtain={<Contact />} zIndex={30} overlapPrev={true}>
          <div className="bg-primary w-full flex flex-col justify-end min-h-screen">
             <Footer />
          </div>
        </MaskChangeUI>
      </main>
    </HelmetProvider>
  );
}

export default App;
