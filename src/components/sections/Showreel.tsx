import { useEffect, useMemo, useRef, useState } from 'react';
import { SHOWREEL_ASSETS, type ShowreelAsset } from '@/data/showreelAssets';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { clamp, damp, lerp, smoothstep } from '@/lib/math';
import { createPortal } from 'react-dom';

type TunnelConfig = {
  sectionHeight: string;
  travelPadding: number;
  depthStep: number;
  relativeCull: number;
  visibleWindow: number;
  focusWindow: number;
  rearScale: number;
  focusScale: number;
  frontScale: number;
  tunnelRadiusX: number;
  tunnelRadiusY: number;
  driftX: number;
  driftY: number;
  trailSpreadX: number;
  trailSpreadY: number;
  scatterJitterX: number;
  scatterJitterY: number;
  spreadAnchorX: number;
  spreadAnchorY: number;
  pointerInfluenceX: number;
  pointerInfluenceY: number;
  rearBlur: number;
  frontBlur: number;
  rearOpacity: number;
  frontOpacity: number;
  followLambda: number;
  pointerLambda: number;
  focusLift: number;
};

const DESKTOP_CONFIG: TunnelConfig = {
  sectionHeight: '680vh',
  travelPadding: 0.58,
  depthStep: 290,
  relativeCull: 1.4,
  visibleWindow: 1.4,
  focusWindow: 0.58,
  rearScale: 0.64,
  focusScale: 0.82,
  frontScale: 0.78,
  tunnelRadiusX: 110,
  tunnelRadiusY: 68,
  driftX: 2,
  driftY: 2,
  trailSpreadX: 0,
  trailSpreadY: 0,
  scatterJitterX: 132,
  scatterJitterY: 82,
  spreadAnchorX: 340,
  spreadAnchorY: 210,
  pointerInfluenceX: 28,
  pointerInfluenceY: 22,
  rearBlur: 14,
  frontBlur: 28,
  rearOpacity: 0.02,
  frontOpacity: 0.01,
  followLambda: 5.5,
  pointerLambda: 6.0,
  focusLift: 4,
};

const MOBILE_CONFIG: TunnelConfig = {
  sectionHeight: '760vh',
  travelPadding: 0.62,
  depthStep: 230,
  relativeCull: 1.35,
  visibleWindow: 1.35,
  focusWindow: 0.6,
  rearScale: 0.7,
  focusScale: 0.86,
  frontScale: 0.82,
  tunnelRadiusX: 58,
  tunnelRadiusY: 38,
  driftX: 1.5,
  driftY: 1.5,
  trailSpreadX: 0,
  trailSpreadY: 0,
  scatterJitterX: 72,
  scatterJitterY: 46,
  spreadAnchorX: 156,
  spreadAnchorY: 102,
  pointerInfluenceX: 18,
  pointerInfluenceY: 14,
  rearBlur: 11,
  frontBlur: 20,
  rearOpacity: 0.03,
  frontOpacity: 0.02,
  followLambda: 6.8,
  pointerLambda: 7.0,
  focusLift: 3,
};

function getPreviewSource(asset: ShowreelAsset) {
  return asset.kind === 'video' ? asset.poster : asset.src;
}

