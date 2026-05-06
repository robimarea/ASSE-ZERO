export type ShowreelAsset = {
  id: number;
  kind: 'image' | 'video';
  title: string;
  label: string;
  poster: string;
  src: string;
};

export const SHOWREEL_ASSETS: ShowreelAsset[] = [
  {
    id: 1,
    kind: 'video',
    title: 'Reference Motion',
    label: 'Video',
    poster: '/showreel/poster-01.png',
    src: '/showreel/spiral-reference.mp4',
  },
  {
    id: 2,
    kind: 'image',
    title: 'Editorial Still',
    label: 'Foto',
    poster: '/showreel/still-01.svg',
    src: '/showreel/still-01.svg',
  },
  {
    id: 3,
    kind: 'video',
    title: 'Chrome Capture',
    label: 'Video',
    poster: '/showreel/poster-02.png',
    src: '/showreel/spiral-reference.mp4',
  },
  {
    id: 4,
    kind: 'image',
    title: 'Set Texture',
    label: 'Foto',
    poster: '/showreel/still-02.svg',
    src: '/showreel/still-02.svg',
  },
  {
    id: 5,
    kind: 'video',
    title: 'Scroll Burst',
    label: 'Video',
    poster: '/showreel/poster-03.png',
    src: '/showreel/spiral-reference.mp4',
  },
  {
    id: 6,
    kind: 'image',
    title: 'Depth Study',
    label: 'Foto',
    poster: '/showreel/still-03.svg',
    src: '/showreel/still-03.svg',
  },
  {
    id: 7,
    kind: 'image',
    title: 'Color Frame',
    label: 'Foto',
    poster: '/showreel/still-04.svg',
    src: '/showreel/still-04.svg',
  },
];
