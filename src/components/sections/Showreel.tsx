import { useEffect, useMemo, useRef, useState } from 'react';
import { SHOWREEL_ASSETS, type ShowreelAsset } from '@/data/showreelAssets';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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
  depthStep: 210,
  relativeCull: 1.28,
  visibleWindow: 1.18,
  focusWindow: 0.58,
  rearScale: 0.64,
  focusScale: 0.82,
  frontScale: 0.78,
  tunnelRadiusX: 72,
  tunnelRadiusY: 46,
  driftX: 2,
  driftY: 2,
  trailSpreadX: 0,
  trailSpreadY: 0,
  scatterJitterX: 96,
  scatterJitterY: 58,
  spreadAnchorX: 220,
  spreadAnchorY: 132,
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
  depthStep: 168,
  relativeCull: 1.24,
  visibleWindow: 1.14,
  focusWindow: 0.6,
  rearScale: 0.7,
  focusScale: 0.86,
  frontScale: 0.82,
  tunnelRadiusX: 40,
  tunnelRadiusY: 28,
  driftX: 1.5,
  driftY: 1.5,
  trailSpreadX: 0,
  trailSpreadY: 0,
  scatterJitterX: 44,
  scatterJitterY: 28,
  spreadAnchorX: 104,
  spreadAnchorY: 68,
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(min: number, max: number, value: number) {
  const t = clamp((value - min) / Math.max(max - min, 0.0001), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function damp(current: number, target: number, lambda: number, deltaSeconds: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * deltaSeconds));
}

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
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;
  const previewSources = useMemo(() => SHOWREEL_ASSETS.map((asset) => getPreviewSource(asset)), []);

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
      travelRef.current = scrollDelta > 0.9
        ? targetTravelRef.current
        : damp(travelRef.current, targetTravelRef.current, config.followLambda, deltaSeconds);
      pointerRef.current.x = damp(pointerRef.current.x, pointerTargetRef.current.x, config.pointerLambda, deltaSeconds);
      pointerRef.current.y = damp(pointerRef.current.y, pointerTargetRef.current.y, config.pointerLambda, deltaSeconds);

      const travel = travelRef.current;
      const active = clamp(Math.round(travel), 0, SHOWREEL_ASSETS.length - 1);
      if (active !== activeIndexRef.current) {
        activeIndexRef.current = active;
        setActiveIndex(active);
      }

      const time = now * 0.001;
      const visibleStart = clamp(Math.floor(travel), 0, SHOWREEL_ASSETS.length - 1);
      const visibleEnd = clamp(Math.ceil(travel), 0, SHOWREEL_ASSETS.length - 1);

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        const relative = index - travel;
        const distance = Math.abs(relative);

        const isVisiblePair = index === visibleStart || index === visibleEnd;
        if (!isVisiblePair || distance > config.visibleWindow) {
          if (card.style.display !== 'none') card.style.display = 'none';
          return;
        }
        if (card.style.display !== 'block') card.style.display = 'block';

        const laneMix = clamp(distance / config.visibleWindow, 0, 1);
        const focusMix = smoothstep(config.focusWindow, 0, distance);
        const rearAmount = clamp(relative / config.relativeCull, 0, 1);
        const frontAmount = clamp(-relative / config.relativeCull, 0, 1);
        const isPastFocus = relative < 0;
        const rearCurve = rearAmount * rearAmount;
        const frontCurve = frontAmount * frontAmount;

        const anchorXDirection = index % 2 === 0 ? -1 : 1;
        const anchorYDirection = index % 3 === 0 ? -1 : 1;
        const anchorX = anchorXDirection * (config.spreadAnchorX + Math.sin(index * 1.83) * config.tunnelRadiusX);
        const anchorY = anchorYDirection * (config.spreadAnchorY + Math.cos(index * 1.29) * config.tunnelRadiusY);
        const baseOffsetX =
          anchorX +
          Math.sin(index * 2.37 + 0.6) * config.scatterJitterX;
        const baseOffsetY =
          anchorY +
          Math.cos(index * 1.93 + 0.2) * config.scatterJitterY;
        const dreamDriftX = Math.sin(time * 0.22 + index * 1.61) * config.driftX;
        const dreamDriftY = Math.cos(time * 0.2 + index * 1.27) * config.driftY;
        const pointerX = pointerRef.current.x * config.pointerInfluenceX * (0.34 + focusMix * 0.72);
        const pointerY = pointerRef.current.y * config.pointerInfluenceY * (0.34 + focusMix * 0.72);
        const x = baseOffsetX + dreamDriftX + pointerX;
        const y = baseOffsetY + dreamDriftY - pointerY - focusMix * config.focusLift;
        const z = -relative * config.depthStep;

        const scale = isPastFocus
          ? lerp(config.focusScale, config.frontScale, frontCurve)
          : lerp(config.focusScale, config.rearScale, rearCurve);

        const blur = isPastFocus
          ? lerp(1.2, config.frontBlur, frontCurve)
          : lerp(0.4, config.rearBlur, rearCurve);

        const opacity = isPastFocus
          ? lerp(1, config.frontOpacity, frontCurve)
          : lerp(1, config.rearOpacity, rearCurve);

        const brightness = isPastFocus
          ? lerp(1.02, 0.62, frontCurve)
          : lerp(1.04, 0.68, rearCurve);

        const contrast = isPastFocus
          ? lerp(1.05, 0.7, frontCurve)
          : lerp(1.03, 0.78, rearCurve);

        const saturate = isPastFocus
          ? lerp(1.04, 0.64, frontCurve)
          : lerp(1.02, 0.72, rearCurve);

        const rotateX = dreamDriftY * 0.08 - pointerRef.current.y * 2.3 * (0.18 + focusMix * 0.34);
        const rotateY = dreamDriftX * 0.08 + pointerRef.current.x * 2.9 * (0.18 + focusMix * 0.34);
        const rotateZ = Math.sin(time * 0.16 + index) * 0.45 * laneMix;

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
        card.style.opacity = `${opacity}`;
        card.style.filter = `blur(${blur}px) brightness(${brightness}) contrast(${contrast}) saturate(${saturate})`;
        card.style.zIndex = `${1000 - Math.round(relative * 100)}`;
      });

      frameId = window.requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      updateTargetTravel();
    };

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
  }, [config]);

  const activeAsset = SHOWREEL_ASSETS[activeIndex] ?? SHOWREEL_ASSETS[0];

  return (
    <section
      ref={containerRef}
      className="relative z-0 w-full bg-dark"
      style={{ height: config.sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_18%_24%,rgba(233,172,6,0.07),transparent_22%),radial-gradient(circle_at_82%_74%,rgba(191,51,32,0.08),transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,8,0.08),rgba(5,5,8,0.74))]" />

        <div className="absolute inset-0 [perspective:1600px]">
          <div className="relative h-full w-full [transform-style:preserve-3d]">
            {SHOWREEL_ASSETS.map((asset, index) => (
              <article
                key={asset.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="pointer-events-none absolute left-1/2 top-1/2 w-[min(68vw,20rem)] md:w-[min(38vw,28rem)] will-change-transform"
                style={{
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

        <div className="pointer-events-none absolute left-7 top-7 z-30 text-white md:left-10 md:top-8">
          <div className="font-heading text-3xl font-black tracking-[-0.08em] md:text-4xl">02</div>
          <div className="mt-2 text-[0.62rem] uppercase tracking-[0.32em] text-white/52 md:text-[0.7rem]">
            Suspended Gallery
          </div>
        </div>

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
