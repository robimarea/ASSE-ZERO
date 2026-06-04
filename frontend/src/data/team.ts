export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  photo: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: 'Alessia Debrova',
    role: 'Social media strategist, Content manager',
    bio: "Ho lavorato su contenuti che hanno raggiunto <strong>+800.000 visualizzazioni</strong>, relativi a canali social sia internazionali che italiani, per ben <strong>4 profili differenti</strong> instagram e youtube, sviluppando una forte capacità nella creazione di contenuti efficaci e coerenti con le logiche delle piattaforme. Al centro della mia formazione, c'è stato lo studio del <strong>RETENTION RATE</strong>, fondamentale per mantenere alta l'attenzione dello spettatore e migliorare le performance dei contenuti.",
    photo: '/profile_photos/AlessiaDebrova.PNG',
  },
  {
    id: 2,
    name: 'Vittorio Milandri',
    role: 'Videomaker: Operatore di camera, Montatore, Sound designer',
    bio: "Con più di <strong>tre anni di esperienza</strong> nel settore, ho lavorato con importanti realtà come <strong>Sanremo Newtalent</strong>, <strong>IcaroTV</strong>, strutture turistiche di alto livello nel panorama romagnolo e in set cinematografici per la compagnia <strong>RAI</strong>. Inoltre ho collaborato con case di produzione come <strong>301 Filmont</strong> e <strong>Riccione Video Produzioni</strong> per Aquafan. Con AsseZero, il mio obiettivo è portare <strong>qualità visiva</strong> che valorizzi l'identità del brand e renda ogni contenuto riconoscibile ed efficace.",
    photo: '/profile_photos/VittorioMilandri.png',
  },
  {
    id: 3,
    name: 'Salvattore Muratori',
    role: 'Regista, Direttore della fotografia',
    bio: "Da cinque anni a questa parte, ho gestito contenuti di canali youtube da <strong>5 milioni di visualizzazioni totali</strong> e collaborato con streamers statunitensi. Ho inoltre lavorato per grandi realtà del territorio come <strong>Mediaset</strong> e <strong>Icaro tv</strong>. Il mio ruolo in Asse Zero è quello di curare la <strong>pre-produzione</strong> dei progetti, occupandomi della scrittura del prodotto e spalleggiando la post-produzione dei contenuti.",
    photo: '/profile_photos/SalvattoreMuratori.png',
  },
  {
    id: 4,
    name: 'Gerardo Romani',
    role: 'Montatore, Colorist, Dronista',
    bio: "Per due anni, ho lavorato per eventi musicali, set cinematografici, videoclip e progetti per brand, sviluppando competenze operative in diversi contesti di produzione. Mi occupo principalmente di <strong>montaggio e post-produzione</strong>, curando <strong>ritmo, struttura e qualità</strong> del contenuto. Dispongo inoltre di <strong>attrezzatura professionale per riprese con drone</strong>, con cui amplio le possibilità visive di ogni progetto. Contribuisco alla realizzazione di contenuti efficaci e coerenti, adattati agli obiettivi e alle esigenze specifiche del cliente.",
    photo: '/profile_photos/GerardoRomani.png',
  },
];
