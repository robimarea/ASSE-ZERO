// ============================================
// ASSE ZERO — ContactBlock
// Card con tilt, info sinistra + form destra
// Form collegato a Web3Forms → assezeroinfo@gmail.com
// Fallback mailto se l'access key non è configurato
// ============================================

import { useState, type FormEvent } from 'react';
import { ContactHoverCard } from './ContactHoverCard';
import { Button } from '@/components/ui/Button';
import styles from './ContactBlock.module.css';
import {
  CONTACT_FORM_ENDPOINT,
  WEB3FORMS_KEY,
  CONTACT_EMAIL,
  WHATSAPP_URL,
  INSTAGRAM_URL,
} from '@/lib/constants';

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
  const [form, setForm]             = useState(INITIAL_FORM);
  const [status, setStatus]         = useState<Status>('idle');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (fieldError) setFieldError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const error = validate(form);
    if (error) {
      setFieldError(error);
      return;
    }

    // Se la chiave Web3Forms non è configurata, apri mailto come fallback robusto
    if (!WEB3FORMS_KEY) {
      const subject = encodeURIComponent(form.subject || `Messaggio da ${form.name}`);
      const body = encodeURIComponent(
        `Nome: ${form.name}\nEmail: ${form.email}\n\nMessaggio:\n${form.message}`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus('sending');

    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        from_name: form.name,
        name: form.name,
        email: form.email,
        subject: form.subject || `Nuovo messaggio da ${form.name} — ASSE ZERO`,
        message: form.message,
      };

      const res = await fetch(CONTACT_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as { success: boolean; message?: string };

      if (!data.success) throw new Error(data.message ?? `HTTP ${res.status}`);

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
                Che si tratti di un video, una campagna social o un brand da costruire da zero,
                siamo qui per trasformarla in realtà.
              </p>
            </div>

            <div>
              <div className={styles.contactLinks}>
                {/* Email */}
                <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactLink}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {CONTACT_EMAIL}
                </a>

                {/* WhatsApp */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>

                {/* Instagram */}
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLink}
                >
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
                  rows={3}
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
              <Button
                type="submit"
                variant="light"
                disabled={status === 'sending'}
                className={styles.submitBtn}
              >
                {status === 'sending' ? 'Invio in corso…' : 'Invia Messaggio'}
                {status !== 'sending' && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </Button>

              {/* Feedback status */}
              {status === 'success' && (
                <p className={`${styles.statusMsg} ${styles.success}`} role="status">
                  ✓ Messaggio inviato!
                </p>
              )}
              {status === 'error' && (
                <p className={`${styles.statusMsg} ${styles.error}`} role="alert">
                  Qualcosa è andato storto. Scrivici direttamente a{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> oppure su{' '}
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
                </p>
              )}
            </form>
          </div>

        </div>
      </ContactHoverCard>
    </div>
  );
}
