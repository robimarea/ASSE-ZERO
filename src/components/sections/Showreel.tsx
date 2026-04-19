// ============================================
// ASSE ZERO — Showreel Section
// ============================================

export function Showreel() {
  return (
    <section className="w-full h-screen bg-dark flex items-center justify-center">
      <div className="w-full h-full relative flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Showreel Placeholder" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-primary/80 rounded-full flex items-center justify-center backdrop-blur-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10 ml-2">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
