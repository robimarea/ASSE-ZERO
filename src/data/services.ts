// ============================================
// ASSE ZERO — Services Data
// Unica fonte di verità per pills e descrizioni
// ============================================

export const VIDEO_PILLS = [
  'Spot Pubblicitari',
  'Videoclip',
  'Documentari',
  'Recap Eventi',
  'Motion Graphics',
] as const;

export const SMM_PILLS = [
  'Gestione Profilo',
  'Content Strategy',
  'Trending',
  'Algorithm Following',
  'Strategia Personalizzata',
  'Consulenze',
] as const;

export const VIDEO_DESCRIPTION = [
  'Il servizio video spazia tra un range di offerta variabile: dallo <strong>shortform dinamico</strong> allo <strong>spot pubblicitario</strong> in chiave cinematografica',
  'I nostri operatori si avvalgono di <strong>attrezzatura professionale</strong>: videocamere cine, droni, microfoni lavalier, luci da set, stabilizzatori.',
  'Oltretutto, il servizio comprende anche il completo processo di <strong>post-produzione</strong>: VFX, Color correction, Montaggio, Sound design, 3D, Motion Design.'
];

export const SMM_PRICE_PLANS = [
  {
    name: 'BASE',
    price: 'Contattaci',
    description: 'Il punto di partenza per una presenza social professionale.',
    features: [
      'Gestione del profilo',
      'Pianificazione e strategia personalizzata',
      'Analisi di mercato e dei competitors',
      '3 contenuti basici al mese + stories',
    ],
    cta: 'Seleziona BASE',
  },
  {
    name: 'GLOW UP',
    price: 'Contattaci',
    description: 'Per chi vuole iniziare a spingere sui contenuti video (Reel).',
    features: [
      'Piano BASE +',
      '2/3 Reel Strutturati',
    ],
    cta: 'Scegli GLOW UP',
  },
  {
    name: 'GAME CHANGER',
    price: 'Contattaci',
    description: 'La soluzione completa per un impatto social cinematografico.',
    features: [
      'Piano BASE +',
      '2 Reel in stile Cinematografico',
      '3 Reel in stile Catchy/Dinamico',
      '2/3 Reel Specifici a scelta (eventi)',
    ],
    cta: 'Scegli GAME CHANGER',
  },
] as const;

export const VIDEO_PLANS = [
  {
    name: 'Social Pack',
    price: 'da €800',
    description: 'Pacchetto di contenuti ottimizzati per Reels e TikTok.',
    features: [
      '5-10 Reels professionali',
      'Editing dinamico',
      'Sound design incluso',
      'Consegna rapida',
    ],
  },
  {
    name: 'Commercial',
    price: 'da €2.500',
    description: 'Spot pubblicitari in 4K/6K con qualità cinematografica.',
    features: [
      'Spot 30-60 secondi',
      'Troupe professionale',
      'Color Grading avanzata',
      'VFX & Motion Design',
    ],
  },
  {
    name: 'Corporate',
    price: 'da €1.500',
    description: 'Interviste e video aziendali per raccontare il tuo brand.',
    features: [
      'Storytelling aziendale',
      'Interviste professionali',
      'Recap eventi',
      'Montaggio narrativo',
    ],
  },
] as const;
