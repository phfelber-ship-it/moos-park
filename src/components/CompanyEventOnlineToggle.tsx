"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EventStatus } from "@/lib/company-events";

// Schaltet die oeffentliche Seite eines Firmenevents online/offline.
// Offline zeigt Besuchern eine freundliche Hinweisseite (siehe
// CompanyEventOfflinePage) statt der Landingpage.
export default function CompanyEventOnlineToggle({
  eventId,
  initialStatus,
}: {
  eventId: string;
  initialStatus: EventStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<EventStatus>(initialStatus);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const online = status === "AKTIV";

  const toggle = async () => {
    if (busy) return;
    const next: EventStatus = online ? "ARCHIVIERT" : "AKTIV";
    const ok = window.confirm(
      online
        ? "Seite wirklich offline nehmen?\n\nBesucher sehen dann nur noch einen Hinweis „Hier hat sich etwas geändert – bitte melden Sie sich bei uns“. Anmeldungen sind dann nicht mehr möglich."
        : "Seite wieder online schalten?"
    );
    if (!ok) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/company-events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      setStatus(next);
      router.refresh();
    } catch {
      setError("Umschalten fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${
          online ? "bg-accent-lime/20 text-accent-lime" : "bg-red-500/15 text-red-400"
        }`}
      >
        {online ? "Online" : "Offline"}
      </span>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className="rounded-lg border border-foreground/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime disabled:opacity-50"
      >
        {busy ? "..." : online ? "Offline nehmen" : "Online schalten"}
      </button>
      {error && <span className="text-xs font-bold text-red-400">{error}</span>}
    </div>
  );
}
