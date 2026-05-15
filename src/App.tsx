import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from '@/lib/seo';
import { Navbar } from '@/components/layout/Navbar';
import TargetCursor from '@/components/TargetCursor';
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
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

import { SECTION_IDS } from '@/lib/constants';

const Showreel = lazy(() =>
  import('@/components/sections/Showreel').then((m) => ({ default: m.Showreel }))
);

// Tenda di transizione — sempre gialla (#E9AC06)
function Cover() {
  return <div className="w-full h-screen bg-primary" />;
}

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <TargetCursor
        spinDuration={3.9}
        hideDefaultCursor={true}
        parallaxOn={false}
        hoverDuration={0.35}
      />
      <ScrollProgress />
      <Navbar />

      <main className="bg-dark">

        {/* ── Layer 0: Hero (curtain giallo) → Showreel ── */}
        <MaskChangeUI curtain={<Hero />} zIndex={50} layerOrder={0}>
          <ErrorBoundary fallback={<section className="min-h-screen bg-dark" />}>
            <Suspense fallback={<section className="min-h-screen bg-dark" />}>
              <Viewport id={SECTION_IDS.showreel}>
                {(isVisible) => <Showreel isVisible={isVisible} />}
              </Viewport>
            </Suspense>
          </ErrorBoundary>
        </MaskChangeUI>

        {/* ── Layer 1: Cover gialla → VideoGallery (nero) ── */}
        <MaskChangeUI curtain={<Cover />} zIndex={45} layerOrder={1}>
          <Viewport id={SECTION_IDS.video}>
            {(isVisible) => <VideoGallery isVisible={isVisible} />}
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 2: Cover gialla → Services SMM (nero) ── */}
        <MaskChangeUI curtain={<Cover />} zIndex={40} layerOrder={2}>
          <Viewport id={SECTION_IDS.smm}>
            {(isVisible) => (
              <Services section="smm" overlapNext={true} isVisible={isVisible} />
            )}
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 3: Cover gialla → Philosophy (nero) ── */}
        <MaskChangeUI curtain={<Cover />} zIndex={35} layerOrder={3}>
          <Philosophy />
        </MaskChangeUI>

        {/* ── Layer 4: Cover gialla → Team (nero) ── */}
        <MaskChangeUI curtain={<Cover />} zIndex={30} layerOrder={4} extraStickyDistanceH={7}>
          <Viewport id={SECTION_IDS.team}>
            {(isVisible) => <Team isVisible={isVisible} />}
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 5: Cover gialla → Contact (nero) ── */}
        <MaskChangeUI curtain={<Cover />} zIndex={25} layerOrder={5}>
          <Viewport id={SECTION_IDS.contact}>
            <Contact />
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 6: Cover gialla → Footer (nero) ── */}
        <MaskChangeUI curtain={<Cover />} zIndex={20} layerOrder={6}>
          <div className="bg-dark w-full flex flex-col justify-end min-h-screen">
            <Footer />
          </div>
        </MaskChangeUI>

      </main>
    </HelmetProvider>
  );
}

export default App;
