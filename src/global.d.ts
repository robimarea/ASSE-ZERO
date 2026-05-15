// ============================================================
// Dichiarazioni ambient per moduli senza tipi incorporati
// ============================================================

// @fontsource/bebas-neue — import side-effect (solo CSS)
declare module '@fontsource/bebas-neue' {}
declare module '@fontsource/bebas-neue/*' {}

// three/addons — @types/three non include i .d.ts individuali,
// solo il barrel Addons.d.ts (che a sua volta re-esporta da
// percorsi non esistenti). Dichiariamo qui i simboli usati.
declare module 'three/addons' {
  import type {
    Camera,
    EventDispatcher,
    Object3D,
    Scene,
    AnimationClip,
    Loader,
  } from 'three';

  export interface GLTF {
    scene: Scene;
    scenes: Scene[];
    cameras: Camera[];
    animations: AnimationClip[];
    asset: { version: string; generator?: string };
    userData: Record<string, unknown>;
  }

  export class GLTFLoader extends Loader {
    load(
      url: string,
      onLoad: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void,
    ): void;
  }

  export class OrbitControls extends EventDispatcher {
    constructor(camera: Camera, domElement: HTMLElement);
    enableDamping: boolean;
    dampingFactor: number;
    enablePan: boolean;
    minDistance: number;
    maxDistance: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    update(): boolean;
    dispose(): void;
  }

  // riesporta tutto il resto da Addons per non nascondere altri simboli
  export * from 'three/addons/rest';
}

declare module 'three/addons/rest' {}
