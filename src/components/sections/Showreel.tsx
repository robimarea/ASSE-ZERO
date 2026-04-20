// ============================================
// ASSE ZERO — Showreel Section
// ============================================

import { useRef, useEffect, useState } from 'react';

const SHOWREEL_ASSETS = [
  { id: 1, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', title: 'CAT VIDEO 01' },
  { id: 2, image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', title: 'CAT VIDEO 02' },
  { id: 3, image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', title: 'CAT VIDEO 03' },
];

export function Showreel() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const scrollableDistance = containerRef.current.offsetHeight - window.innerHeight;
      
      // Calculate progress (0 to 1)
      const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
      
      // Calculate active index based on progress
      const numItems = SHOWREEL_ASSETS.length;
      let newIndex = Math.floor(progress * numItems);
      if (newIndex >= numItems) newIndex = numItems - 1;
      
      setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full bg-dark z-0" style={{ height: '300vh' }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-dark">
        {SHOWREEL_ASSETS.map((asset, index) => {
          const isActive = index === activeIndex;
          return (
            <div 
              key={asset.id}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center justify-center ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Blurred Background */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                 <img 
                   src={asset.image} 
                   alt="Background" 
                   className="w-full h-full object-cover opacity-50 transform scale-110 filter blur-2xl"
                 />
                 <div className="absolute inset-0 bg-black/50"></div>
              </div>

              {/* Focused Foreground Image */}
              <div className="relative z-10 w-[85%] max-w-5xl aspect-video bg-dark-secondary rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-transform duration-1000 ease-out hover:scale-[1.02] cursor-pointer group">
                 <img 
                   src={asset.image} 
                   alt={asset.title} 
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors duration-500">
                   <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center backdrop-blur-md transform scale-90 group-hover:scale-110 transition-transform duration-500 shadow-xl">
                     <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10 ml-2">
                       <path d="M8 5v14l11-7z" />
                     </svg>
                   </div>
                 </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
