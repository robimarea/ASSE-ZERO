// ============================================
// ASSE ZERO — App Root Component
// ============================================

import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from '@/lib/seo';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { VideoGallery } from '@/components/sections/VideoGallery';
import { Philosophy } from '@/components/sections/Philosophy';
import { Team } from '@/components/sections/Team';
import { Contact } from '@/components/sections/Contact';
import { MaskChangeUI } from '@/components/layout/MaskChange';
import { Viewport } from '@/components/layout/Viewport';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
const Showreel = lazy(() => import('@/components/sections/Showreel').then((m) => ({ default: m.Showreel })));
const SplashCursor = lazy(() => import('@/components/ui/SplashCursor'));

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <Suspense fallback={null}>
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
      </Suspense>
      <ScrollProgress />
      <Navbar />

      <main className="bg-dark">
        <MaskChangeUI curtain={<Hero />} zIndex={50}>
          <Suspense fallback={<section className="min-h-screen bg-dark" />}>
            <Viewport id="showreel">
              {(isVisible) => <Showreel isVisible={isVisible} />}
            </Viewport>
          </Suspense>
        </MaskChangeUI>

        <Viewport id="video">
          {(isVisible) => <VideoGallery isVisible={isVisible} />}
        </Viewport>
        <Viewport id="smm">
          {(isVisible) => <Services section="smm" overlapNext={true} isVisible={isVisible} />}
        </Viewport>

        <MaskChangeUI curtain={<Philosophy />} zIndex={40} overlapPrev={true} extraStickyDistanceH={1}>
          <Viewport id="team" reveal stagger>
            <Team />
          </Viewport>
        </MaskChangeUI>

        <MaskChangeUI curtain={<Contact />} zIndex={30} overlapPrev={true}>
          <Viewport id="contatti" reveal stagger>
            <div className="bg-primary w-full flex flex-col justify-end min-h-screen">
               <Footer />
            </div>
          </Viewport>
        </MaskChangeUI>
      </main>
    </HelmetProvider>
  );
}

export default App;
