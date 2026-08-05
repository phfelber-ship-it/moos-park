"use client";

import { useMemo, useState } from "react";
import type { InboxEntry, InboxType } from "@/lib/inbox";

const TYPE_LABELS: Record<InboxType, string> = {
  kontakt: "Kontakt",
  eventlocation: "Eventlocation",
  veranstaltung: "Veranstaltung",
  promoter: "Promoter",
  bewerbung: "Bewerbung",
  reservierung: "Reservierung",
};

const TYPE_COLORS: Record<InboxType, string> = {
  kontakt: "bg-blue-500/15 text-blue-400",
  eventlocation: "bg-purple-500/15 text-purple-400",
  veranstaltung: "bg-pink-500/15 text-pink-400",
  promoter: "bg-orange-500/15 text-orange-400",
  bewerbung: "bg-accent-lime/15 text-accent-lime",
  reservierung: "bg-cyan-500/15 text-cyan-400",
};

type Filter = "alle" | InboxType;

export default function InboxManager({
  initialEntries,
}: {
  initialEntries: InboxEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [filter, setFilter] = useState<Filter>("alle");
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      alle: entries.length,
      kontakt: 0,
      eventlocation: 0,
      veranstaltung: 0,
      promoter: 0,
      bewerbung: 0,
      reservierung: 0,
    };
    for (const e of entries) c[e.type]++;
    return c;
  }, [entries]);

  const visible =
    filter === "alle" ? entries : entries.filter((e) => e.type === filter);

  const toggleRead = async (entry: InboxEntry) => {
    setBusyId(entry.id);
    try {
      await fetch("/api/admin/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, read: !entry.read }),
      });
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, read: !e.read } : e))
      );
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await fetch("/api/admin/inbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2 border-b border-foreground/10 pb-4">
        {(
          [
            "alle",
            "kontakt",
            "eventlocation",
            "veranstaltung",
            "promoter",
            "bewerbung",
            "reservierung",
          ] as Filter[]
        ).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-colors ${
              filter === f
                ? "bg-accent-lime text-black"
                : "border border-foreground/20 text-foreground/60 hover:border-accent-lime"
            }`}
          >
            {f === "alle" ? "Alle" : TYPE_LABELS[f]} ({counts[f]})
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {visible.length === 0 && (
          <p className="text-sm text-foreground/50">
            Keine Einträge in dieser Ansicht.
          </p>
        )}
        {visible.map((entry) => (
          <li
            key={entry.id}
            className={`rounded-xl border p-4 ${
              entry.read
                ? "border-foreground/10"
                : "border-accent-lime/40 bg-accent-lime/[0.03]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TYPE_COLORS[entry.type]}`}
                  >
                    {TYPE_LABELS[entry.type]}
                  </span>
                  {!entry.read && (
                    <span className="rounded bg-accent-lime px-2 py-0.5 text-[10px] font-black uppercase text-black">
                      Neu
                    </span>
                  )}
                  <span className="text-xs text-foreground/40">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                <p className="mt-2 font-black uppercase text-foreground">
                  {entry.name || "Ohne Namen"}
                </p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  {[entry.email, entry.phone].filter(Boolean).join(" · ")}
                </p>
                {entry.summary && (
                  <p className="mt-1 text-sm font-bold text-accent">
                    {entry.summary}
                  </p>
                )}
                {entry.message && (
                  <p className="mt-2 whitespace-pre-line text-sm text-foreground/70">
                    {entry.message}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-2 text-xs font-bold uppercase">
                <button
                  type="button"
                  onClick={() => toggleRead(entry)}
                  disabled={busyId === entry.id}
                  className="rounded-lg border border-foreground/20 px-3 py-1.5 text-foreground/70 hover:border-accent-lime disabled:opacity-40"
                >
                  {entry.read ? "Als ungelesen" : "Als gelesen"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  disabled={busyId === entry.id}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-red-500 disabled:opacity-40"
                >
                  Löschen
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
