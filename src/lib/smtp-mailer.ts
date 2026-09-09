import nodemailer from "nodemailer";

// Selbst gehosteter SMTP-Versand fuer interne Formular-Benachrichtigungen -
// unabhaengig vom externen Clubscale-CRM, damit Formular-Einsendungen auch
// dann per Mail ankommen, wenn Clubscale mal ausfaellt. Verbindungsdaten
// kommen ausschliesslich aus Umgebungsvariablen (in Vercel zu setzen, siehe
// unten) - hier werden nie echte Zugangsdaten hart codiert.
//
// Benoetigte Umgebungsvariablen (Vercel -> Project Settings -> Environment
// Variables):
//   SMTP_HOST     - Hostname des SMTP-Servers, z.B. "smtp.strato.de"
//   SMTP_PORT     - Port, z.B. "587" (STARTTLS) oder "465" (TLS)
//   SMTP_USER     - Login-Benutzername
//   SMTP_PASSWORD - Login-Passwort
//   SMTP_FROM     - Absender, z.B. "moos.park <formulare@moos-park.de>"
// Ist eine dieser Variablen nicht gesetzt, degradiert der Versand
// kontrolliert (siehe isSmtpConfigured/sendSmtpMail) statt abzustuerzen -
// gleiches Muster wie RESEND_API_KEY in lib/event-experience-mailer.ts.

export type SmtpSendResult = { ok: true } | { ok: false; error: string };

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;

  if (!host || !port || !user || !password || !from) {
    return null;
  }

  return { host, port: Number(port), user, password, from };
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

function createTransport(config: NonNullable<ReturnType<typeof getSmtpConfig>>) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    // Port 465 verlangt implizites TLS von Anfang an, alle anderen Ports
    // (typischerweise 587) nutzen STARTTLS nach dem Verbindungsaufbau.
    secure: config.port === 465,
    auth: { user: config.user, pass: config.password },
  });
}

// Fehler, bei denen ein erneuter Versuch sinnvoll ist (Verbindungsaufbau/
// Timeout) - permanente Ablehnungen (z.B. ungueltige Empfängeradresse,
// Auth-Fehler) sollen NICHT wiederholt werden.
const RETRYABLE_ERROR_CODES = new Set([
  "ETIMEDOUT",
  "ECONNECTION",
  "ECONNREFUSED",
  "ESOCKET",
  "EDNS",
  "ECONNRESET",
]);

function isRetryableError(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  return typeof code === "string" && RETRYABLE_ERROR_CODES.has(code);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RETRY_DELAYS_MS = [500, 1500];

// Versendet eine einzelne Mail per SMTP. Wirft NIE - Aufrufer bekommen immer
// ein klares Ergebnisobjekt zurueck, damit ein Mail-Fehler nie den
// eigentlichen (kritischen) Formular-Speichervorgang zum Absturz bringt.
export async function sendSmtpMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<SmtpSendResult> {
  const config = getSmtpConfig();
  if (!config) {
    return { ok: false, error: "SMTP nicht konfiguriert" };
  }

  const transporter = createTransport(config);
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      await transporter.sendMail({
        from: config.from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
      return { ok: true };
    } catch (err) {
      lastError = err;
      if (!isRetryableError(err) || attempt === RETRY_DELAYS_MS.length) {
        break;
      }
      await delay(RETRY_DELAYS_MS[attempt]);
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  return { ok: false, error: message };
}

// Fuer den "Verbindung testen"-Button im Adminpanel - prueft nur, ob Login/
// Verbindung zum SMTP-Server funktioniert, verschickt keine Mail.
export async function verifySmtpConnection(): Promise<SmtpSendResult> {
  const config = getSmtpConfig();
  if (!config) {
    return { ok: false, error: "SMTP nicht konfiguriert" };
  }
  try {
    const transporter = createTransport(config);
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
