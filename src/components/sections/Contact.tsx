// ============================================
// ASSE ZERO — Contact Section
// TODO: collegare il form a un endpoint (es. Formspree, Netlify Forms, o API custom)
// ============================================

import { useState, type FormEvent } from 'react';
import { SECTION_IDS } from '@/lib/constants';

const SERVICES = [
  'Produzione Video',
  'Social Media Management',
  'Spot Pubblicitario',
  'Videoclip',
  'Documentario',
  'Recap Evento',
  'Motion Graphics',
  'Altro',
];

const CONTACT_INFO = [
  {
    label: 'Email',
    value: 'info@assezero.com',
    href: 'mailto:info@assezero.com',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@assezero',
    href: 'https://instagram.com/assezero',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

type FormState = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: sostituire con chiamata fetch al proprio endpoint
    // Esempio con Formspree: fetch('https://formspree.io/f/YOURCODE', { method: 'POST', body: JSON.stringify(form), headers: { 'Content-Type': 'application/json' } })
    setFormState('sending');
    setTimeout(() => setFormState('sent'), 800);
  };

  const inputClass =
    'w-full bg-dark/10 border border-dark/20 rounded-xl px-4 py-3 text-dark placeholder:text-dark/40 font-medium focus:outline-none focus:ring-2 focus:ring-dark/40 transition-all duration-200';

  return (
    <section
      id={SECTION_IDS.contact}
      className="w-full min-h-screen bg-secondary text-dark flex flex-col items-center justify-center py-24"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
        <h2 className="text-4xl sm:text-5xl font-heading font-black tracking-tighter mb-4">
          CONTATTI
        </h2>
        <p className="text-dark/60 text-base sm:text-lg mb-12 max-w-lg">
          Raccontaci il tuo progetto. Ti risponderemo entro 24 ore.
        </p>

        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Form */}
          <div className="flex-1">
            {formState === 'sent' ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-dark/10 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="font-heading font-black text-2xl tracking-tight">Messaggio inviato!</p>
                <p className="text-dark/60">Ti risponderemo il prima possibile.</p>
                <button
                  onClick={() => { setFormState('idle'); setForm({ name: '', email: '', service: '', message: '' }); }}
                  className="mt-2 text-sm underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  Invia un altro messaggio
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex flex-col gap-1">
                    <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-widest text-dark/60">
                      Nome e Cognome
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Mario Rossi"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-widest text-dark/60">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="mario@brand.it"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="contact-service" className="text-xs font-bold uppercase tracking-widest text-dark/60">
                    Servizio di interesse
                  </label>
                  <select
                    id="contact-service"
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="" disabled>Seleziona un servizio...</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-widest text-dark/60">
                    Messaggio
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Descrivici il tuo progetto, obiettivi e tempistiche..."
                    value={form.message}
                    onChange={handleChange}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === 'sending'}
                  className="mt-2 self-start bg-dark text-secondary font-heading font-black text-sm tracking-widest uppercase px-8 py-4 rounded-xl hover:bg-dark/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-dark/60"
                  aria-live="polite"
                >
                  {formState === 'sending' ? 'INVIO IN CORSO...' : 'INVIA MESSAGGIO'}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="md:w-72 flex flex-col gap-6 justify-start pt-2">
            <div>
              <h3 className="font-heading font-black text-xl tracking-tight mb-4">Dove trovarci</h3>
              <ul className="flex flex-col gap-4" aria-label="Contatti">
                {CONTACT_INFO.map((info) => (
                  <li key={info.label} className="flex items-center gap-3">
                    <span className="text-dark/60">{info.icon}</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-dark/50">{info.label}</p>
                      <a
                        href={info.href}
                        className="font-medium hover:underline underline-offset-4 transition-all"
                        target={info.href.startsWith('http') ? '_blank' : undefined}
                        rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {info.value}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto">
              <div className="border-t border-dark/20 pt-6">
                <p className="text-xs text-dark/50 leading-relaxed">
                  Ogni progetto viene quotato su misura dopo un'analisi delle tue esigenze. Non offriamo pacchetti standard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
