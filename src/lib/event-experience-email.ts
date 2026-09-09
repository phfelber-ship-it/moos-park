import {
  EVENT_ADDRESS,
  EVENT_DATE_LABEL,
  EVENT_LOCATION_NAME,
  EVENT_TIME_LABEL,
  TIMETABLE,
} from "@/lib/event-experience-info";
import type { Ticket } from "@/lib/event-experience";
import { isAppleWalletConfigured } from "@/lib/apple-wallet";
import { isGoogleWalletConfigured } from "@/lib/google-wallet";

// Escaped Text fuer den Einsatz in HTML - der Vorlagentext kommt aus dem
// Adminpanel (freies Textfeld), daher nicht ungeprueft als HTML einsetzen.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const LIME = "#b9cead";
const BG = "#0b0b0d";
const CARD_BG = "#18181b";
const TEXT = "#f2f2f2";
const MUTED = "#9a9a9e";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

// Baut eine tabellenbasierte, inline-gestylte HTML-Mail (E-Mail-Clients
// unterstuetzen kein modernes CSS zuverlaessig) im moos.park-Look fuer die
// Einladung - der individuell im Adminpanel editierbare Vorlagentext wird
// eingebettet, alle Eckdaten der Veranstaltung stehen zusaetzlich immer
// vollstaendig darunter, egal was im Vorlagentext steht. Der
// Absagen-Hinweis+Button steht ebenfalls immer fest in der Mail (nicht Teil
// des editierbaren Texts), damit er nie versehentlich fehlt.
export function buildCancelUrl(registrationId: string): string {
  return `${SITE_URL}/event-experience/absagen/${registrationId}`;
}

export function buildInvitationEmailHtml(params: {
  bodyText: string;
  ticketCount: number;
  registrationId: string;
  tickets?: Ticket[];
}): string {
  const bodyHtml = escapeHtml(params.bodyText).replace(/\n/g, "<br>");
  const cancelUrl = buildCancelUrl(params.registrationId);

  const appleOn = isAppleWalletConfigured();
  const googleOn = isGoogleWalletConfigured();
  const walletRows =
    (appleOn || googleOn) && params.tickets?.length
      ? params.tickets
          .map((t) => {
            const name = `${t.firstName} ${t.lastName}`.trim();
            const appleUrl = `${SITE_URL}/api/event-experience/${params.registrationId}/wallet/apple?code=${t.code}`;
            const googleUrl = `${SITE_URL}/api/event-experience/${params.registrationId}/wallet/google?code=${t.code}`;
            return `
              <tr>
                <td style="padding:10px 0;border-top:1px solid #2a2a2e;">
                  <div style="font:700 13px Helvetica,Arial,sans-serif;color:${TEXT};margin-bottom:8px;">${name}</div>
                  ${
                    appleOn
                      ? `<a href="${appleUrl}" style="display:inline-block;margin-right:8px;margin-bottom:6px;padding:9px 16px;border-radius:8px;background:#000000;font:700 11px Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;">🍎 Apple Wallet</a>`
                      : ""
                  }
                  ${
                    googleOn
                      ? `<a href="${googleUrl}" style="display:inline-block;margin-bottom:6px;padding:9px 16px;border-radius:8px;background:#1a73e8;font:700 11px Helvetica,Arial,sans-serif;color:#ffffff;text-decoration:none;">G Google Wallet</a>`
                      : ""
                  }
                </td>
              </tr>`;
          })
          .join("")
      : "";

  const timetableRows = TIMETABLE.map(
    (t) => `
      <tr>
        <td style="padding:6px 0;font:700 13px Helvetica,Arial,sans-serif;color:${LIME};width:56px;">${t.time}</td>
        <td style="padding:6px 0;font:700 13px Helvetica,Arial,sans-serif;color:${TEXT};">${t.label}</td>
      </tr>`
  ).join("");

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>THE EVENT EXPERIENCE</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
</style>
</head>
<body style="margin:0;padding:0;background:${BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <tr>
            <td align="center" style="padding-bottom:28px;">
              <div style="font:900 11px/1 Helvetica,Arial,sans-serif;letter-spacing:3px;color:${LIME};text-transform:uppercase;">
                moos.park präsentiert
              </div>
              <div style="margin-top:10px;font:900 34px/1.05 'Montserrat',Helvetica,Arial,sans-serif;letter-spacing:-0.5px;color:${TEXT};text-transform:uppercase;">
                THE EVENT<br>EXPERIENCE
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:${CARD_BG};border-radius:16px;padding:28px 28px;">
              <div style="font:400 15px/1.6 Helvetica,Arial,sans-serif;color:${TEXT};">
                ${bodyHtml}
              </div>
            </td>
          </tr>

          <tr><td style="height:16px;"></td></tr>

          <tr>
            <td style="background:${CARD_BG};border-radius:16px;padding:28px 28px;">
              <div style="font:900 10px/1 Helvetica,Arial,sans-serif;letter-spacing:2px;color:${LIME};text-transform:uppercase;margin-bottom:12px;">
                Ihre Veranstaltung
              </div>
              <div style="font:900 20px/1.3 Helvetica,Arial,sans-serif;color:${TEXT};">
                ${EVENT_DATE_LABEL}
              </div>
              <div style="font:400 14px/1.4 Helvetica,Arial,sans-serif;color:${MUTED};margin-top:2px;">
                ${EVENT_TIME_LABEL}
              </div>
              <div style="font:700 14px/1.4 Helvetica,Arial,sans-serif;color:${TEXT};margin-top:14px;">
                ${EVENT_LOCATION_NAME}
              </div>
              <div style="font:400 13px/1.4 Helvetica,Arial,sans-serif;color:${MUTED};">
                ${EVENT_ADDRESS}
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid #2a2a2e;padding-top:14px;">
                ${timetableRows}
              </table>

              <div style="margin-top:18px;padding-top:14px;border-top:1px solid #2a2a2e;font:700 13px/1.5 Helvetica,Arial,sans-serif;color:${TEXT};">
                🎟 ${params.ticketCount} Ticket${params.ticketCount === 1 ? "" : "s"} im Anhang dieser E-Mail (PDF)
              </div>

              ${
                walletRows
                  ? `<div style="margin-top:16px;font:900 10px/1 Helvetica,Arial,sans-serif;letter-spacing:2px;color:${LIME};text-transform:uppercase;">
                      Direkt zur Wallet hinzufügen
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      ${walletRows}
                    </table>`
                  : ""
              }
            </td>
          </tr>

          <tr><td style="height:16px;"></td></tr>

          <tr>
            <td align="center" style="border:1px dashed #3a3a3e;border-radius:16px;padding:22px 24px;">
              <div style="font:400 13px/1.5 Helvetica,Arial,sans-serif;color:${MUTED};">
                Sie haben leider keine Zeit? Bitte sagen Sie kurz ab, damit
                wir Ihren Platz weitergeben können.
              </div>
              <a href="${cancelUrl}" style="display:inline-block;margin-top:14px;padding:11px 22px;border-radius:8px;border:1px solid ${MUTED};font:700 12px Helvetica,Arial,sans-serif;letter-spacing:0.5px;color:${TEXT};text-decoration:none;text-transform:uppercase;">
                Teilnahme absagen
              </a>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding-top:32px;">
              <div style="font:400 12px/1.6 Helvetica,Arial,sans-serif;color:${MUTED};">
                MOOS-PARK GASTRONOMIE GMBH · Rudolf-Diesel-Straße 23 · 86554 Pöttmes<br>
                s.geisler@moos-park.de
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
