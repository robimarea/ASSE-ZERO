import { useEffect, useState } from 'react';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial fetch, delayed slightly to ensure DOM gives correct height measurement
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9999] bg-transparent">
      <div 
        className="h-full bg-primary origin-left transition-all duration-75 ease-out shadow-[0_0_12px_3px_rgba(229,9,20,0.8)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
