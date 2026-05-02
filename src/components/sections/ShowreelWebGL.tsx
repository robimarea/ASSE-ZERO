import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useVideoTexture, Image as DreiImage } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import { SHOWREEL_ASSETS, type ShowreelAsset } from '@/data/showreelAssets';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { clamp, lerp, damp, smoothstep } from '@/lib/math';

// ============================================
// Types & Config
// ============================================

type WebGLConfig = {
  depthStep: number;
  radiusX: number;
  radiusY: number;
  focusScale: number;
  rearScale: number;
  frontScale: number;
  driftAmplitude: number;
  fov: number;
};

const DESKTOP_CONFIG: WebGLConfig = {
  depthStep: 18,
  radiusX: 4.0,
  radiusY: 2.2,
  focusScale: 4.5,
  rearScale: 2.5,
  frontScale: 3.5,
  driftAmplitude: 0.2,
  fov: 50,
};

const MOBILE_CONFIG: WebGLConfig = {
  depthStep: 12,
  radiusX: 2.8,
  radiusY: 1.8,
  focusScale: 3.2,
  rearScale: 2.2,
  frontScale: 2.8,
  driftAmplitude: 0.15,
  fov: 60,
};

// ============================================
// Sub-Components
// ============================================

function VideoPlane({ asset, ...props }: { asset: ShowreelAsset } & any) {
  const texture = useVideoTexture(asset.src, {
    unsuspend: 'canplay',
    muted: true,
    loop: true,
    start: true,
  });
  
  return (
    <mesh {...props} scale={[12, 8, 1]}>
      <planeGeometry />
      <meshBasicMaterial 
        map={texture} 
        toneMapped={false} 
        transparent 
        color="#ffffff"
      />
    </mesh>
  );
}

function ImagePlane({ asset, ...props }: { asset: ShowreelAsset } & any) {
  // DreiImage handles standard images well, but we add a fallback box
  return (
    <group {...props}>
      <DreiImage url={asset.src} transparent scale={[12, 8]} />
      {/* Fallback plate if texture fails */}
      <mesh scale={[12, 8, 0.1]} position={[0, 0, -0.01]}>
        <planeGeometry />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Card({ asset, index, travel, config }: { asset: ShowreelAsset; index: number; travel: number; config: WebGLConfig }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const relative = index - travel;
  const distance = Math.abs(relative);
  
  // Visibility threshold - slightly larger than focal area
  const isVisible = distance < 2.5;
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const relative = index - travel;
    const distance = Math.abs(relative);
    const isPastFocus = relative < 0;
    
    // Position
    const angle = index * 1.618;
    const curveAmount = clamp(distance / 2.0, 0, 1);
    const curve = smoothstep(0, 1, curveAmount);
    
    const x = Math.cos(angle) * config.radiusX;
    const y = Math.sin(angle) * config.radiusY;
    const z = -relative * config.depthStep;
    
    // Drift
    const time = state.clock.elapsedTime;
    const driftX = Math.sin(time * 0.5 + index) * config.driftAmplitude;
    const driftY = Math.cos(time * 0.4 + index) * config.driftAmplitude;
    
    meshRef.current.position.set(x + driftX, y + driftY, z);
    
    // Scale & Opacity
    const scale = isPastFocus
      ? lerp(config.focusScale, config.frontScale, curve)
      : lerp(config.focusScale, config.rearScale, curve);
      
    meshRef.current.scale.set(scale, scale, 1);
    
    // Opacity handling via material
    const opacity = smoothstep(2.0, 0.8, distance);
    if (meshRef.current.material instanceof THREE.Material) {
      meshRef.current.material.opacity = opacity;
      meshRef.current.material.transparent = true;
    }
    
    // Rotation - slight tilt towards center
    meshRef.current.lookAt(0, 0, z - 20);
  });

  if (!isVisible) return null;

  return asset.kind === 'video' ? (
    <VideoPlane asset={asset} ref={meshRef} />
  ) : (
    <ImagePlane asset={asset} ref={meshRef} />
  );
}

function Scene({ onIndexChange }: { onIndexChange: (i: number) => void }) {
  const travelRef = useRef(0);
  const targetTravelRef = useRef(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('showreel');
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = rect.height - window.innerHeight;
      
      const currentScroll = window.scrollY - sectionTop;
      const progress = clamp(currentScroll / sectionHeight, 0, 1);
      
      targetTravelRef.current = progress * (SHOWREEL_ASSETS.length - 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame((_, delta) => {
    travelRef.current = damp(travelRef.current, targetTravelRef.current, 8, delta);
    
    const active = clamp(Math.round(travelRef.current), 0, SHOWREEL_ASSETS.length - 1);
    onIndexChange(active);
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      {/* DEBUG BOX */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
      <Suspense fallback={null}>
        {SHOWREEL_ASSETS.map((asset, i) => (
          <Card 
            key={asset.id} 
            asset={asset} 
            index={i} 
            travel={travelRef.current}
            config={config} 
          />
        ))}
      </Suspense>
    </>
  );
}

// ============================================
// Main Component
// ============================================

export function ShowreelWebGL() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTitleRef = useRef<HTMLDivElement>(null);
  const activeLabelRef = useRef<HTMLDivElement>(null);

  const handleIndexChange = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      const asset = SHOWREEL_ASSETS[index];
      if (activeTitleRef.current) activeTitleRef.current.textContent = asset.title;
      if (activeLabelRef.current) activeLabelRef.current.textContent = asset.label;
    }
  };

  const isMobile = useMediaQuery('(max-width: 768px)');
  const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 0, 15], fov: config.fov }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#050505']} />
          <Scene onIndexChange={handleIndexChange} />
        </Canvas>
      </div>

      {/* Interface (DOM) */}
      <div className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center">
        {/* Central Indicator */}
        <div className="h-48 w-48 rounded-full border border-white/20 backdrop-blur-md md:h-64 md:w-64" />
        
        {/* Active Asset Info */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 w-[min(32rem,calc(100%-2rem))] -translate-x-1/2 px-5 py-3 text-center md:bottom-10">
          <div 
            ref={activeLabelRef}
            className="text-[0.62rem] uppercase tracking-[0.34em] text-white/38 md:text-[0.72rem]"
          >
            {SHOWREEL_ASSETS[0].label}
          </div>
          <div 
            ref={activeTitleRef}
            className="mt-2 font-heading text-xl font-black tracking-[-0.08em] text-white md:text-3xl"
          >
            {SHOWREEL_ASSETS[0].title}
          </div>
        </div>
      </div>
      
      {/* Decorative Overlays */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-dark via-transparent to-dark opacity-60" />
    </section>
  );
}
