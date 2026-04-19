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

function App() {
  return (
    <HelmetProvider>
      <SEO />
      <Navbar />

      <main>
        <Hero />
        <Showreel />
        <Services section="video" />
        <Services section="smm" />
        <Philosophy />
        <Team />
        <Contact />
      </main>

      <Footer />
    </HelmetProvider>
  );
}

export default App;
