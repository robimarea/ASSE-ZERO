// ============================================
// ASSE ZERO — Logo 3D
// STANZA INVISIBILE + CINEMATICA "DYNAMIC JELLY MAGNET"
// Logo al centro della stanza, testo tipografico sulla parete
// alta di fondo; il tilt mouse-follow ruota l'intera stanza
// (parallasse di profondità logo/testo).
// Desktop: fisica a molla + magnete mouse + tilt stanza
// Mobile: idle-spin leggero + sway stanza (no fisica, no antialias)
// ============================================

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons';
import { useIsMobile } from '@/hooks/useIsMobile';

// ── Parametri Fisici (desktop only) ──────────────────────────────────────
const SPRING_K          = 120;
const MASS              = 1;
const MAGNET_STRENGTH   = 0.22;
const TRIGGER_RADIUS_MULT = 0.35; // zona magnete/jiggle stretta attorno al logo

// ── Parametri Stanza invisibile + Tilt ────────────────────────────────────
// La "stanza" è un Group senza pareti visibili: definisce solo lo spazio.
// Logo al centro (0,0,0), testo sulla parete alta di fondo.
const ROOM = {
  width:  100,  // larghezza parete di fondo (unità scena)
  height: 36,
  depth:  36,   // il testo sta a -depth/2
};
// La stanza è abbassata rispetto alla camera: il logo scende un po' e sopra
// resta più aria per la scritta a parete
const ROOM_OFFSET_Y = -3.5;
const WALL_TEXT          = 'VIDEO & MEDIA';
const WALL_TEXT_Y        = ROOM.height * 0.52;  // ben sopra il logo
const WALL_TEXT_WIDTH    = ROOM.width * 0.92;   // larghezza piano testo (desktop)
const WALL_TEXT_WIDTH_MOBILE = 58;              // frustum mobile più stretto
const WALL_TEXT_OPACITY  = 0.95;                // titolo principale: ben visibile sul giallo
// Tilt mouse-follow: ruota l'intera stanza → parallasse logo/testo automatico
const TILT_MAX_X  = 0.085; // rad (~5°) inclinazione verticale
const TILT_MAX_Y  = 0.14;  // rad (~8°) inclinazione orizzontale
const TILT_SMOOTH = 4.0;   // velocità del damping (più alto = più reattivo)

