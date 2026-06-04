export interface VideoItem {
  id: number;
  title: string;
  subtitle: string;
  gradient: string;
  src: string;
}

export const VIDEO_ITEMS: VideoItem[] = [
  {
    id: 1, title: 'GELATERIA DOLCEZZA', subtitle: 'Sweet Catering — Spot',
    gradient: 'linear-gradient(135deg, #a90f21 0%, #2a0008 60%, #2b2d42 100%)',
    src: '/videos/gelateria-dolcezza_sweet-catering.mp4',
  },
  {
    id: 2, title: 'MOTORI SEVEN', subtitle: 'Spot Pubblicitario',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    src: '/videos/motori-seven.mp4',
  },
  {
    id: 3, title: 'SMOKE BEER', subtitle: 'Skateboards — Spot',
    gradient: 'linear-gradient(135deg, #1c1c1c 0%, #2d2d2d 50%, #3a3a3a 100%)',
    src: '/videos/smoke-beer_skateboards.mp4',
  },
];
