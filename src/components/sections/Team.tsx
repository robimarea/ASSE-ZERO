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
    photo: null, // TODO: import alessiaImg from '@/assets/team/alessia.jpg'
  },
  {
    id: 2,
    name: 'Vittorio Milandri',
    role: 'Videomaker, Operatore di camera, Montatore, Sound designer',
    photo: null, // TODO: import vittorioImg from '@/assets/team/vittorio.jpg'
  },
  {
    id: 3,
    name: 'Salvattore Muratori',
    role: 'Regista, Direttore della fotografia',
    photo: null, // TODO: import salvattoreImg from '@/assets/team/salvattore.jpg'
  },
  {
    id: 4,
    name: 'Gerardo Romani',
    role: 'Montatore, Colorist',
    photo: null, // TODO: import gerardoImg from '@/assets/team/gerardo.jpg'
  },
];


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
      <div className="w-full flex flex-row justify-center" style={{ gap: '380px' }}>

        {/* Colonna sinistra: box 1 (Alessia) e box 3 (Salvattore) */}
        <div className="flex flex-col gap-16 items-center">
          {[0, 2].map((index) => {
            const member = TEAM_MEMBERS[index];
            return (
              <div key={member.id} className="flex flex-col items-center text-center">
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
                <div className="mt-4 flex flex-col items-center gap-1 max-w-[260px]">
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.05em' }}>
                    {member.name}
                  </p>
                  <p style={{ fontWeight: 400, fontSize: '1rem', color: '#888888', lineHeight: 1.4 }}>
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Colonna destra: box 2 (Vittorio) e box 4 (Gerardo) */}
        <div className="flex flex-col gap-16 items-center">
          {[1, 3].map((index) => {
            const member = TEAM_MEMBERS[index];
            return (
              <div key={member.id} className="flex flex-col items-center text-center">
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
                <div className="mt-4 flex flex-col items-center gap-1 max-w-[260px]">
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color: '#ffffff', letterSpacing: '0.05em' }}>
                    {member.name}
                  </p>
                  <p style={{ fontWeight: 400, fontSize: '1rem', color: '#888888', lineHeight: 1.4 }}>
                    {member.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
