import Link from "next/link";
import QRCode from "qrcode";
import { getCompanyEvents } from "@/lib/company-events";
import { createSessionToken } from "@/lib/session";

export const dynamic = "force-dynamic";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

// Uebersicht/Auswahl fuer den QR-Check-in-Scanner (/scanner/[eventId]) -
// der Scanner selbst ist bewusst ohne eigenen Login (Geraet am Einlass ist
// physisch kontrolliert). Diese Seite hier ist der bequeme Einstiegspunkt
// im Adminpanel, um pro Event den richtigen Scanner-Link zu finden, ohne
// die Event-ID auswendig zu kennen, sowie fuer die Check-in-Uebersicht
// (Statistik + manuelle Namensliste, falls ein QR-Code mal nicht
// funktioniert - siehe /admin/scanner/[eventId]).
export default async function ScannerAdminPage() {
  const events = await getCompanyEvents();
  const activeEvents = events.filter((e) => e.status === "AKTIV");

  // QR-Code oben: mit der Handy-Kamera scannen -> oeffnet /admin/scanner
  // direkt eingeloggt (Login-Token im Link, siehe api/scanner-login), ohne
  // Benutzername/Passwort auf dem Geraet eintippen zu muessen. Gueltig 30
  // Tage wie eine normale Adminpanel-Session - fuer ein neues Geraet diese
  // Seite hier am bereits eingeloggten Handy/PC neu aufrufen.
  const loginToken = await createSessionToken("scanner-device");
  const loginUrl = `${SITE_URL}/api/scanner-login?t=${loginToken}`;
  const loginQrDataUrl = await QRCode.toDataURL(loginUrl, { margin: 1, width: 220 });

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Scanner
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        QR-Code-Check-in fürs Einlasspersonal am Handy. Event auswählen, den
        Link ans Personal weitergeben.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border border-accent-lime/30 bg-accent-lime/5 p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={loginQrDataUrl}
          alt="QR-Code für automatischen Login im Adminpanel"
          className="h-28 w-28 shrink-0 rounded-lg bg-white p-2"
        />
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-foreground">
            Handy-Login per QR-Code
          </p>
          <p className="mt-1 text-xs text-foreground/60">
            Mit der Handy-Kamera scannen – öffnet das Adminpanel direkt
            angemeldet auf dieser Seite, ohne Passwort einzutippen. Danach
            oben „Scanner öffnen“ antippen.
          </p>
          <p className="mt-2 text-[11px] text-foreground/40">
            Achtung: Wer diesen Code scannt, ist 360 Tage lang im Adminpanel
            angemeldet – nur an vertrauenswürdiges Einlasspersonal zeigen.
          </p>
        </div>
      </div>

      {activeEvents.length === 0 ? (
        <p className="mt-8 text-sm text-foreground/50">
          Keine aktiven Firmenevents vorhanden.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {activeEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-foreground/10 p-5"
            >
              <div>
                <p className="text-sm font-black uppercase text-foreground">
                  {ev.name}
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  {ev.dateLabel}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/scanner/${ev.id}`}
                  className="rounded-lg border border-foreground/20 px-4 py-2 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime"
                >
                  Übersicht
                </Link>
                <Link
                  href={`/scanner/${ev.id}`}
                  target="_blank"
                  className="rounded-lg bg-accent-lime px-4 py-2 text-xs font-black uppercase tracking-wide text-black"
                >
                  Scanner öffnen
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
