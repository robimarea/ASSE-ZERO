// ============================================
// ASSE ZERO — Logo 3D
// Carica public/logo-3d.glb con Three.js
// Pattern: zero re-renders, cleanup completo
// ============================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons';
import { OrbitControls } from 'three/addons';

export function Logo3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scena ──────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ─────────────────────────────────────────────
    const w = container.clientWidth;
    const h = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.set(0, 0, 5);

    // ── Renderer (alpha → sfondo trasparente) ───────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ── Luci ───────────────────────────────────────────────
    // Luce ambientale base
    scene.add(new THREE.AmbientLight(0xffffff, 1.5));

    // Luce direzionale principale (frontale alta)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4);
    keyLight.position.set(4, 8, 6);
    scene.add(keyLight);

    // Luce di contorno ambra (colore brand secondario)
    const rimLight = new THREE.DirectionalLight(0xe9ac06, 2);
    rimLight.position.set(-6, -4, -5);
    scene.add(rimLight);

    // Fill light frontale leggero
    const fillLight = new THREE.DirectionalLight(0xffffff, 1);
    fillLight.position.set(-3, 2, 4);
    scene.add(fillLight);

    // ── OrbitControls ──────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2;
    controls.maxDistance = 12;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;

    // ── Caricamento GLB ────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      '/logo-3d.glb',
      (gltf: GLTF) => {
        const model = gltf.scene;

        // Centra il modello sull'origine
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);

        // Scala il modello per riempire la view in modo uniforme
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 2.8;
        model.scale.setScalar(targetSize / maxDim);

        scene.add(model);

        // Riposiziona la camera in base alle dimensioni reali del modello
        const scaledMax = targetSize;
        camera.position.set(0, 0, scaledMax * 1.8);
        camera.near = scaledMax * 0.01;
        camera.far = scaledMax * 100;
        camera.updateProjectionMatrix();
        controls.update();
      },
      undefined,
      (err: ErrorEvent) => {
        console.error('[Logo3D] Errore caricamento /logo-3d.glb:', err);
      },
    );

    // ── Animation loop ─────────────────────────────────────
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize via ResizeObserver ──────────────────────────
    const ro = new ResizeObserver(() => {
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    ro.observe(container);

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();

      // Dispose di ogni mesh/materiale nella scena
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m: THREE.Material) => m.dispose());
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    // Il wrapper controlla le dimensioni responsive
    // Mobile: 280×280 — Desktop (sm+): 420×420
    <div
      ref={containerRef}
      className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] mx-auto"
    />
  );
}
