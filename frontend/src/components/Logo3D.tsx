// ============================================
// ASSE ZERO — Logo 3D
// CINEMATICA "DYNAMIC JELLY MAGNET"
// Desktop: fisica a molla + magnete mouse
// Mobile: idle-spin leggero (no fisica, dpr=1, no antialias)
// ============================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons';
import { useIsMobile } from '@/hooks/useIsMobile';

// ── Parametri Fisici (desktop only) ──────────────────────────────────────
const SPRING_K          = 120;
const MASS              = 1;
const MAGNET_STRENGTH   = 0.22;
const TRIGGER_RADIUS_MULT = 0.6;

interface Logo3DProps {
  isVisible?: boolean;
}

export function Logo3D({ isVisible = true }: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animateRef   = useRef<number>(0);
  const isMobile     = useIsMobile();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Setup Scena ───────────────────────────────────────
    const scene = new THREE.Scene();
    const w = container.clientWidth;
    const h = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 2000);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    renderer.domElement.style.display  = 'block';
    renderer.domElement.style.maxWidth = 'none';
    renderer.domElement.style.width    = '100%';
    renderer.domElement.style.height   = '100%';
    container.appendChild(renderer.domElement);

    // ── Rig da set — scatter ambientale + 7 sorgenti ────────
    // Ambient: simula la luce diffusa dell'ambiente del set, non buio totale
    scene.add(new THREE.AmbientLight(0x101828, 0.45));

    // Key — softbox grande, alto-sinistra, bianco caldo (orbita lentamente)
    const keyLight = new THREE.SpotLight(0xfff4e0, 5.5);
    keyLight.position.set(-10, 12, 16);
    keyLight.angle = Math.PI / 4;      // cono largo = softbox
    keyLight.penumbra = 0.75;          // bordi morbidissimi
    keyLight.decay = 0;
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Fill principale — softbox destra, freddo, riduce le ombre laterali pesanti
    const fillMain = new THREE.DirectionalLight(0xe0eeff, 2.2);
    fillMain.position.set(14, 4, 12);
    scene.add(fillMain);

    // Fill basso-frontale — elimina le ombre dure sotto e sui lati bassi
    const fillFront = new THREE.DirectionalLight(0xeef0ff, 1.1);
    fillFront.position.set(0, -5, 18);
    scene.add(fillFront);

    // Top overhead — LED panel dal soffitto, bianco leggermente caldo
    const topLight = new THREE.DirectionalLight(0xffeedd, 1.8);
    topLight.position.set(0, 20, 4);
    scene.add(topLight);

    // Kicker — pannello laterale destra-dietro, blu accento
    const kickerLight = new THREE.DirectionalLight(0x7090ff, 1.0);
    kickerLight.position.set(12, 5, -10);
    scene.add(kickerLight);

    // Rim — rosso brand da dietro, separa dal fondo
    const rimLight = new THREE.DirectionalLight(0xa90f21, 2.5);
    rimLight.position.set(-2, 7, -16);
    scene.add(rimLight);

    // Bounce — riflesso caldo dal "pavimento del set"
    const bounceLight = new THREE.DirectionalLight(0xff8030, 0.5);
    bounceLight.position.set(0, -16, 6);
    scene.add(bounceLight);

    // ── Stato Fisico (desktop) ────────────────────────────
    const rot    = { x: 0, y: 0 }, velRot = { x: 0, y: 0 };
    const scl    = { x: 0, y: 0, z: 0 }, velScl = { x: 0, y: 0, z: 0 };
    const pos    = { x: 0, y: 0 }, velPos = { x: 0, y: 0 };
    let mx = -9999, my = -9999;
    let targetPosX = 0, targetPosY = 0;
    let isMagnetized = false;

    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    if (!isMobile) {
      onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // ── Caricamento GLB ────────────────────────────────────
    let model: THREE.Group | null = null;
    let baseScale = 1;
    const targetSize = 28.0;

    const loader = new GLTFLoader();
    loader.load(
      '/logo-3d.glb',
      (gltf: GLTF) => {
        const gltfScene = gltf.scene;
        // Usa i materiali originali del GLB aggiornato
        gltfScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.metalness = Math.max(m.metalness, 0.1);
                m.roughness = Math.min(m.roughness, 0.45);
                m.needsUpdate = true;
              }
            });
          }
        });
        const box = new THREE.Box3().setFromObject(gltfScene);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        const pivot = new THREE.Group();
        pivot.add(gltfScene);
        gltfScene.position.set(-center.x, -center.y, -center.z);
        baseScale = targetSize / Math.max(size.x, size.y, size.z);
        pivot.scale.setScalar(0);
        scene.add(pivot);
        model = pivot;
        camera.position.set(0, 0, targetSize * 0.9);
        camera.updateProjectionMatrix();
      },
      undefined,
      (err: ErrorEvent) => console.error('[Logo3D] error:', err),
    );

    // ── updateRect (throttled con RAF) ────────────────────
    let cx = 0, cy = 0, triggerRadius = 0;
    let rectRafId = 0;

    const updateRect = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      triggerRadius = Math.hypot(rect.width, rect.height) * TRIGGER_RADIUS_MULT;
    };

    const scheduleRectUpdate = () => {
      if (rectRafId !== 0) return;
      rectRafId = requestAnimationFrame(() => { rectRafId = 0; updateRect(); });
    };

    updateRect();
    // Su mobile la fisica è off, non serve aggiornare updateRect allo scroll
    if (!isMobile) {
      window.addEventListener('scroll', scheduleRectUpdate, { passive: true });
    }
    window.addEventListener('resize', scheduleRectUpdate, { passive: true });

    // ── Loop render ────────────────────────────────────────
    let lastT = performance.now();

    const animate = () => {
      if (!isVisible) {
        animateRef.current = 0;
        return;
      }

      animateRef.current = requestAnimationFrame(animate);
      const now = performance.now();
      const dt  = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const t = now * 0.001;

      if (model) {
        if (!isMobile) {
          // ── Desktop: fisica completa con magnete ──
          const dist = Math.hypot(mx - cx, my - cy);
          const wasMagnetized = isMagnetized;
          isMagnetized = dist < triggerRadius;

          if (wasMagnetized && !isMagnetized) {
            velPos.x *= -0.6;
            velPos.y *= -0.6;
            velRot.x += pos.y * 3.0;
            velRot.y += pos.x * 3.0;
          }

          if (isMagnetized) {
            const rawPower = 1 - dist / triggerRadius;
            const power = rawPower * rawPower;
            targetPosX = (mx - cx) * 0.04 * power * MAGNET_STRENGTH;
            targetPosY = -(my - cy) * 0.04 * power * MAGNET_STRENGTH;
            velRot.x += (targetPosY * 1.0 - rot.x) * 0.12;
            velRot.y += (targetPosX * 0.3 - rot.y) * 0.08;
          } else {
            targetPosX = 0; targetPosY = 0;
          }

          const dampPosRot = isMagnetized ? 14 : 3.0;
          const dampScale  = 5.5;

          const axP = (-SPRING_K * (pos.x - targetPosX) - dampPosRot * velPos.x) / MASS;
          const ayP = (-SPRING_K * (pos.y - targetPosY) - dampPosRot * velPos.y) / MASS;
          velPos.x += axP * dt; velPos.y += ayP * dt;
          pos.x += velPos.x * dt; pos.y += velPos.y * dt;

          const axR = (-SPRING_K * rot.x - dampPosRot * velRot.x) / MASS;
          const ayR = (-SPRING_K * rot.y - dampPosRot * velRot.y) / MASS;
          velRot.x += axR * dt; velRot.y += ayR * dt;
          rot.x += velRot.x * dt; rot.y += velRot.y * dt;

          const breatheX = 1 + Math.sin(t * 1.5) * 0.025;
          const breatheY = 1 + Math.cos(t * 1.2) * 0.025;
          const breatheZ = 1 + Math.sin(t * 0.9) * 0.015;
          velScl.x += (-SPRING_K * (scl.x - breatheX) - dampScale * velScl.x) / MASS * dt;
          velScl.y += (-SPRING_K * (scl.y - breatheY) - dampScale * velScl.y) / MASS * dt;
          velScl.z += (-SPRING_K * (scl.z - breatheZ) - dampScale * velScl.z) / MASS * dt;
          scl.x += velScl.x * dt; scl.y += velScl.y * dt; scl.z += velScl.z * dt;

          model.position.set(pos.x, pos.y, 0);
          model.rotation.x = Math.PI / 2 + rot.x + Math.sin(t * 0.5) * 0.05;
          model.rotation.y = rot.y + Math.cos(t * 0.4) * 0.07;
          model.scale.set(baseScale * scl.x, baseScale * scl.y, baseScale * scl.z);

        } else {
          // ── Mobile: idle-spin leggero, niente fisica ──
          // Scala: spring semplice verso 1 (entry animation dal valore 0 iniziale)
          const dampScale = 5.5;
          const breatheX = 1 + Math.sin(t * 1.5) * 0.02;
          const breatheY = 1 + Math.cos(t * 1.2) * 0.02;
          const breatheZ = 1 + Math.sin(t * 0.9) * 0.012;
          velScl.x += (-SPRING_K * (scl.x - breatheX) - dampScale * velScl.x) / MASS * dt;
          velScl.y += (-SPRING_K * (scl.y - breatheY) - dampScale * velScl.y) / MASS * dt;
          velScl.z += (-SPRING_K * (scl.z - breatheZ) - dampScale * velScl.z) / MASS * dt;
          scl.x += velScl.x * dt; scl.y += velScl.y * dt; scl.z += velScl.z * dt;

          model.position.set(0, 0, 0);
          model.rotation.x = Math.PI / 2 + Math.sin(t * 0.4) * 0.08;
          model.rotation.y = Math.sin(t * 0.45) * 0.22;
          model.scale.set(baseScale * scl.x, baseScale * scl.y, baseScale * scl.z);
        }
      }

      // Key light — orbita lenta attorno al modello
      keyLight.position.x = -12 * Math.cos(t * 0.06);
      keyLight.position.z = 18 * Math.sin(t * 0.06 + Math.PI / 2);

      renderer.render(scene, camera);
    };

    if (isVisible) {
      animateRef.current = requestAnimationFrame(animate);
    }

    const ro = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);

    return () => {
      if (animateRef.current) cancelAnimationFrame(animateRef.current);
      if (rectRafId !== 0) cancelAnimationFrame(rectRafId);
      ro.disconnect();
      if (!isMobile) window.removeEventListener('scroll', scheduleRectUpdate);
      window.removeEventListener('resize', scheduleRectUpdate);
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(
          (m: THREE.Material) => m.dispose()
        );
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [isVisible, isMobile]);

  return (
    <div
      ref={containerRef}
      className="w-[100vw] h-[38vh] md:h-[75vh] cursor-none"
    />
  );
}
