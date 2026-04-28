# ASSE ZERO - Documentazione tecnica del progetto

## Scopo del sito

ASSE ZERO e' un sito one-page di presentazione per un gruppo creativo che offre:

- produzione video
- social media management
- consulenza e content strategy

L'obiettivo del sito e' mostrare servizi, approccio, team e contatti in una landing ad alto impatto visivo, con scroll narrativo e sezioni che si rivelano progressivamente.

## Stack usato e scopo nel progetto

### Vite

`Vite` gestisce sviluppo locale, dev server e build finale. In questo progetto serve a:

- avviare il sito in sviluppo con `npm run dev`
- compilare il bundle di produzione con `npm run build`
- collegare i plugin React e Tailwind
- definire l'alias `@` verso `src/`

File chiave:

- `vite.config.ts`
- `index.html`
- `src/main.tsx`

### TypeScript

`TypeScript` da struttura e sicurezza al codice React. Qui viene usato per:

- tipizzare props e dati condivisi
- mantenere piu' affidabili hook e componenti
- validare il codice in fase di build con `tsc -b`

File chiave:

- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- tutti i file `*.ts` e `*.tsx` in `src/`

### Tailwind CSS 4

`Tailwind CSS` viene usato per tutto lo styling utility-first. In questo repo non c'e' un `tailwind.config.*` perche' il progetto usa `Tailwind v4` tramite plugin Vite e personalizzazione diretta in CSS con `@theme`.

Nel progetto serve a:

- costruire layout e responsive design
- gestire palette, spacing e font tramite variabili tema
- accelerare la composizione visiva delle sezioni

File chiave:

- `src/index.css`
- `vite.config.ts`
- classi Tailwind dentro i componenti React

### React

`React` organizza la pagina in componenti e sezioni riusabili. Il sito e' una SPA semplice con composizione verticale delle sezioni.

Nel progetto serve a:

- definire ogni blocco del sito come componente separato
- gestire stato locale per scroll, reveal e menu mobile
- mantenere il codice facilmente estendibile

File chiave:

- `src/App.tsx`
- `src/components/**`

### react-helmet-async

`react-helmet-async` gestisce i meta tag SEO lato client.

Nel progetto serve a:

- impostare title, description e canonical
- aggiornare Open Graph e metadati Twitter

File chiave:

- `src/lib/seo.tsx`
- `src/App.tsx`

### react-spring

`@react-spring/web` viene usato per le animazioni del menu mobile.

Nel progetto serve a:

- animare l'overlay mobile della navbar con movimento morbido
- centralizzare la configurazione della spring in `SPRING_CONFIG`

File chiave:

- `src/components/layout/Navbar.tsx`
- `src/lib/constants.ts`

### three.js, @react-three/fiber, @react-three/drei, @react-spring/three

Queste dipendenze sono installate ma al momento non risultano usate nel codice dentro `src/`.

Probabile scopo previsto nel progetto:

- introdurre scene 3D o effetti WebGL
- rendere piu' immersivo hero, transizioni o portfolio
- animare oggetti 3D con approccio React-friendly

Stato attuale:

- presenti in `package.json`
- non importate nei componenti attuali
- quindi non partecipano ancora alla UI reale

## Architettura generale dell'app

### Entrata applicazione

`src/main.tsx` monta `App` dentro `#root` e importa gli stili globali.

### Root dell'interfaccia

`src/App.tsx` compone la landing in questo ordine:

1. `SEO`
2. `ScrollProgress`
3. `Navbar`
4. `Hero` come "curtain" che rivela `Showreel`
5. `Services` per area video
6. `Services` per area social media management
7. `Philosophy` come "curtain" che rivela `Team`
8. `Contact` come "curtain" che rivela il blocco finale con `Footer`

La logica visiva distintiva del sito e' costruita soprattutto da `MaskChangeUI`, che simula sezioni a tenda con comportamento sticky.

## Struttura dei file principali

### Root del progetto

#### `package.json`

Definisce:

- nome progetto
- script `dev`, `build`, `lint`, `preview`
- dipendenze runtime e sviluppo

