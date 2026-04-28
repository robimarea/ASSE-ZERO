// ============================================
// ASSE ZERO - Showreel Section
// Suspended gallery driven by scroll depth
// ============================================

import { startTransition, useEffect, useMemo, useRef, useState } from 'react';
import { SHOWREEL_ASSETS, type ShowreelAsset } from '@/data/showreelAssets';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const PROGRESS_EPSILON = 0.001;

type Lane = {
  x: number;
  y: number;
};

type SceneConfig = {
  perspective: number;
  sectionHeight: string;
  centerX: number;
  centerY: number;
  depthStep: number;
  rearDepth: number;
  frontDepth: number;
  passDistance: number;
  cardWidthVw: number;
  minCardWidth: string;
  maxCardWidth: string;
  fogSize: string;
  lanes: Lane[];
  laneOrder: number[];
  vignette: string;
};

type DepthState = {
  z: number;
  depthMix: number;
  passMix: number;
};

type CardLayout = {
  asset: ShowreelAsset;
  isActive: boolean;
  shouldPlayVideo: boolean;
  mediaSrc: string;
  x: number;
  y: number;
  z: number;
  opacity: number;
  zIndex: number;
};

const DESKTOP_SCENE: SceneConfig = {
  perspective: 1750,
  sectionHeight: '600vh',
  centerX: 50,
  centerY: 52,
  depthStep: 420,
  rearDepth: -980,
  frontDepth: 220,
  passDistance: 220,
  cardWidthVw: 24,
  minCardWidth: '108px',
  maxCardWidth: '56vw',
  fogSize: '10rem',
  lanes: [
    { x: 0, y: -18 },
    { x: -22, y: -10 },
    { x: 22, y: -10 },
    { x: -16, y: 10 },
    { x: 16, y: 10 },
    { x: 0, y: 16 },
    { x: 0, y: -2 },
  ],
  laneOrder: [0, 1, 2, 6, 3, 4, 5],
  vignette:
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 28%), radial-gradient(circle at 14% 24%, rgba(233,172,6,0.08), transparent 20%), radial-gradient(circle at 84% 76%, rgba(191,51,32,0.08), transparent 22%)',
};

const MOBILE_SCENE: SceneConfig = {
  perspective: 1180,
  sectionHeight: '680vh',
  centerX: 50,
  centerY: 54,
  depthStep: 340,
  rearDepth: -820,
  frontDepth: 180,
  passDistance: 180,
  cardWidthVw: 32,
  minCardWidth: '82px',
  maxCardWidth: '86vw',
  fogSize: '6rem',
  lanes: [
    { x: 0, y: -14 },
    { x: -12, y: -6 },
    { x: 12, y: -6 },
    { x: -8, y: 10 },
    { x: 8, y: 10 },
  ],
  laneOrder: [0, 1, 2, 3, 4],
  vignette:
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 24%), radial-gradient(circle at 18% 22%, rgba(233,172,6,0.08), transparent 18%), radial-gradient(circle at 82% 78%, rgba(191,51,32,0.08), transparent 20%)',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeInCubic(value: number) {
  return value * value * value;
}

function getPreviewSource(asset: ShowreelAsset) {
  return asset.kind === 'video' ? asset.poster : asset.src;
}

function getScrollProgress(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const scrolled = -rect.top;
  const scrollableDistance = Math.max(container.offsetHeight - window.innerHeight, 1);
  return clamp(scrolled / scrollableDistance, 0, 1);
}

function getDepthState(relative: number, scene: SceneConfig): DepthState {
  const z = scene.frontDepth - relative * scene.depthStep;
  const depthRange = scene.frontDepth - scene.rearDepth;

  return {
    z,
    depthMix: clamp((z - scene.rearDepth) / depthRange, 0, 1),
    passMix: clamp((z - scene.frontDepth) / scene.passDistance, 0, 1),
  };
}

function getLane(scene: SceneConfig, index: number) {
  return scene.lanes[scene.laneOrder[index % scene.laneOrder.length]];
}

function buildCardLayout(
  asset: ShowreelAsset,
  index: number,
  travel: number,
  activeIndex: number,
  scene: SceneConfig
): CardLayout {
  const relative = index - travel;
  const lane = getLane(scene, index);
  const depth = getDepthState(relative, scene);
  const passFade = easeInCubic(depth.passMix);

  return {
    asset,
    isActive: index === activeIndex,
    shouldPlayVideo:
      asset.kind === 'video' && index === activeIndex && depth.depthMix > 0.72 && depth.passMix < 0.2,
    mediaSrc: getPreviewSource(asset),
    x: scene.centerX + lane.x,
    y: scene.centerY + lane.y,
    z: depth.z,
    opacity: clamp(0.05 + depth.depthMix * 1.02 - passFade * 1.16, 0, 1),
    zIndex: 180 + Math.round(depth.depthMix * 140) - Math.round(depth.passMix * 30),
  };
}

