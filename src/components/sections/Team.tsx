// ============================================
// ASSE ZERO — Team Section (cerchi con foto)
// TODO: aggiungere foto reali in /src/assets/team/
// ============================================

import { SECTION_IDS } from '@/lib/constants';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Alessia Debrova',
    role: 'Social media strategist, Content manager',
    quote: 'Costruisce una community un contenuto alla volta.',
    photo: null,
  },
  {
    id: 2,
    name: 'Vittorio Milandri',
    role: 'Videomaker, Operatore di camera, Montatore, Sound designer',
    quote: 'Porta la qualità del cinema nei contenuti di oggi.',
    photo: null,
  },
  {
    id: 3,
    name: 'Salvattore Muratori',
    role: 'Regista, Direttore della fotografia',
    quote: 'Trasforma ogni progetto in un prodotto riconoscibile.',
    photo: null,
  },
  {
    id: 4,
    name: 'Gerardo Romani',
    role: 'Montatore, Colorist',
    quote: 'Dà ritmo, forma e colore alle storie.',
    photo: null,
  },
];

const quoteStyle: React.CSSProperties = {
  fontFamily: 'Arial, sans-serif',
  fontStyle: 'italic',
  fontSize: '1.25rem',
  color: '#e9ac06',
  lineHeight: 1.5,
  maxWidth: '220px',
  paddingTop: '80px', // aligns quote center to sphere center (260px / 2 - ~50px quote half-height)
};

function MemberCard({ member, quoteLeft }: { member: typeof TEAM_MEMBERS[0]; quoteLeft: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '36px' }}>

      {/* Quote — left side for left-column members */}
      {quoteLeft && (
        <p style={{ ...quoteStyle, textAlign: 'center' }}>
          "{member.quote}"
        </p>
      )}

      {/* Circle + name + role */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: '50%',
            backgroundColor: '#e9ac06',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          {member.photo && (
            <img
              src={member.photo}
              alt={member.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'grayscale(100%)',
                display: 'block',
              }}
            />
          )}
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', maxWidth: '260px' }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', color: '#ffffff', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            {member.name}
          </p>
          <p style={{ fontWeight: 400, fontSize: '1rem', color: '#888888', lineHeight: 1.4 }}>
            {member.role}
          </p>
        </div>
      </div>

      {/* Quote — right side for right-column members */}
      {!quoteLeft && (
        <p style={{ ...quoteStyle, textAlign: 'center' }}>
          "{member.quote}"
        </p>
      )}


    </div>
  );
}

export function Team() {
  return (
    <section
      id={SECTION_IDS.team}
      className="w-full bg-dark py-24 overflow-hidden"
      style={{ paddingBottom: '120px' }}
    >
      {/* Titolo */}
      <div className="w-full mb-20 flex justify-center">
        <h2
          className="tracking-tighter leading-none whitespace-nowrap text-center"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.5rem, 10vw, 9rem)', color: '#e9ac06' }}
        >
          IL NOSTRO TEAM
        </h2>
      </div>

      {/* Cards: 2 colonne centrate sull'asse — sx: box 1 e 3, dx: box 2 e 4 */}
      <div className="w-full flex flex-row justify-center" style={{ gap: '260px' }}>

        {/* Colonna sinistra: Alessia e Salvattore — quote a sinistra */}
        <div className="flex flex-col gap-16 items-end">
          {[0, 2].map((index) => (
            <MemberCard key={TEAM_MEMBERS[index].id} member={TEAM_MEMBERS[index]} quoteLeft={true} />
          ))}
        </div>

        {/* Colonna destra: Vittorio e Gerardo — quote a destra */}
        <div className="flex flex-col gap-16 items-start">
          {[1, 3].map((index) => (
            <MemberCard key={TEAM_MEMBERS[index].id} member={TEAM_MEMBERS[index]} quoteLeft={false} />
          ))}
        </div>

      </div>
    </section>
  );
}
