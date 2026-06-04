# Asse Zero — Sito Web

Sito vitrina per **Asse Zero**, studio di produzione video con sede in Romagna. Single-page application ottimizzata per la presentazione di contenuti video ad alto impatto visivo.

---

## Stack

| Tool | Versione | Ruolo |
|---|---|---|
| React | 19 | UI |
| TypeScript | 5.7 | Type safety |
| Vite | 6 | Build + dev server |
| Tailwind CSS | 4 | Styling |
| Lenis | 1.3 | Smooth scroll |
| GSAP | 3 | Animazioni |
| Three.js / OGL | — | Background 3D (Hero) |
| react-helmet-async | — | SEO / meta tags |

---

## Avvio rapido

```bash
cd frontend
npm install
npm run dev       # dev server → http://localhost:5173
npm run build     # build produzione (tsc + vite)
npm run preview   # anteprima build
```

---

## Struttura

```
frontend/
├── public/
│   ├── videos/          # file .mp4 (non versionati, vedi sotto)
│   ├── profile_photos/  # foto team
│   └── posters/         # poster per lazy-load
├── src/
│   ├── components/
│   │   ├── sections/    # sezioni della pagina (una per section)
│   │   ├── layout/      # Navbar, MaskChange
│   │   └── ui/          # componenti riutilizzabili
│   ├── hooks/           # custom hooks
│   ├── data/            # dati statici (testi, pills, navigazione)
│   └── lib/             # utility pure (math, constants, seo)
```

### Sezioni (ordine di pagina)

| Componente | Descrizione |
|---|---|
| `Hero` | Intro con sfondo 3D e cursore personalizzato |
| `Showreel` | Player video con modalità cinema (expand/windowed) |
| `Services` | Servizi offerti |
| `VideoGallery` | Portfolio video con card scroll-driven + lightbox |
| `Team` | Presentazione team con crossfade scroll-driven |
| `Philosophy` | Valori dello studio |
| `PercheScegliere` | Argomenti di differenziazione |
| `IlNostroMetodo` | Processo di lavoro |
| `Contact` | Form e contatti |

---

## Pattern architetturali

### Scroll-driven senza re-render

`Team` e `VideoGallery` (desktop) animano i propri elementi mutando direttamente gli stili DOM dentro un `requestAnimationFrame`, evitando `setState` durante lo scroll:

```
scroll → rAF → DOM mutation (.style.opacity, .style.transform)
```

Questo garantisce fluidità anche su dispositivi mid-range.

### Hook `useVideoPlayer`

Centralizza tutta la logica del player video (stato, auto-hide controlli, timeline, toggle play/mute). Usato da `Showreel` e `VideoGallery`; i componenti gestiscono solo il proprio layout e le interazioni specifiche (expand/minimize, keyboard shortcuts).

```ts
const {
  isPlaying, isMuted, duration, progress, showControls, // stato
  play, pause, togglePlay, toggleMute, setMuted,        // controllo
  handleTimeUpdate, handleLoadedMetadata,               // eventi video
  handleTimelineClick, reset,
} = useVideoPlayer({ videoRef, containerRef, isActive });
```

### Componente `VideoPlayerControls`

Barra controlli condivisa (timeline + play/pause + tempo + mute + minimize opzionale). Nessuno stato interno — riceve tutto via props. Restituisce `null` finché `duration === 0` (video non ancora caricato).

### Lazy-load video

`Showreel` assegna `src` al tag video solo quando la sezione diventa visibile per la prima volta (`isVisible` prop + `hasLoadedRef`). I video della gallery vengono caricati al click (apertura lightbox).

---

## Convenzioni

- **Colori**: rosso primario `#a90f21`, giallo `#ebdb00`, sfondo `#050508`
- **Font**: `Nohemi` (headings), `Satoshi` (body)
- **Z-index**: navbar `z-50`, lightbox/cinema `z-[999]`, chiudi overlay `z-[1010]`
- **Classe CSS**: `video-expanded` su `<body>` — applicata automaticamente da `useVideoPlayer` quando un video è a schermo intero; la navbar la legge per nascondersi
- **Dati statici**: tutti i testi modificabili stanno in `src/data/` — non hardcodati nel componente

---

## File video

I file video **non sono nel repository** per via delle dimensioni. Vanno copiati in:

```
frontend/public/videos/
  show_reel.mp4
  gelateria-dolcezza_sweet-catering.mp4
  motori-seven.mp4
  smoke-beer_skateboards.mp4
```

Se un video manca, la VideoGallery mostra automaticamente un placeholder "Prossimamente".

---

## SEO

Meta tag, Open Graph e Twitter Card sono gestiti in `src/lib/seo.tsx` tramite `react-helmet-async`. La sitemap statica è in `public/sitemap.xml`.
