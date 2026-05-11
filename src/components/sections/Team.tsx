// ============================================
// ASSE ZERO — Team Section
// TODO: sostituire gli avatar placeholder con foto reali in /public/team/
// ============================================

import { SECTION_IDS } from '@/lib/constants';

// Avatar SVG placeholder locale — nessuna dipendenza esterna
function AvatarPlaceholder({ index }: { index: number }) {
  const gradients = [
    ['#BF3320', '#8F2417'],
    ['#E9AC06', '#B78705'],
    ['#CC7F11', '#8F5800'],
  ];
  const [from, to] = gradients[index % gradients.length];
  const id = `avatar-grad-${index}`;

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#${id})`} />
      {/* Silhouette corpo */}
      <circle cx="100" cy="72" r="34" fill="rgba(0,0,0,0.35)" />
      <ellipse cx="100" cy="174" rx="56" ry="40" fill="rgba(0,0,0,0.35)" />
    </svg>
  );
}

const TEAM_MEMBERS = [
  { id: 1, name: 'Membro 1', role: 'Direttore Creativo' },
  { id: 2, name: 'Membro 2', role: 'Video Production' },
  { id: 3, name: 'Membro 3', role: 'Social Media Manager' },
];

export function Team() {
  return (
    <section id={SECTION_IDS.team} className="w-full min-h-screen bg-dark flex flex-col items-center justify-center py-24">
      <div className="w-full max-w-6xl mx-auto px-4 flex flex-col items-center">
        <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-black text-white mb-16 tracking-tighter text-center">
          IL NOSTRO TEAM
        </h2>
        <ul className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-4xl list-none">
          {TEAM_MEMBERS.map((member, index) => (
            <li key={member.id} className="flex flex-col items-center gap-3">
              <div className="w-64 h-80 bg-gray-800 rounded-3xl overflow-hidden border-2 border-white/10 shadow-xl transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(191,51,32,0.2)]">
                {/* TODO: sostituire con <img src={`/team/${member.id}.jpg`} alt={member.name} ... /> */}
                <AvatarPlaceholder index={index} />
              </div>
              <div className="text-center">
                <p className="text-white font-heading font-bold text-lg tracking-tight">{member.name}</p>
                <p className="text-primary text-sm tracking-widest uppercase">{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