E' il punto di riferimento per capire quali strumenti sono realmente previsti dal progetto.

#### `package-lock.json`

Lock file npm. Serve a bloccare versioni esatte delle dipendenze e rendere installazioni e build piu' riproducibili.

#### `vite.config.ts`

Configura Vite con:

- plugin React
- plugin Tailwind CSS Vite
- alias `@ -> ./src`
- `server.host = true` per accesso da rete locale

#### `tsconfig.json`

Fa da file base e referenzia i due config separati:

- `tsconfig.app.json`
- `tsconfig.node.json`

#### `tsconfig.app.json`

Config TypeScript per il codice frontend:

- target `ES2020`
- JSX React
- strict mode attivo
- alias `@/*`
- `noEmit: true`

#### `tsconfig.node.json`

Config TypeScript per il contesto Node, usato qui soprattutto da `vite.config.ts`.

#### `eslint.config.js`

Configura ESLint con:

- preset JS consigliato
- preset `typescript-eslint`
- plugin `react-hooks`
- plugin `react-refresh`
- esclusione di `dist`

#### `index.html`

HTML base della SPA. Contiene:

- root `#root`
- metadati SEO iniziali
- JSON-LD organizzazione
- favicon

Nota importante: nel file compaiono alcuni caratteri corrotti tipo `â€”` e `Ã¨`, segnale di probabile problema di encoding da sistemare.

#### `.gitignore`

Contiene i pattern ignorati dal versionamento.

#### `README.md`

Descrizione minima del progetto, attualmente molto sintetica.

### Cartella `.github`

#### `.github/workflow.yml`

Workflow CI placeholder generato da template GitHub Actions. Al momento non builda davvero il progetto: esegue solo `echo`.

### Cartella `public`

#### `public/logo.png`

Logo principale del brand, usato in navbar e hero.

#### `public/favicon.svg`

Favicon del sito.

#### `public/robots.txt`

Regole base per crawler e riferimento alla sitemap.

#### `public/sitemap.xml`

Sitemap minimale con la homepage.

#### `public/fonts/AlteHaasGroteskBold.woff2`
#### `public/fonts/AlteHaasGroteskRegular.woff2`

Font locali usati dal design system.

### Cartella `src`

#### `src/main.tsx`

Bootstrap React dell'app. Importa `App` e `index.css`.

#### `src/App.tsx`

File piu' importante della composizione UI. Definisce la sequenza delle sezioni e il pattern di reveal con `MaskChangeUI`.

Osservazioni:

- contiene commenti lunghi di ragionamento ancora lasciati nel componente
- il layout e' gia' pensato come storytelling a scroll

#### `src/index.css`

Base styling del progetto. Contiene:

- import Tailwind
- `@font-face` per font locali
- `@theme` con palette e design tokens
- reset base
- classi utility custom come `glass`, `gradient-text`, `gradient-border`
- stile scrollbar

E' il centro del design system.

#### `src/vite-env.d.ts`

Riferimento ai tipi client di Vite.

### Cartella `src/lib`

#### `src/lib/constants.ts`

Costanti condivise del brand:

- nome sito
- tagline
- descrizione
- URL
- ID sezione
- config spring del menu mobile

Anche qui si notano problemi di encoding in alcune stringhe testuali.

#### `src/lib/seo.tsx`

Componente SEO riusabile che usa `Helmet`.

Funzioni principali:

- genera title e description di default
- espone props opzionali per override
- aggiorna canonical, OG e Twitter tags

### Cartella `src/data`

#### `src/data/navigation.ts`

Dati statici della navbar. Tiene separata la configurazione dei link dalla UI.

### Cartella `src/hooks`

#### `src/hooks/useActiveSection.ts`

Hook che usa `IntersectionObserver` per capire quale sezione e' attiva nel viewport.

Scopo:

- evidenziare il link corretto in navbar durante lo scroll

#### `src/hooks/useMediaQuery.ts`

Hook utility per leggere media query da JavaScript.

Stato attuale:

- presente nel progetto
- non risulta importato altrove al momento

