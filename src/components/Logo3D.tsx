// ============================================
// ASSE ZERO — Logo 3D
// "JELLY PHYSICS" — Effetto gommoso integrale
// Squash & Stretch reattivo al cursore
// ============================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons';

// ── Parametri Fisici Jelly ────────────────────────────────
const SPRING_K = 110;   // Rigidità delle molle
const SPRING_D = 8;     // Smorzamento (Damping) - basso = più rimbalzo
const MASS     = 1;

const IMPULSE_ROT   = 0.0025; // Forza rotazione
const IMPULSE_SCALE = 0.0035; // Forza deformazione (Squash)
const PROXIMITY     = 1.2;    // Raggio d'azione

export function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Setup Scena ───────────────────────────────────────
    const scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Luci ──────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4);
    keyLight.position.set(4, 8, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xe9ac06, 2);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // ── Stato Fisico ──────────────────────────────────────
    // Rotazione (x, y)
    let rot = { x: 0, y: 0 }, velRot = { x: 0, y: 0 };
    // Scala (x, y, z) - base 1.0
    let scl = { x: 1, y: 1, z: 1 }, velScl = { x: 0, y: 0, z: 0 };
    
    // Mouse tracking
    let mx = -9999, my = -9999;
    let mvx = 0, mvy = 0;

    const onMouseMove = (e: MouseEvent) => {
      mvx = (e.clientX - mx) * 0.6 + mvx * 0.4;
      mvy = (e.clientY - my) * 0.6 + mvy * 0.4;
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Caricamento GLB ────────────────────────────────────
    let model: THREE.Group | null = null;
    let pivot: THREE.Group | null = null;
    let targetSize = 13.0;
    let baseScale = 1;

    const loader = new GLTFLoader();
    loader.load(
      '/logo-3d.glb',
      (gltf: GLTF) => {
        const gltfScene = gltf.scene;
        const box = new THREE.Box3().setFromObject(gltfScene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        pivot = new THREE.Group();
        pivot.add(gltfScene);
        gltfScene.position.sub(center);
        
        baseScale = targetSize / Math.max(size.x, size.y, size.z);
        pivot.scale.setScalar(baseScale);
        scene.add(pivot);
        model = pivot;

        camera.position.set(0, 0, targetSize * 1.2);
        camera.updateProjectionMatrix();
      },
      undefined,
      (err: ErrorEvent) => console.error('[Logo3D] GLB error:', err),
    );

    // ── Loop di Animazione (Fisica Jelly) ──────────────────
    let frameId = 0;
    let lastT = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const t = now * 0.001;

      if (model) {
        // 1. Calcolo Prossimità e Impulso
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rad = Math.hypot(rect.width, rect.height) * PROXIMITY;
        const dist = Math.hypot(mx - cx, my - cy);

        if (dist < rad) {
          const power = Math.max(0, 1 - dist / rad);
          // Impulso Rotazione
          velRot.x += mvy * IMPULSE_ROT * power;
          velRot.y += mvx * IMPULSE_ROT * power;
          
          // Impulso "Squash" (deformazione gommosa)
          // Se muovo il mouse veloce, il logo si schiaccia
          const squash = Math.abs(mvx + mvy) * IMPULSE_SCALE * power;
          velScl.x -= squash;
          velScl.y += squash; // Si allunga su Y se si schiaccia su X
          velScl.z -= squash * 0.5;
        }

        // Dissipazione inerzia mouse
        mvx *= 0.85;
        mvy *= 0.85;

        // 2. Integrazione Molle (Spring Physics)
        // Rotazione torna a 0
        const axR = (-SPRING_K * rot.x - SPRING_D * velRot.x) / MASS;
        const ayR = (-SPRING_K * rot.y - SPRING_D * velRot.y) / MASS;
        velRot.x += axR * dt;
        velRot.y += ayR * dt;
        rot.x += velRot.x * dt;
        rot.y += velRot.y * dt;

        // Scala torna a 1.0
        const axS = (-SPRING_K * (scl.x - 1) - SPRING_D * velScl.x) / MASS;
        const ayS = (-SPRING_K * (scl.y - 1) - SPRING_D * velScl.y) / MASS;
        const azS = (-SPRING_K * (scl.z - 1) - SPRING_D * velScl.z) / MASS;
        velScl.x += axS * dt;
        velScl.y += ayS * dt;
        velScl.z += azS * dt;
        scl.x += velScl.x * dt;
        scl.y += velScl.y * dt;
        scl.z += velScl.z * dt;

        // 3. Applicazione Trasformazioni
        // Rotazione Base (per tenerlo dritto) + Spring + Floating
        model.rotation.x = Math.PI/2 + rot.x + Math.sin(t * 0.5) * 0.05;
        model.rotation.y = rot.y + Math.cos(t * 0.4) * 0.07;
        
        // Applicazione Scala Jelly
        model.scale.set(
          baseScale * scl.x, 
          baseScale * scl.y, 
          baseScale * scl.z
        );
      }

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ─────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m: any) => m.dispose());
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-[90vw] h-[50vh] sm:h-[80vh] mx-auto overflow-visible"
    />
  );
}
