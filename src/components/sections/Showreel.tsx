// ============================================
// ASSE ZERO - Showreel Section
// Suspended gallery driven by scroll depth
// ============================================

import { useEffect, useRef, useState } from 'react';
import { SHOWREEL_ASSETS, type ShowreelAsset } from '@/data/showreelAssets';
import { useMediaQuery } from '@/hooks/useMediaQuery';


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
  rotateX: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

const DESKTOP_SCENE: SceneConfig = {
  perspective: 1200,
  sectionHeight: '600vh',
  centerX: 50,
  centerY: 50,
  depthStep: 520,
  rearDepth: -1400,
  frontDepth: 280,
  passDistance: 280,
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
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 14% 24%, rgba(233,172,6,0.10), transparent 22%), radial-gradient(circle at 84% 76%, rgba(191,51,32,0.10), transparent 24%)',
};

const MOBILE_SCENE: SceneConfig = {
  perspective: 900,
  sectionHeight: '680vh',
  centerX: 50,
  centerY: 50,
  depthStep: 420,
  rearDepth: -1100,
  frontDepth: 220,
  passDistance: 220,
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
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10), transparent 26%), radial-gradient(circle at 18% 22%, rgba(233,172,6,0.10), transparent 20%), radial-gradient(circle at 82% 78%, rgba(191,51,32,0.10), transparent 22%)',
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
  const isActive = index === activeIndex;

  // Fluido effetto "magnete": mentre la card si avvicina alla camera (relative -> 0),
  // l'offset della corsia viene dolcemente azzerato per evitare che la prospettiva
  // faccia "scappare via" o "afflosciare" le card verso i bordi dello schermo.
  const distanceToCenter = Math.abs(relative);
  const centerMix = clamp(1 - distanceToCenter / 1.5, 0, 1);
  const smoothCenter = centerMix * centerMix * (3 - 2 * centerMix); // Ease in-out

  const currentOffsetX = lane.x * (1 - smoothCenter);
  const currentOffsetY = lane.y * (1 - smoothCenter);

  // Tilt cinematografico che si raddrizza quando la card è al centro
  const tiltStrength = clamp(1 - depth.depthMix * 1.4, 0, 1);
  const rawRotateY = lane.x * 0.28;
  const rawRotateX = lane.y * -0.14;
  const rotateY = rawRotateY * tiltStrength * (1 - smoothCenter);
  const rotateX = rawRotateX * tiltStrength * (1 - smoothCenter);
  
  const scale = isActive && depth.depthMix > 0.82 ? 1.04 : 1;

  return {
    asset,
    isActive,
    shouldPlayVideo:
      asset.kind === 'video' && isActive && depth.depthMix > 0.72 && depth.passMix < 0.2,
    mediaSrc: getPreviewSource(asset),
    x: scene.centerX + currentOffsetX,
    y: scene.centerY + currentOffsetY,
    z: depth.z,
    rotateX,
    rotateY,
    scale,
    opacity: clamp(0.05 + depth.depthMix * 1.02 - passFade * 1.16, 0, 1),
    zIndex: 180 + Math.round(depth.depthMix * 140) - Math.round(depth.passMix * 30),
  };
}

export function Showreel() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const scene = isMobile ? MOBILE_SCENE : DESKTOP_SCENE;

  useEffect(() => {
    let frameId = 0;

    const syncProgress = () => {
      frameId = 0;
      if (!containerRef.current) return;

      const progress = getScrollProgress(containerRef.current);
      const travel = progress * (SHOWREEL_ASSETS.length - 1);
      const newActiveIndex = clamp(Math.round(travel), 0, SHOWREEL_ASSETS.length - 1);

      // ZERO RE-RENDER: Aggiorniamo direttamente il DOM invece di usare setState su ogni frame
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const layout = buildCardLayout(SHOWREEL_ASSETS[index], index, travel, newActiveIndex, scene);
        
        el.style.left = `${layout.x}%`;
        el.style.top = `${layout.y}%`;
        el.style.transform = `translate3d(-50%, -50%, ${layout.z}px) rotateX(${layout.rotateX}deg) rotateY(${layout.rotateY}deg) scale(${layout.scale})`;
        el.style.opacity = `${layout.opacity}`;
        el.style.zIndex = `${layout.zIndex}`;

        const innerDiv = el.firstChild as HTMLDivElement;
        if (innerDiv) {
          innerDiv.style.borderColor = layout.isActive ? 'rgba(191,51,32,0.35)' : 'rgba(255,255,255,0.08)';
          innerDiv.style.boxShadow = layout.isActive
            ? '0 32px 80px rgba(0,0,0,0.38), 0 0 0 1px rgba(191,51,32,0.25), 0 0 40px 4px rgba(191,51,32,0.12)'
            : '0 16px 42px rgba(0,0,0,0.18)';
        }
      });

      // Triggera React solo quando cambia la card attiva
      if (newActiveIndex !== activeIndexRef.current) {
        activeIndexRef.current = newActiveIndex;
        setActiveIndex(newActiveIndex);
      }
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
  }, [scene]);

  const activeAsset = SHOWREEL_ASSETS[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative z-0 w-full bg-dark"
      style={{ height: scene.sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-dark">
        <div className="absolute inset-0" style={{ backgroundImage: scene.vignette }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,4,6,0.22),rgba(4,4,6,0.72))]" />

        {/* Vignetta radiale tunnel — oscura i bordi, luce al centro */}
        <div
          className="pointer-events-none absolute inset-0 z-[35]"
          style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.92) 100%)' }}
        />

        {/* Letterbox cinematografico — barre anamorfiche 2.39:1 */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 h-[10vh] bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[10vh] bg-gradient-to-t from-black to-transparent" />

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
          style={{ perspective: `${scene.perspective}px`, perspectiveOrigin: `${scene.centerX}% ${scene.centerY}%`, transformStyle: 'preserve-3d' }}
        >
          {SHOWREEL_ASSETS.map((asset, index) => {
            const isActive = index === activeIndex;
            // Layout iniziale solo per il primo render, poi controllato via DOM
            const initialLayout = buildCardLayout(asset, index, 0, 0, scene);
            
            return (
              <article
                key={asset.id}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="absolute"
                style={{
                  left: `${initialLayout.x}%`,
                  top: `${initialLayout.y}%`,
                  width: `${scene.cardWidthVw}vw`,
                  minWidth: scene.minCardWidth,
                  maxWidth: scene.maxCardWidth,
                  transform: `translate3d(-50%, -50%, ${initialLayout.z}px) rotateX(${initialLayout.rotateX}deg) rotateY(${initialLayout.rotateY}deg) scale(${initialLayout.scale})`,
                  opacity: initialLayout.opacity,
                  zIndex: initialLayout.zIndex,
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div
                  className="overflow-hidden rounded-[0.95rem] border bg-white/6 transition-colors duration-300"
                  style={{
                    borderColor: initialLayout.isActive ? 'rgba(191,51,32,0.35)' : 'rgba(255,255,255,0.08)',
                    boxShadow: initialLayout.isActive
                      ? '0 32px 80px rgba(0,0,0,0.38), 0 0 0 1px rgba(191,51,32,0.25), 0 0 40px 4px rgba(191,51,32,0.12)'
                      : '0 16px 42px rgba(0,0,0,0.18)',
                  }}
                >
                  <div className="relative aspect-[1.45/1] overflow-hidden bg-black">
                    {asset.kind === 'video' && isActive ? (
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
                      src={initialLayout.mediaSrc}
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
          );
        })}
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