### Cartella `src/components/ui`

#### `src/components/ui/ScrollProgress.tsx`

Barra di progresso in alto che mostra l'avanzamento verticale della pagina.

### Cartella `src/components/layout`

#### `src/components/layout/Navbar.tsx`

Navbar fissa con:

- logo
- link anchor desktop
- menu hamburger mobile
- overlay mobile animato con `react-spring`
- sincronizzazione con sezione attiva

#### `src/components/layout/MaskChange.tsx`

Componente layout chiave del progetto.

Scopo:

- creare l'effetto "tenda" tra una sezione e l'altra
- lasciare sticky il contenuto sotto
- calcolare dinamicamente l'altezza wrapper in base a curtain, contenuto e spazio extra

E' il componente piu' caratterizzante lato UX/scroll architecture.

#### `src/components/layout/Footer.tsx`

Footer full-screen con reveal progressivo in base allo scroll finale.

Contiene:

- brand recap
- quick links
- lista servizi
- barra finale copyright/policy

Osservazioni:

- il reveal usa scala e opacita' legate alla distanza dal fondo pagina
- i link rapidi generano anchor da label lowercase, quindi `Servizi -> #servizi`, ma `Contatti -> #contatti`
- il team descritto nel progetto e' di 4 persone, ma il sito in questo momento mostra solo 3 card team

### Cartella `src/components/sections`

#### `src/components/sections/Hero.tsx`

Sezione iniziale gialla con headline `Video & Media` e logo centrale. Definisce `id="home"`.

#### `src/components/sections/Showreel.tsx`

Sezione sticky con transizione fra asset visivi durante lo scroll.

Caratteristiche:

- altezza totale `300vh`
- cambia slide in base al progresso verticale
- usa immagini remote da Unsplash come placeholder
- simula un player video con CTA play

#### `src/components/sections/Services.tsx`

Sezione servizi con scroll orizzontale guidato da scroll verticale.

Supporta due modalita':

- `video`
- `smm`

Caratteristiche:

- heading gigante
- pill dei servizi
- track orizzontale di card placeholder numerate
- comportamento speciale `overlapNext`

Nota: solo la sezione `video` usa `id="servizi"`, mentre la sezione SMM usa `id="services-smm"` e non e' raggiunta da navbar.

#### `src/components/sections/Philosophy.tsx`

Sezione manifesto del gruppo con claim e copy descrittivo.

Nota: anche qui compaiono caratteri corrotti in alcune parole accentate.

#### `src/components/sections/Team.tsx`

Sezione team con titolo e card immagine.

Stato attuale:

- mostra 3 membri placeholder
- usa avatar remoti `pravatar.cc`
- non rappresenta ancora esplicitamente i 4 ragazzi reali del progetto

#### `src/components/sections/Contact.tsx`

Sezione contatti placeholder.

Stato attuale:

- ha `id="contatti"`
- mostra blocchi segnaposto per form e info
- manca ancora il contenuto finale reale

## Come i file collaborano tra loro

Flusso principale:

1. `index.html` crea il contenitore HTML
2. `src/main.tsx` monta React
3. `src/App.tsx` compone la landing
4. `Navbar` e `useActiveSection` coordinano navigazione e stato visivo
5. `MaskChangeUI` orchestra le rivelazioni tra sezioni
6. `index.css` applica design system e tema globale
7. `SEO` aggiunge metadati pagina

## Stato attuale del progetto

Il progetto e' gia' una base forte per una landing visiva, ma diversi contenuti sono ancora placeholder:

- showreel con immagini demo esterne
- servizi con card numerate invece di case study reali
- team con 3 avatar placeholder invece di 4 profili reali
- contatti ancora non implementati
- workflow CI non ancora reale

## Problemi o dettagli da tenere presenti

- Dipendenze 3D installate ma non ancora usate
- Alcune stringhe hanno problemi di encoding
- Il contenuto del sito e' ancora parzialmente mockup
- Il design system Tailwind vive in `src/index.css`, non in un file config dedicato
- `Footer.tsx` risulta gia' modificato localmente nel worktree