export function Showreel() {
  const containerRef = useRef<HTMLElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    let frameId = 0;

    const syncProgress = () => {
      frameId = 0;
      if (!containerRef.current) return;

      const nextProgress = getScrollProgress(containerRef.current);
      if (Math.abs(nextProgress - progressRef.current) < PROGRESS_EPSILON) return;

      progressRef.current = nextProgress;

      startTransition(() => {
        setProgress(nextProgress);
      });
    };

    const handleScroll = () => {
      if (frameId !== 0) return;
      frameId = window.requestAnimationFrame(syncProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    syncProgress();

    return () => {
      if (frameId !== 0) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scene = isMobile ? MOBILE_SCENE : DESKTOP_SCENE;
  const travel = progress * (SHOWREEL_ASSETS.length - 1);
  const activeIndex = clamp(Math.round(travel), 0, SHOWREEL_ASSETS.length - 1);
  const activeAsset = SHOWREEL_ASSETS[activeIndex];
  const cardLayouts = useMemo(
    () => SHOWREEL_ASSETS.map((asset, index) => buildCardLayout(asset, index, travel, activeIndex, scene)),
    [activeIndex, scene, travel]
  );

  return (
    <section
      ref={containerRef}
      className="relative z-0 w-full bg-dark"
      style={{ height: scene.sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-dark">
        <div className="absolute inset-0" style={{ backgroundImage: scene.vignette }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,6,0.22),rgba(4,4,6,0.72))]" />

        <div className="pointer-events-none absolute left-7 top-7 z-30 text-white md:left-10 md:top-8">
          <div className="font-heading text-3xl font-black tracking-[-0.08em] md:text-4xl">02</div>
          <div className="mt-2 text-[0.62rem] uppercase tracking-[0.32em] text-white/52 md:text-[0.7rem]">
            Suspended Gallery
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          {scene.lanes.map((lane, index) => (
            <span
              key={`fog-${index}`}
              className="absolute rounded-full bg-white/8 blur-3xl"
              style={{
                left: `${scene.centerX + lane.x * 1.3}%`,
                top: `${scene.centerY + lane.y * 1.15}%`,
                width: scene.fogSize,
                height: scene.fogSize,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 z-20"
          style={{ perspective: `${scene.perspective}px`, transformStyle: 'preserve-3d' }}
        >
          {cardLayouts.map(({ asset, isActive, shouldPlayVideo, mediaSrc, x, y, z, opacity, zIndex }) => (
            <article
              key={asset.id}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${scene.cardWidthVw}vw`,
                minWidth: scene.minCardWidth,
                maxWidth: scene.maxCardWidth,
                transform: `translate3d(-50%, -50%, ${z}px)`,
                opacity,
                zIndex,
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transition: 'transform 180ms linear, opacity 180ms linear, box-shadow 180ms linear',
              }}
            >
              <div
                className="overflow-hidden rounded-[0.95rem] border border-white/10 bg-white/6"
                style={{
                  boxShadow: isActive
                    ? '0 28px 70px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.12)'
                    : '0 16px 42px rgba(0,0,0,0.18)',
                }}
              >
                <div className="relative aspect-[1.45/1] overflow-hidden bg-black">
                  {shouldPlayVideo ? (
                    <video
                      key={`${asset.id}-video`}
                      src={asset.src}
                      poster={asset.poster}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaSrc}
                      alt={asset.title}
                      loading={isActive ? 'eager' : 'lazy'}
                      decoding="async"
                      fetchPriority={isActive ? 'high' : 'low'}
                      className="h-full w-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.16))]" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2 rounded-full border border-white/10 bg-black/24 px-5 py-3 text-center backdrop-blur-xl md:bottom-10">
          <div className="text-[0.62rem] uppercase tracking-[0.28em] text-white/52 md:text-[0.72rem]">
            {activeAsset.label}
          </div>
          <div className="mt-1 font-heading text-xl font-black tracking-[-0.06em] text-white md:text-3xl">
            {activeAsset.title}
          </div>
        </div>
      </div>
    </section>
  );
}
