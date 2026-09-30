"use client";

import { useState } from "react";
import type { EventPartner } from "@/lib/company-events";
import FlipText from "@/components/FlipText";

// Partner-Logos eines Firmenevents hochladen/loeschen (Admin). Erscheinen
// auf der oeffentlichen Seite im Abschnitt "Partner" vor den FAQ.
export default function CompanyEventPartnersManager({
  eventId,
  initialPartners,
}: {
  eventId: string;
  initialPartners: EventPartner[];
}) {
  const [partners, setPartners] = useState(initialPartners);
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = `/api/admin/company-events/${eventId}/partners`;

  const upload = async () => {
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", name.trim());
      const res = await fetch(url, { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Upload fehlgeschlagen.");
      setPartners((p) => [...p, data.partner]);
      setName("");
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: EventPartner) => {
    if (!window.confirm(`Partner-Logo${p.name ? ` „${p.name}“` : ""} wirklich entfernen?`)) return;
    setError(null);
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerId: p.id }),
    });
    if (res.ok) setPartners((list) => list.filter((x) => x.id !== p.id));
    else setError("Entfernen fehlgeschlagen.");
  };

  return (
    <div className="mt-4">
      {partners.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {partners.map((p) => (
            <div key={p.id} className="rounded-xl border border-foreground/10 p-3">
              <div className="flex h-20 items-center justify-center rounded-lg bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logoUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="mt-2 truncate text-xs font-bold text-foreground">{p.name || "Ohne Name"}</p>
              <button
                type="button"
                onClick={() => remove(p)}
                className="mt-1 text-xs font-bold text-red-400 hover:underline"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-foreground/50">
          Noch keine Partner – der Abschnitt „Partner“ wird auf der Seite erst
          angezeigt, sobald ein Logo hochgeladen ist.
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-foreground/10 bg-background p-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name des Partners (optional)"
          className="min-w-0 flex-1 rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2 text-sm text-foreground outline-none focus:border-accent-lime"
        />
        <input
          key={partners.length}
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-xs text-foreground/70"
        />
        <button
          type="button"
          onClick={upload}
          disabled={!file || busy}
          className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-50"
        >
          <FlipText text={busy ? "Lädt hoch..." : "Logo hochladen"} />
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-bold text-red-400">{error}</p>}
    </div>
  );
}
