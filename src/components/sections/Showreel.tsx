import { useEffect, useMemo, useRef, useState } from 'react';
import { SHOWREEL_ASSETS, type ShowreelAsset } from '@/data/showreelAssets';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { clamp, damp, lerp, smoothstep } from '@/lib/math';

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
  relativeCull: 1.28,
  visibleWindow: 1.18,
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
  rearBlur: 13,
  frontBlur: 24,
  rearOpacity: 0.12,
  frontOpacity: 0.04,
  followLambda: 6.8,
  pointerLambda: 7.4,
  focusLift: 4,
};

const MOBILE_CONFIG: TunnelConfig = {
  sectionHeight: '760vh',
  travelPadding: 0.62,
  depthStep: 230,
  relativeCull: 1.24,
  visibleWindow: 1.14,
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
  frontBlur: 18,
  rearOpacity: 0.14,
  frontOpacity: 0.05,
  followLambda: 6.2,
  pointerLambda: 6.8,
  focusLift: 3,
};

function getPreviewSource(asset: ShowreelAsset) {
  return asset.kind === 'video' ? asset.poster : asset.src;
}

export function Showreel() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const targetTravelRef = useRef(0);
  const travelRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const activeIndexRef = useRef(0);
  const visibleIndicesRef = useRef<Set<number>>(new Set());

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;

  const previewSources = useMemo(() => SHOWREEL_ASSETS.map(getPreviewSource), []);

  // Pre-calculate card-specific spatial constants to save CPU cycles in the RAF loop
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

      // Physics/Damping
      const scrollDelta = Math.abs(targetTravelRef.current - travelRef.current);
      // Snap if very close, otherwise damp
      travelRef.current = scrollDelta > 0.9
        ? targetTravelRef.current
        : damp(travelRef.current, targetTravelRef.current, config.followLambda, deltaSeconds);

      pointerRef.current.x = damp(pointerRef.current.x, pointerTargetRef.current.x, config.pointerLambda, deltaSeconds);
      pointerRef.current.y = damp(pointerRef.current.y, pointerTargetRef.current.y, config.pointerLambda, deltaSeconds);

      const travel = travelRef.current;
      const time = now * 0.001;

      // Update active index for UI
      const active = clamp(Math.round(travel), 0, SHOWREEL_ASSETS.length - 1);
      if (active !== activeIndexRef.current) {
        activeIndexRef.current = active;
        setActiveIndex(active);
      }

      // 1. Calculate currently visible range
      const visibleStart = Math.max(0, Math.floor(travel - config.visibleWindow));
      const visibleEnd = Math.min(SHOWREEL_ASSETS.length - 1, Math.ceil(travel + config.visibleWindow));

      // 2. Identify newly visible, still visible, and now hidden cards
      const nextVisibleIndices = new Set<number>();
      for (let i = visibleStart; i <= visibleEnd; i++) {
        nextVisibleIndices.add(i);
      }

      // 3. Hide cards that are no longer in the visible window
      visibleIndicesRef.current.forEach((prevIndex) => {
        if (!nextVisibleIndices.has(prevIndex)) {
          const card = cardRefs.current[prevIndex];
          if (card) card.style.display = 'none';
        }
      });

      // 4. Update and show visible cards
      nextVisibleIndices.forEach((index) => {
        const card = cardRefs.current[index];
        if (!card) return;

        const relative = index - travel;
        const distance = Math.abs(relative);

        // Double check visibility constraints
        if (distance > config.visibleWindow) {
          if (card.style.display !== 'none') card.style.display = 'none';
          return;
        }

        // Show card if it was hidden
        if (card.style.display !== 'block') {
          card.style.display = 'block';
        }

        const offset = cardOffsets[index];
        const focusMix = smoothstep(config.focusWindow, 0, distance);
        const isPastFocus = relative < 0;

        // Curves for non-linear movement
        const curveAmount = clamp(Math.abs(relative) / config.relativeCull, 0, 1);
        const curve = curveAmount * curveAmount;

        // Spatial Calculations
        const dreamDriftX = Math.sin(time * 0.22 + index * 1.61) * config.driftX;
        const dreamDriftY = Math.cos(time * 0.2 + index * 1.27) * config.driftY;

        const pointerInfluence = 0.34 + focusMix * 0.72;
        const pointerX = pointerRef.current.x * config.pointerInfluenceX * pointerInfluence;
        const pointerY = pointerRef.current.y * config.pointerInfluenceY * pointerInfluence;

        const x = offset.baseX + dreamDriftX + pointerX;
        const y = offset.baseY + dreamDriftY - pointerY - focusMix * config.focusLift;
        const z = -relative * config.depthStep;

        // Aesthetic Factors
        const scale = isPastFocus
          ? lerp(config.focusScale, config.frontScale, curve)
          : lerp(config.focusScale, config.rearScale, curve);

        const blur = isPastFocus
          ? lerp(1.2, config.frontBlur, curve)
          : lerp(0.4, config.rearBlur, curve);

        const opacity = isPastFocus
          ? lerp(1, config.frontOpacity, curve)
          : lerp(1, config.rearOpacity, curve);

        // Filter optimization: batch visual changes
        const brightness = isPastFocus ? lerp(1.02, 0.62, curve) : lerp(1.04, 0.68, curve);
        const contrast = isPastFocus ? lerp(1.05, 0.7, curve) : lerp(1.03, 0.78, curve);
        const saturate = isPastFocus ? lerp(1.04, 0.64, curve) : lerp(1.02, 0.72, curve);

        const rotateX = dreamDriftY * 0.08 - pointerRef.current.y * 2.3 * (0.18 + focusMix * 0.34);
        const rotateY = dreamDriftX * 0.08 + pointerRef.current.x * 2.9 * (0.18 + focusMix * 0.34);
        const rotateZ = Math.sin(time * 0.16 + index) * 0.45 * clamp(distance / config.visibleWindow, 0, 1);

        // Apply styles with template literals for faster execution
        card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(1)}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) rotateZ(${rotateZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = `${opacity.toFixed(3)}`;
        card.style.filter = `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturate.toFixed(2)})`;
        card.style.zIndex = `${1000 - Math.round(relative * 100)}`;
      });

      visibleIndicesRef.current = nextVisibleIndices;
      frameId = window.requestAnimationFrame(animate);
    };

    const handleScroll = () => updateTargetTravel();
    const handleResize = () => {
      updateMetrics();
      updateTargetTravel();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerTargetRef.current.x = ((event.clientX / window.innerWidth) * 2 - 1) * -1;
      pointerTargetRef.current.y = ((event.clientY / window.innerHeight) * 2 - 1) * -1;
    };

    const handlePointerLeave = () => {
      pointerTargetRef.current.x = 0;
      pointerTargetRef.current.y = 0;
    };

    updateMetrics();
    updateTargetTravel();
    frameId = window.requestAnimationFrame(animate);

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
  }, [config, cardOffsets]);

  const activeAsset = SHOWREEL_ASSETS[activeIndex] ?? SHOWREEL_ASSETS[0];

  return (
    <section
      ref={containerRef}
      className="relative z-0 w-full bg-dark"
      style={{ height: config.sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-dark">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_18%_24%,rgba(233,172,6,0.07),transparent_22%),radial-gradient(circle_at_82%_74%,rgba(191,51,32,0.08),transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,8,0.08),rgba(5,5,8,0.74))]" />

        {/* 3D Container */}
        <div className="absolute inset-0 [perspective:1600px]">
          <div className="relative h-full w-full [transform-style:preserve-3d]">
            {SHOWREEL_ASSETS.map((asset, index) => (
              <article
                key={asset.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="pointer-events-none absolute left-1/2 top-1/2 w-[min(68vw,20rem)] md:w-[min(38vw,28rem)] will-change-transform"
                style={{
                  display: 'none',
                  opacity: 0,
                  transform: 'translate(-50%, -50%) translate3d(0, 0, -300px) scale(0.8)',
                }}
              >
                <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#09090b] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
                  <div className="relative aspect-[235/160]">
                    <img
                      src={previewSources[index]}
                      alt={asset.title}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,6,0.02),rgba(4,4,6,0.26))]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.10),transparent_26%),radial-gradient(circle_at_80%_82%,rgba(233,172,6,0.10),transparent_24%)] mix-blend-screen" />

                    {/* Card Label */}
                    <div className="absolute inset-x-3 bottom-3 rounded-[1.15rem] bg-white/92 px-4 py-3 text-left text-dark shadow-[0_18px_28px_rgba(0,0,0,0.18)] md:inset-x-4 md:bottom-4 md:px-5 md:py-4">
                      <div className="font-heading text-lg font-black leading-[0.95] tracking-[-0.05em] md:text-[2rem]">
                        {asset.title}
                      </div>
                      <div className="mt-2 text-[0.62rem] uppercase tracking-[0.28em] text-primary md:text-[0.7rem]">
                        {asset.label}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="pointer-events-none absolute left-7 top-7 z-30 text-white md:left-10 md:top-8">
          <div className="font-heading text-3xl font-black tracking-[-0.08em] md:text-4xl">02</div>
          <div className="mt-2 text-[0.62rem] uppercase tracking-[0.32em] text-white/52 md:text-[0.7rem]">
            Suspended Gallery
          </div>
        </div>

        {/* Active Asset Info */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 px-5 py-3 text-center md:bottom-10">
          <div className="text-[0.62rem] uppercase tracking-[0.34em] text-white/38 md:text-[0.72rem]">
            {activeAsset.label}
          </div>
          <div className="mt-2 font-heading text-xl font-black tracking-[-0.08em] text-white md:text-3xl">
            {activeAsset.title}
          </div>
        </div>
      </div>
    </section>
  );
}

