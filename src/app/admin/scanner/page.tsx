import Link from "next/link";
import { getCompanyEvents } from "@/lib/company-events";

export const dynamic = "force-dynamic";

// Uebersicht/Auswahl fuer den QR-Check-in-Scanner (/scanner/[eventId]) -
// der Scanner selbst hat einen eigenen, vom Admin-Login unabhaengigen
// Zugang fuers Einlasspersonal (siehe src/lib/scanner-session.ts). Diese
// Seite hier ist nur der bequeme Einstiegspunkt im Adminpanel, um pro
// Event den richtigen Scanner-Link zu finden, ohne die Event-ID auswendig
// zu kennen bzw. zu erraten.
export default async function ScannerAdminPage() {
  const events = await getCompanyEvents();
  const activeEvents = events.filter((e) => e.status === "AKTIV");

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Scanner
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        QR-Code-Check-in fürs Einlasspersonal am Handy. Event auswählen, den
        Link ans Personal weitergeben (eigener Login, unabhängig vom
        Admin-Zugang).
      </p>

      {activeEvents.length === 0 ? (
        <p className="mt-8 text-sm text-foreground/50">
          Keine aktiven Firmenevents vorhanden.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {activeEvents.map((ev) => (
            <Link
              key={ev.id}
              href={`/scanner/${ev.id}`}
              target="_blank"
              className="flex items-center justify-between rounded-2xl border border-foreground/10 p-5 transition-colors hover:border-accent-lime"
            >
              <div>
                <p className="text-sm font-black uppercase text-foreground">
                  {ev.name}
                </p>
                <p className="mt-1 text-xs text-foreground/50">
                  {ev.dateLabel}
                </p>
              </div>
              <span className="rounded-lg bg-accent-lime px-4 py-2 text-xs font-black uppercase tracking-wide text-black">
                Scanner öffnen
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
