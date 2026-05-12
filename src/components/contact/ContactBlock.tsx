// ============================================
// ASSE ZERO — ContactBlock
// Card con tilt, info sinistra + form destra
// ============================================

import { useState, type FormEvent } from 'react';
import { ContactHoverCard } from './ContactHoverCard';
import styles from './ContactBlock.module.css';
import { CONTACT_FORM_ENDPOINT } from '@/lib/constants';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

type Status = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: typeof INITIAL_FORM): string | null {
  if (form.name.trim().length < 2) return 'Inserisci il tuo nome (min. 2 caratteri).';
  if (!EMAIL_RE.test(form.email)) return 'Inserisci un indirizzo email valido.';
  if (form.message.trim().length < 10) return 'Il messaggio deve contenere almeno 10 caratteri.';
  return null;
}

export function ContactBlock() {
  const [form, setForm]       = useState(INITIAL_FORM);
  const [status, setStatus]   = useState<Status>('idle');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Pulisce l'errore non appena l'utente inizia a correggere
    if (fieldError) setFieldError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const error = validate(form);
    if (error) {
      setFieldError(error);
      return;
    }

    if (!CONTACT_FORM_ENDPOINT) {
      // Endpoint non configurato: avvisa in console e mostra errore all'utente
      console.error(
        '[ContactBlock] VITE_FORM_ENDPOINT non configurato. ' +
        'Aggiungi VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_ID nel file .env'
      );
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatus('success');
      // Reset automatico dopo 6 secondi
      setTimeout(() => {
        setStatus('idle');
        setForm(INITIAL_FORM);
      }, 6000);
    } catch (err) {
      console.error('[ContactBlock] Errore invio form:', err);
      setStatus('error');
    }
  };

  return (
    <div className={styles.cardPerspective}>
      <ContactHoverCard>
        <div className={styles.layout}>

          {/* ── Colonna sinistra: info ── */}
          <div className={styles.info}>
            <div>
              <h3 className={styles.infoTitle}>
                Hai un progetto<br />in mente?
              </h3>
              <p className={styles.infoDesc}>
                Raccontaci la tua idea: che si tratti di un video,
                una campagna social o un brand da costruire da zero,
                siamo qui per trasformarla in realtà.
                Ti rispondiamo entro 24 ore.
              </p>
            </div>

            <div>
              <div className={styles.contactLinks}>
                {/* Email */}
                <a href="mailto:info@assezero.com" className={styles.contactLink}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  info@assezero.com
                </a>
                {/* Instagram */}
                <a href="https://instagram.com/assezero" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                  </svg>
                  @assezero
                </a>
              </div>
              <div className={styles.accentBar} />
            </div>
          </div>

          {/* ── Colonna destra: form ── */}
          <div className={styles.formCol}>
            <form onSubmit={handleSubmit} noValidate>
              {/* Row: Nome + Email */}
              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="cb-name" className={styles.label}>Nome</label>
                  <input
                    id="cb-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Mario Rossi"
                    value={form.name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label htmlFor="cb-email" className={styles.label}>Email</label>
                  <input
                    id="cb-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="mario@brand.it"
                    value={form.email}
                    onChange={handleChange}
                    className={styles.input}
                  />
                </div>
              </div>

              {/* Oggetto */}
              <div className={styles.fieldGroup}>
                <label htmlFor="cb-subject" className={styles.label}>Oggetto</label>
                <input
                  id="cb-subject"
                  name="subject"
                  type="text"
                  placeholder="Di cosa hai bisogno?"
                  value={form.subject}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>

              {/* Messaggio */}
              <div className={styles.fieldGroup}>
                <label htmlFor="cb-message" className={styles.label}>Messaggio</label>
                <textarea
                  id="cb-message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Descrivici il tuo progetto, obiettivi e tempistiche..."
                  value={form.message}
                  onChange={handleChange}
                  className={styles.textarea}
                />
              </div>

              {/* Errore validazione client-side */}
              {fieldError && (
                <p className={`${styles.statusMsg} ${styles.error}`} role="alert">
                  {fieldError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className={styles.submitBtn}
              >
                {status === 'sending' ? 'Invio in corso…' : 'Invia Messaggio'}
                {status !== 'sending' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>

              {/* Feedback status */}
              {status === 'success' && (
                <p className={`${styles.statusMsg} ${styles.success}`} role="status">
                  Messaggio inviato! Ti risponderemo il prima possibile.
                </p>
              )}
              {status === 'error' && (
                <p className={`${styles.statusMsg} ${styles.error}`} role="alert">
                  Qualcosa è andato storto. Riprova o scrivici direttamente a{' '}
                  <a href="mailto:info@assezero.com">info@assezero.com</a>.
                </p>
              )}
            </form>
          </div>

        </div>
      </ContactHoverCard>
    </div>
  );
}
