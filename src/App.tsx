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

function App() {
  return (
    <HelmetProvider>
      <SEO />
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

        {/* Contact acts as a curtain over Team! Wait, MaskChangeUI takes Contact as curtain, but what is its child? 
            If it has no child, it can't act as a curtain? 
            Actually, the logic is: MaskChangeUI(Philosophy) has child Team. 
            So Team is revealed when Philosophy lifts. 
            Then we need Contact to cover Team. 
            So Contact MUST be a MaskChangeUI with overlapPrev={true}. 
            But what is the child of Contact? The Footer!
            If we make Footer the child, we must ensure it doesn't stick to the top and get hidden.
        */}
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
