import Link from "next/link";
import { getCompanyEvents } from "@/lib/company-events";

export const dynamic = "force-dynamic";

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

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Scanner
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        QR-Code-Check-in fürs Einlasspersonal am Handy. Event auswählen, den
        Link ans Personal weitergeben.
      </p>

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
