import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/useIsMobile';
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
import { PercheScegliere } from '@/components/sections/PercheScegliere';
import { ChiSiamo } from '@/components/sections/ChiSiamo';
import { IlNostroMetodo } from '@/components/sections/IlNostroMetodo';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { SECTION_IDS } from '@/lib/constants';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

const Showreel = lazy(() =>
  import('@/components/sections/Showreel').then((m) => ({ default: m.Showreel }))
);

function App() {
  const isMobile = useIsMobile();
  useSmoothScroll();

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
      <WhatsAppButton />
      <Navbar />

      <main className="bg-dark">

        {/* ── Layer 0: Hero → Showreel ── */}
        <MaskChangeUI curtain={<Hero />} zIndex={50} layerOrder={0} extraStickyDistanceH={2}>
          <ErrorBoundary fallback={<section className="min-h-screen bg-dark" />}>
            <Suspense fallback={<section className="min-h-screen bg-dark" />}>
              <Viewport id={SECTION_IDS.showreel}>
                {(isVisible) => <Showreel isVisible={isVisible} />}
              </Viewport>
            </Suspense>
          </ErrorBoundary>
        </MaskChangeUI>

        {/* ── Layer 1: Perchè scegliere → VideoGallery ── */}
        <MaskChangeUI curtain={<PercheScegliere />} zIndex={45} layerOrder={1} extraStickyDistanceH={5}>
          <Viewport id={SECTION_IDS.video}>
            {(isVisible) => <VideoGallery isVisible={isVisible} />}
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 2: Cover → Services ── */}
        <MaskChangeUI curtain={<div className="w-full h-screen bg-primary" />} zIndex={40} layerOrder={2} extraStickyDistanceH={2}>
          <Viewport id={SECTION_IDS.smm}>
            {(isVisible) => <Services isVisible={isVisible} />}
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 3: Chi siamo → Philosophy ── */}
        <MaskChangeUI curtain={<ChiSiamo />} zIndex={35} layerOrder={3} extraStickyDistanceH={1}>
          <Philosophy />
        </MaskChangeUI>

        {/* ── Layer 4: Il nostro Metodo → Team ── */}
        <MaskChangeUI curtain={<IlNostroMetodo />} zIndex={30} layerOrder={4} extraStickyDistanceH={isMobile ? 3 : 7}>
          <Viewport id={SECTION_IDS.team}>
            {(isVisible) => <Team isVisible={isVisible} />}
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 5: Cover → Contact ── */}
        <MaskChangeUI curtain={<div className="w-full h-screen bg-primary" />} zIndex={25} layerOrder={5} extraStickyDistanceH={1}>
          <Viewport id={SECTION_IDS.contact}>
            <Contact />
          </Viewport>
        </MaskChangeUI>

        {/* ── Layer 6: Cover → Footer ── */}
        <MaskChangeUI curtain={<div className="w-full h-screen bg-primary" />} zIndex={20} layerOrder={6} extraStickyDistanceH={1}>
          <div className="bg-dark w-full flex flex-col justify-end min-h-screen">
            <Footer />
          </div>
        </MaskChangeUI>

      </main>
    </HelmetProvider>
  );
}

export default App;
