"use client";

import { useMemo, useState } from "react";

type TicketRow = {
  code: string;
  name: string;
  company: string;
  checkedInAt: string | null;
};

// Statistik + manuelle Namensliste als Fallback zum Kamera-Scanner - fuer
// den Fall, dass ein QR-Code am Einlass mal nicht funktioniert (verschmutzt,
// Akku leer, Ticket nicht ausgedruckt). Nutzt denselben oeffentlichen
// Check-in-Endpunkt wie der Kamera-Scanner (/api/scanner/[eventId]/checkin),
// mit dem Ticket-Code statt einem gescannten Bild.
export default function ScannerOverview({
  eventId,
  initialTickets,
}: {
  eventId: string;
  initialTickets: TicketRow[];
}) {
  const [tickets, setTickets] = useState(initialTickets);
  const [query, setQuery] = useState("");
  const [busyCode, setBusyCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = tickets.length;
    const checkedIn = tickets.filter((t) => t.checkedInAt).length;
    return { total, checkedIn, open: total - checkedIn };
  }, [tickets]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter(
      (t) => t.name.toLowerCase().includes(q) || t.company.toLowerCase().includes(q)
    );
  }, [tickets, query]);

  const checkIn = async (code: string) => {
    setBusyCode(code);
    setError(null);
    try {
      const res = await fetch(`/api/scanner/${eventId}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.status === "OK" || data.status === "ALREADY_CHECKED_IN") {
        setTickets((cur) =>
          cur.map((t) =>
            t.code === code
              ? { ...t, checkedInAt: data.checkedInAt ?? new Date().toISOString() }
              : t
          )
        );
      } else {
        setError(data.message ?? "Check-in fehlgeschlagen.");
      }
    } catch {
      setError("Verbindungsfehler – bitte erneut versuchen.");
    } finally {
      setBusyCode(null);
    }
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-foreground/10 p-4 text-center">
          <p className="text-2xl font-black text-foreground">{stats.total}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
            Tickets gesamt
          </p>
        </div>
        <div className="rounded-2xl border border-accent-lime/30 bg-accent-lime/10 p-4 text-center">
          <p className="text-2xl font-black text-accent-lime">{stats.checkedIn}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
            Eingecheckt
          </p>
        </div>
        <div className="rounded-2xl border border-foreground/10 p-4 text-center">
          <p className="text-2xl font-black text-foreground">{stats.open}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
            Noch offen
          </p>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-black uppercase tracking-wide text-foreground">
          Ticketliste
        </p>
        <p className="mt-1 text-xs text-foreground/50">
          Falls ein QR-Code nicht funktioniert: Person suchen und manuell
          einchecken.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name oder Firma suchen…"
          className="mt-3 w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
        />
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <div className="mt-4 flex flex-col divide-y divide-foreground/8 rounded-2xl border border-foreground/10">
          {filtered.length === 0 && (
            <p className="p-5 text-sm text-foreground/50">Keine Tickets gefunden.</p>
          )}
          {filtered.map((t) => (
            <div
              key={t.code}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div>
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-foreground/50">{t.company}</p>
              </div>
              {t.checkedInAt ? (
                <span className="rounded-full bg-accent-lime/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-accent-lime">
                  ✓ Eingecheckt
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => checkIn(t.code)}
                  disabled={busyCode === t.code}
                  className="rounded-lg bg-accent-lime px-4 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {busyCode === t.code ? "…" : "Einchecken"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
