# ASSE ZERO - AI context fisso

## Identita' del progetto

ASSE ZERO e' una landing page one-page per un gruppo di 4 ragazzi che offre:

- produzione video
- social media management
- content strategy
- supporto creativo per brand e presenza social

Il sito ha un taglio visivo/editoriale, con forte uso di scroll storytelling e sezioni reveal/sticky.

## Stack essenziale

- `Vite`: dev server, build e alias `@`
- `React 19`: struttura component-based della landing
- `TypeScript`: tipizzazione e controllo statico
- `Tailwind CSS 4`: styling utility-first e tema via `src/index.css`
- `react-helmet-async`: SEO/meta tag
- `@react-spring/web`: animazioni menu mobile
- `three`, `@react-three/fiber`, `@react-three/drei`, `@react-spring/three`: installati ma non ancora usati nel codice attuale

## Come e' organizzata l'app

- `src/main.tsx` monta `App`
- `src/App.tsx` orchestra tutta la landing
- `src/components/layout/MaskChange.tsx` e' il componente chiave per l'effetto tenda/reveal
- `src/components/sections/*` contiene le sezioni visive principali
- `src/index.css` contiene sia Tailwind sia il design system del brand

Ordine attuale delle sezioni:

1. `Hero`
2. `Showreel`
3. `Services` video
4. `Services` smm
5. `Philosophy`
6. `Team`
7. `Contact`
8. `Footer`

## Stato attuale dei contenuti

- `Showreel` usa immagini placeholder da Unsplash
- `Services` usa card placeholder numerate
- `Team` mostra 3 card placeholder, non ancora 4 membri reali
- `Contact` e' ancora placeholder
- alcune stringhe testuali hanno encoding corrotto

## Note rapide per AI future

- Non cercare un `tailwind.config.*`: qui Tailwind 4 e' configurato via plugin Vite + `@theme` in `src/index.css`
- Le dipendenze Three.js sono previste ma oggi non pilotano nessun componente
- La navigazione principale usa anchor IDs da `src/lib/constants.ts` e `src/data/navigation.ts`
- Il look del sito dipende piu' da scroll architecture e composizione delle sezioni che da routing o stato globale
- C'e' almeno una modifica locale gia' presente in `src/components/layout/Footer.tsx`

## Albero del progetto

```text
ASSE-ZERO/
|-- .github/
|   `-- workflow.yml
|-- public/
|   |-- favicon.svg
|   |-- logo.png
|   |-- robots.txt
|   |-- sitemap.xml
|   `-- fonts/
|       |-- AlteHaasGroteskBold.woff2
|       `-- AlteHaasGroteskRegular.woff2
|-- src/
|   |-- App.tsx
|   |-- index.css
|   |-- main.tsx
|   |-- vite-env.d.ts
|   |-- components/
|   |   |-- layout/
|   |   |   |-- Footer.tsx
|   |   |   |-- MaskChange.tsx
|   |   |   `-- Navbar.tsx
|   |   |-- sections/
|   |   |   |-- Contact.tsx
|   |   |   |-- Hero.tsx
|   |   |   |-- Philosophy.tsx
|   |   |   |-- Services.tsx
|   |   |   |-- Showreel.tsx
|   |   |   `-- Team.tsx
|   |   `-- ui/
|   |       `-- ScrollProgress.tsx
|   |-- data/
|   |   `-- navigation.ts
|   |-- hooks/
|   |   |-- useActiveSection.ts
|   |   `-- useMediaQuery.ts
|   `-- lib/
|       |-- constants.ts
|       `-- seo.tsx
|-- .gitignore
|-- eslint.config.js
|-- index.html
|-- package.json
|-- README.md
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
`-- vite.config.ts
```
