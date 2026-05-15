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
const Showreel = lazy(() => import('@/components/sections/Showreel').then((m) => ({ default: m.Showreel })));

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
        <MaskChangeUI curtain={<Hero />} zIndex={50} layerOrder={0}>
          <ErrorBoundary fallback={<section className="min-h-screen bg-dark" />}>
            <Suspense fallback={<section className="min-h-screen bg-dark" />}>
              <Viewport id="showreel">
                {(isVisible) => <Showreel isVisible={isVisible} />}
              </Viewport>
            </Suspense>
          </ErrorBoundary>
        </MaskChangeUI>

        <Viewport id="video-gallery">
          {(isVisible) => <VideoGallery isVisible={isVisible} />}
        </Viewport>

        <Viewport id="smm">
          {(isVisible) => <Services section="smm" overlapNext={true} isVisible={isVisible} />}
        </Viewport>

        <Philosophy />

        <Viewport id="team" reveal stagger>
          <Team />
        </Viewport>

        <Viewport id="contatti" reveal stagger>
          <Contact />
        </Viewport>

        <div className="bg-primary w-full flex flex-col justify-end min-h-screen">
          <Footer />
        </div>
      </main>
    </HelmetProvider>
  );
}

export default App;