// Piano con testo tipografico renderizzato su canvas (font brand Satoshi).
// Ritorna la texture per il dispose in cleanup.
function createWallText(width: number): { group: THREE.Group; texture: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const fontPx = 220;
  const font = `900 ${fontPx}px 'Satoshi', sans-serif`;

  const draw = () => {
    ctx.font = font;
    const metrics = ctx.measureText(WALL_TEXT);
    const pad = fontPx * 0.35; // spazio per l'ombra, non deve tagliarsi ai bordi
    canvas.width  = Math.ceil(metrics.width + pad * 2);
    canvas.height = Math.ceil(fontPx * 1.3 + pad);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = font; // il resize del canvas resetta il contesto
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Stessa ombra morbida dell'h1 originale: stacca il bianco dal giallo
    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = fontPx * 0.14;
    ctx.fillText(WALL_TEXT, canvas.width / 2, canvas.height / 2);
  };
  draw();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  const geometry = new THREE.PlaneGeometry(width, width * (canvas.height / canvas.width));

  // Occluso normalmente dal logo: nessun layer sopra, logo sempre solido
  const solid = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: WALL_TEXT_OPACITY,
      depthWrite: false,
    })
  );

  const group = new THREE.Group();
  group.add(solid);
  group.position.set(0, WALL_TEXT_Y, -ROOM.depth / 2);

  // Il font potrebbe non essere ancora caricato al primo draw: ridisegna quando
  // pronto e riallinea l'aspect del piano al nuovo canvas (Satoshi ≠ fallback)
  const baseAspect = canvas.height / canvas.width;
  document.fonts.load(font).then(() => {
    draw();
    texture.needsUpdate = true;
    group.scale.y = (canvas.height / canvas.width) / baseAspect;
  });

  return { group, texture };
}

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
    const targetSize = 28.0; // dimensione di riferimento del logo
    camera.position.set(0, 0, targetSize * 0.9);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    renderer.domElement.style.display  = 'block';
    renderer.domElement.style.maxWidth = 'none';
    renderer.domElement.style.width    = '100%';
    renderer.domElement.style.height   = '100%';
    container.appendChild(renderer.domElement);

    // ── Rig da set — luce pulita su fondo giallo brand ──────
    // Ambient neutro: le ombre restano leggibili, non "sporche" di blu
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    // Hemisphere: cielo neutro sopra + rimbalzo del pavimento giallo del sito
    scene.add(new THREE.HemisphereLight(0xffffff, 0xb8a812, 0.6));

    // Key — softbox grande, alto-sinistra, bianco caldo (orbita lentamente)
    const keyLight = new THREE.SpotLight(0xfff4e0, 6.0);
    keyLight.position.set(-10, 12, 16);
    keyLight.angle = Math.PI / 4;      // cono largo = softbox
    keyLight.penumbra = 0.75;          // bordi morbidissimi
    keyLight.decay = 0;
    scene.add(keyLight);
    scene.add(keyLight.target);

    // Fill principale — softbox destra, quasi neutro, riduce le ombre laterali
    const fillMain = new THREE.DirectionalLight(0xf0f4ff, 1.7);
    fillMain.position.set(14, 4, 12);
    scene.add(fillMain);

    // Fill basso-frontale — elimina le ombre dure sotto e sui lati bassi
    const fillFront = new THREE.DirectionalLight(0xf4f5ff, 1.0);
    fillFront.position.set(0, -5, 18);
    scene.add(fillFront);

    // Top overhead — LED panel dal soffitto, bianco leggermente caldo
    const topLight = new THREE.DirectionalLight(0xffeedd, 1.6);
    topLight.position.set(0, 20, 4);
    scene.add(topLight);

    // Rim — rosso brand da dietro, separa dal fondo
    const rimLight = new THREE.DirectionalLight(0xa90f21, 2.2);
    rimLight.position.set(-2, 7, -16);
    scene.add(rimLight);

    // ── Stanza invisibile ─────────────────────────────────
    // Group che contiene logo + testo parete: il tilt ruota tutto insieme
    // attorno al centro (dove sta il logo) → il testo, più lontano, si
    // muove di più = parallasse di profondità. Le luci restano in world
    // space, come un set reale dove si muove la camera e non i fari.
    const room = new THREE.Group();
    room.position.y = ROOM_OFFSET_Y;
    scene.add(room);

    const { group: wallText, texture: wallTextTexture } = createWallText(
      isMobile ? WALL_TEXT_WIDTH_MOBILE : WALL_TEXT_WIDTH
    );
    room.add(wallText);

    // ── Stato Fisico (desktop) ────────────────────────────
    const rot    = { x: 0, y: 0 }, velRot = { x: 0, y: 0 };
    const scl    = { x: 0, y: 0, z: 0 }, velScl = { x: 0, y: 0, z: 0 };
    const pos    = { x: 0, y: 0 }, velPos = { x: 0, y: 0 };
    let mx = -9999, my = -9999;
    let targetPosX = 0, targetPosY = 0;
    let isMagnetized = false;

    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    let onMouseLeave: (() => void) | null = null;
    if (!isMobile) {
      onMouseMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      // Mouse fuori dalla pagina: il tilt rientra dolcemente a zero
      onMouseLeave = () => { mx = -9999; my = -9999; };
      document.documentElement.addEventListener('mouseleave', onMouseLeave);
    }

    // ── Caricamento GLB ────────────────────────────────────
    let model: THREE.Group | null = null;
    let baseScale = 1;

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
        room.add(pivot); // al centro della stanza: il tilt lo ruota insieme al testo
        model = pivot;
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

      // ── Tilt della stanza (mouse-follow con damping esponenziale) ──
      let tiltTargetX = 0, tiltTargetY = 0;
      if (!isMobile && mx > -9999) {
        const nx = (mx / window.innerWidth)  * 2 - 1; // -1..1
        const ny = (my / window.innerHeight) * 2 - 1;
        tiltTargetX = -ny * TILT_MAX_X;
        tiltTargetY =  nx * TILT_MAX_Y;
      } else if (isMobile) {
        // Niente mouse: sway idle leggerissimo per non lasciare la parete statica
        tiltTargetX = Math.sin(t * 0.2)  * TILT_MAX_X * 0.35;
        tiltTargetY = Math.sin(t * 0.25) * TILT_MAX_Y * 0.35;
      }
      const tiltEase = 1 - Math.exp(-TILT_SMOOTH * dt);
      room.rotation.x += (tiltTargetX - room.rotation.x) * tiltEase;
      room.rotation.y += (tiltTargetY - room.rotation.y) * tiltEase;

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
      if (onMouseLeave) document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      wallTextTexture.dispose();
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