// ── LIGHTBOX COMPONENT ──
function Lightbox({ asset, onClose }: { asset: ShowreelAsset; onClose: () => void }) {
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    const timer = requestAnimationFrame(() => setActive(true));
    return () => cancelAnimationFrame(timer);
  }, []);

  return createPortal(
    <div 
      className={`fixed inset-0 z-[1000] flex items-center justify-center transition-all duration-700 ease-out-expo ${active ? 'bg-black/95 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none pointer-events-none'}`}
      onClick={onClose}
    >
      <div 
        className={`relative w-[min(90vw,70rem)] aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition-all duration-700 ease-out-expo ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {asset.kind === 'video' ? (
          <video 
            src={asset.src} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <img 
            src={asset.src} 
            alt={asset.title} 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-2">{asset.label}</p>
          <h2 className="text-white text-3xl font-heading font-black tracking-tight">{asset.title}</h2>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl transition-colors"
        >
          ×
        </button>
      </div>
    </div>,
    document.body
  );
}

interface ShowreelProps {
  isVisible?: boolean;
}

export function Showreel({ isVisible = true }: ShowreelProps) {
  const containerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const targetTravelRef = useRef(0);
  const travelRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const activeIndexRef = useRef(0);
  const visibleIndicesRef = useRef<Set<number>>(new Set());
  const activeTitleRef = useRef<HTMLDivElement>(null);
  const activeLabelRef = useRef<HTMLDivElement>(null);
  
  const [selectedAsset, setSelectedAsset] = useState<ShowreelAsset | null>(null);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;

  const previewSources = useMemo(() => SHOWREEL_ASSETS.map(getPreviewSource), []);

  const cardOffsets = useMemo(() => {
    return SHOWREEL_ASSETS.map((_, index) => {
      const anchorXDir = index % 2 === 0 ? -1 : 1;
      const anchorYDir = index % 3 === 0 ? -1 : 1;
      const anchorX = anchorXDir * (config.spreadAnchorX + Math.sin(index * 1.83) * config.tunnelRadiusX);
      const anchorY = anchorYDir * (config.spreadAnchorY + Math.cos(index * 1.29) * config.tunnelRadiusY);
      return {
        baseX: anchorX + Math.sin(index * 2.37 + 0.6) * config.scatterJitterX,
        baseY: anchorY + Math.cos(index * 1.93 + 0.2) * config.scatterJitterY,
        jitterSeed: index,
      };
    });
  }, [config]);

  useEffect(() => {
    let frameId = 0;
    let lastFrameTime = performance.now();
    let sectionTop = 0;
    let sectionHeight = 0;

    const updateMetrics = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      sectionTop = rect.top + window.scrollY;
      sectionHeight = containerRef.current.offsetHeight;
    };

    const updateTargetTravel = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const sectionEnd = sectionTop + sectionHeight - window.innerHeight;
      const progress = clamp((scrollY - sectionTop) / Math.max(sectionEnd - sectionTop, 1), 0, 1);
      const travelStart = -config.travelPadding;
      const travelEnd = (SHOWREEL_ASSETS.length - 1) + config.travelPadding;
      targetTravelRef.current = lerp(travelStart, travelEnd, progress);
    };

    const animate = (now: number) => {
      const deltaSeconds = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;

      const scrollDelta = Math.abs(targetTravelRef.current - travelRef.current);
      if (scrollDelta < 0.001) {
        travelRef.current = targetTravelRef.current;
      } else {
        travelRef.current = damp(travelRef.current, targetTravelRef.current, config.followLambda, deltaSeconds);
      }

      pointerRef.current.x = damp(pointerRef.current.x, pointerTargetRef.current.x, config.pointerLambda, deltaSeconds);
      pointerRef.current.y = damp(pointerRef.current.y, pointerTargetRef.current.y, config.pointerLambda, deltaSeconds);

      const travel = travelRef.current;
      const time = now * 0.001;

      const active = clamp(Math.round(travel), 0, SHOWREEL_ASSETS.length - 1);
      if (active !== activeIndexRef.current) {
        activeIndexRef.current = active;
        const asset = SHOWREEL_ASSETS[active];
        if (activeTitleRef.current) activeTitleRef.current.textContent = asset.title;
        if (activeLabelRef.current) activeLabelRef.current.textContent = asset.label;
      }

      const visibleStart = Math.max(0, Math.floor(travel - config.visibleWindow));
      const visibleEnd = Math.min(SHOWREEL_ASSETS.length - 1, Math.ceil(travel + config.visibleWindow));

      const nextVisibleIndices = new Set<number>();
      for (let i = visibleStart; i <= visibleEnd; i++) nextVisibleIndices.add(i);

      visibleIndicesRef.current.forEach((prevIndex) => {
        if (!nextVisibleIndices.has(prevIndex)) {
          const card = cardRefs.current[prevIndex];
          if (card) card.style.display = 'none';
        }
      });

      nextVisibleIndices.forEach((index) => {
        const card = cardRefs.current[index];
        if (!card) return;

        const relative = index - travel;
        const distance = Math.abs(relative);

        if (distance > config.visibleWindow) {
          if (card.style.display !== 'none') card.style.display = 'none';
          return;
        }

        if (card.style.display !== 'block') card.style.display = 'block';

        const offset = cardOffsets[index];
        const focusMix = smoothstep(config.focusWindow, 0, distance);
        const isPastFocus = relative < 0;

        const dreamDriftX = Math.sin(time * 0.22 + index * 1.61) * config.driftX;
        const dreamDriftY = Math.cos(time * 0.2 + index * 1.27) * config.driftY;
        const pointerInfluence = 0.34 + focusMix * 0.72;
        const pointerX = pointerRef.current.x * config.pointerInfluenceX * pointerInfluence;
        const pointerY = pointerRef.current.y * config.pointerInfluenceY * pointerInfluence;

        const x = offset.baseX + dreamDriftX + pointerX;
        const y = offset.baseY + dreamDriftY - pointerY - focusMix * config.focusLift;
        const z = -relative * config.depthStep;

        const curveAmount = clamp(distance / config.relativeCull, 0, 1);
        const curve = smoothstep(0, 1, curveAmount);

        const scale = isPastFocus
          ? lerp(config.focusScale, config.frontScale, curve)
          : lerp(config.focusScale, config.rearScale, curve);

        const opacity = isPastFocus
          ? lerp(1, config.frontOpacity, curve)
          : lerp(1, config.rearOpacity, curve);

        const rotateX = dreamDriftY * 0.08 - pointerRef.current.y * 2.3 * (0.18 + focusMix * 0.34);
        const rotateY = dreamDriftX * 0.08 + pointerRef.current.x * 2.9 * (0.18 + focusMix * 0.34);

        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(0)}px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = `${opacity.toFixed(3)}`;
        if (card.style.filter !== 'none') card.style.filter = 'none';
        card.style.zIndex = `${1000 - Math.round(relative * 100)}`;
      });

      visibleIndicesRef.current = nextVisibleIndices;
      frameId = window.requestAnimationFrame(animate);
    };

    const handleScroll = () => updateTargetTravel();
    const handleResize = () => { updateMetrics(); updateTargetTravel(); };
    const handlePointerMove = (event: PointerEvent) => {
      pointerTargetRef.current.x = ((event.clientX / window.innerWidth) * 2 - 1) * -1;
      pointerTargetRef.current.y = ((event.clientY / window.innerHeight) * 2 - 1) * -1;
    };
    const handlePointerLeave = () => { pointerTargetRef.current.x = 0; pointerTargetRef.current.y = 0; };

    updateMetrics();
    updateTargetTravel();
    if (isVisible) frameId = window.requestAnimationFrame(animate);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [config, cardOffsets, isVisible]);

  return (
    <section
      ref={containerRef}
      className="relative z-0 w-full bg-dark"
      style={{ height: config.sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_18%_24%,rgba(233,172,6,0.07),transparent_22%),radial-gradient(circle_at_82%_74%,rgba(191,51,32,0.08),transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,8,0.08),rgba(5,5,8,0.74))]" />

        {/* 3D Container */}
        <div className="absolute inset-0 [perspective:1600px]">
          <div className="relative h-full w-full [transform-style:preserve-3d]">
            {SHOWREEL_ASSETS.map((asset, index) => (
              <article
                key={asset.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                onClick={() => setSelectedAsset(asset)}
                className="absolute left-1/2 top-1/2 w-[min(68vw,20rem)] md:w-[min(38vw,28rem)] will-change-transform cursor-pointer group"
                style={{
                  display: 'none',
                  opacity: 0,
                  transform: 'translate(-50%, -50%) translate3d(0, 0, -300px) scale(0.8)',
                }}
              >
                <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#09090b] shadow-[0_28px_90px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:scale-[1.03] group-hover:border-primary/30">
                  <div className="relative aspect-[235/160]">
                    <img
                      src={previewSources[index]}
                      alt={asset.title}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,6,0.02),rgba(4,4,6,0.26))]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.10),transparent_26%),radial-gradient(circle_at_80%_82%,rgba(233,172,6,0.10),transparent_24%)] mix-blend-screen" />
                    
                    {/* Hover state overlay */}
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 flex items-center justify-center">
                       <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                       </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Active Asset Info - Bottom Center */}
        <div className="pointer-events-none absolute bottom-12 left-1/2 z-30 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 px-5 py-3 text-center md:bottom-16">
          <div 
            ref={activeLabelRef}
            className="text-[0.65rem] font-bold uppercase tracking-[0.4em] text-primary md:text-[0.75rem]"
          >
            {SHOWREEL_ASSETS[0].label}
          </div>
          <div 
            ref={activeTitleRef}
            className="mt-3 font-heading text-2xl font-black tracking-[-0.06em] text-white md:text-5xl uppercase italic"
            style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            {SHOWREEL_ASSETS[0].title}
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {selectedAsset && (
        <Lightbox 
          asset={selectedAsset} 
          onClose={() => setSelectedAsset(null)} 
        />
      )}
    </section>
  );
}
