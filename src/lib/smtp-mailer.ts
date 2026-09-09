// Interner Mailversand fuer Formular-Benachrichtigungen - laeuft ueber
// Resend (gleicher Dienst wie fuer die Event-Experience-Ticketmails, siehe
// lib/event-experience-mailer.ts), nicht mehr ueber eigenes SMTP. Grund:
// bessere Zustellrate/Reputation als ein normales Business-Postfach bei
// automatisiertem Massenversand - siehe Absprache im Adminpanel-Umbau.
// Datei/Funktionsnamen bewusst beibehalten (sendSmtpMail etc.), damit alle
// bestehenden Aufrufer (api/inbox, api/firmenanfrage, api/event-experience/
// register) unveraendert bleiben.
//
// Benoetigte Umgebungsvariablen (Vercel -> Project Settings -> Environment
// Variables), identisch zu lib/event-experience-mailer.ts:
//   RESEND_API_KEY   - Resend-API-Key
//   RESEND_FROM_EMAIL - Absender, z.B. "moos.park <noreply@moos-park.de>"
//     (optional, Fallback siehe unten)

export type SmtpSendResult = { ok: true } | { ok: false; error: string };

const DEFAULT_FROM = "moos.park <noreply@moos-park.de>";

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  return { apiKey, from };
}

export function isSmtpConfigured(): boolean {
  return getResendConfig() !== null;
}

// Fehler, bei denen ein erneuter Versuch sinnvoll ist (Netzwerk/Timeout) -
// eine von Resend abgelehnte Anfrage (4xx, z.B. ungueltige Adresse) wird
// NICHT wiederholt.
function isRetryableStatus(status: number): boolean {
  return status >= 500 || status === 429;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const RETRY_DELAYS_MS = [500, 1500];

// Versendet eine einzelne Mail ueber Resend. Wirft NIE - Aufrufer bekommen
// immer ein klares Ergebnisobjekt zurueck, damit ein Mail-Fehler nie den
// eigentlichen (kritischen) Formular-Speichervorgang zum Absturz bringt.
export async function sendSmtpMail(input: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<SmtpSendResult> {
  const config = getResendConfig();
  if (!config) {
    return { ok: false, error: "Resend nicht konfiguriert (RESEND_API_KEY fehlt)" };
  }

  // Resend erwartet "to" als Array - unser bestehendes Interface reicht
  // wahlweise eine einzelne Adresse oder eine kommagetrennte Liste durch
  // (siehe form-notification-routing.ts).
  const to = input.to.split(",").map((a) => a.trim()).filter(Boolean);

  let lastError: string = "Unbekannter Fehler";

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.from,
          to,
          subject: input.subject,
          text: input.text,
          html: input.html,
        }),
      });

      if (res.ok) {
        return { ok: true };
      }

      const data = await res.json().catch(() => null);
      lastError = data?.message ?? `Resend-Fehler (Status ${res.status})`;

      if (!isRetryableStatus(res.status) || attempt === RETRY_DELAYS_MS.length) {
        return { ok: false, error: lastError };
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      if (attempt === RETRY_DELAYS_MS.length) {
        return { ok: false, error: lastError };
      }
    }
    await delay(RETRY_DELAYS_MS[attempt]);
  }

  return { ok: false, error: lastError };
}

// Fuer den "Verbindung testen"-Button im Adminpanel - prueft nur, ob der
// Resend-API-Key gueltig ist (leichter GET-Call), verschickt keine Mail.
export async function verifySmtpConnection(): Promise<SmtpSendResult> {
  const config = getResendConfig();
  if (!config) {
    return { ok: false, error: "Resend nicht konfiguriert (RESEND_API_KEY fehlt)" };
  }
  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${config.apiKey}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.message ?? `Resend-Fehler (Status ${res.status})` };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
