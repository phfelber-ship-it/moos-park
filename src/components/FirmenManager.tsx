"use client";

import { useState } from "react";

type Lead = {
  id: string;
  contact_name: string;
  email: string;
  phone: string | null;
  event_type: string;
  guest_count: number | null;
  preferred_date: string | null;
  budget: string | null;
  message: string | null;
  created_at: string;
};

type Company = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  lead_score: number;
  lead_score_breakdown: { label: string; points: number }[];
  created_at: string;
  leads: Lead[];
};

const STATUSES = [
  "NEU",
  "RECHERCHE",
  "ERSTER KONTAKT",
  "KONTAKT HERGESTELLT",
  "GESPRÄCH",
  "ANGEBOT",
  "NACHFASSEN",
  "GEBUCHT",
  "VERLOREN",
  "SPÄTER",
];

function scoreBadge(score: number): { label: string; className: string } {
  if (score >= 90) return { label: "🔥 TOP", className: "bg-orange-500/15 text-orange-400" };
  if (score >= 70) return { label: "🟢 SEHR INTERESSANT", className: "bg-green-500/15 text-green-400" };
  if (score >= 50) return { label: "🟡 INTERESSANT", className: "bg-yellow-500/15 text-yellow-400" };
  return { label: "⚪ NIEDRIG", className: "bg-foreground/10 text-foreground/50" };
}

export default function FirmenManager({
  initialCompanies,
}: {
  initialCompanies: Company[];
}) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);

  const changeStatus = async (id: string, status: string) => {
    const prev = companies;
    setCompanies((cur) =>
      cur.map((c) => (c.id === id ? { ...c, status } : c))
    );
    try {
      const res = await fetch("/api/admin/firmen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      // Fehlschlag: alten Stand wiederherstellen, statt stillschweigend
      // einen Status zu zeigen, der serverseitig nicht gespeichert wurde.
      setCompanies(prev);
    }
  };

  if (companies.length === 0) {
    return (
      <p className="mt-10 text-sm text-foreground/50">
        Noch keine Firmenanfragen eingegangen.
      </p>
    );
  }

  return (
    <div className="mt-8 -mx-6 overflow-x-auto px-6 pb-4">
      <div className="flex min-w-max gap-4">
        {STATUSES.map((status) => {
          const inColumn = companies.filter((c) => c.status === status);
          const isDragOver = dragOverStatus === status;
          return (
            <div
              key={status}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStatus(status);
              }}
              onDragLeave={() => setDragOverStatus((s) => (s === status ? null : s))}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverStatus(null);
                if (draggingId) changeStatus(draggingId, status);
                setDraggingId(null);
              }}
              className={`w-72 shrink-0 rounded-2xl border p-3 transition-colors ${
                isDragOver
                  ? "border-accent-lime bg-accent-lime/5"
                  : "border-foreground/10 bg-foreground/[0.015]"
              }`}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-xs font-black uppercase tracking-wide text-foreground">
                  {status}
                </p>
                <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-bold text-foreground/60">
                  {inColumn.length}
                </span>
              </div>

              <div className="grid gap-2">
                {inColumn.map((c) => {
                  const badge = scoreBadge(c.lead_score);
                  const isOpen = expanded === c.id;
                  return (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={() => setDraggingId(c.id)}
                      onDragEnd={() => setDraggingId(null)}
                      className={`cursor-grab rounded-xl border border-foreground/10 bg-background p-3 active:cursor-grabbing ${
                        draggingId === c.id ? "opacity-40" : ""
                      }`}
                    >
                      <p className="text-sm font-black uppercase text-foreground">
                        {c.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground/50">
                        {c.email}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.className}`}
                        >
                          {badge.label} ({c.lead_score})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : c.id)}
                        className="mt-2 text-[11px] font-bold uppercase text-accent-lime"
                      >
                        {isOpen ? "Details verbergen" : `${c.leads.length} Anfrage(n)`}
                      </button>

                      {isOpen && (
                        <div className="mt-3 grid gap-2 border-t border-foreground/10 pt-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase text-foreground/50">
                              Score-Begründung
                            </p>
                            <ul className="mt-1 text-[11px] text-foreground/60">
                              {c.lead_score_breakdown.map((b, i) => (
                                <li key={i}>
                                  +{b.points} {b.label}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {c.leads.map((l) => (
                            <div
                              key={l.id}
                              className="rounded-lg bg-foreground/[0.03] p-2.5 text-xs"
                            >
                              <p className="font-bold text-foreground">
                                {l.event_type}
                                {l.guest_count ? ` · ${l.guest_count} P.` : ""}
                              </p>
                              <p className="mt-1 text-[10px] text-foreground/50">
                                {l.contact_name} · {l.email}
                                {l.phone ? ` · ${l.phone}` : ""}
                              </p>
                              {l.preferred_date && (
                                <p className="mt-1 text-[10px] text-foreground/50">
                                  Wunschtermin: {l.preferred_date}
                                </p>
                              )}
                              {l.budget && (
                                <p className="mt-1 text-[10px] text-foreground/50">
                                  Budget: {l.budget}
                                </p>
                              )}
                              {l.message && (
                                <p className="mt-1.5 text-foreground/70">
                                  {l.message}
                                </p>
                              )}
                              <p className="mt-1.5 text-[10px] text-foreground/30">
                                {new Date(l.created_at).toLocaleString("de-DE")}
                              </p>
                            </div>
                          ))}

                          <label className="mt-1 block">
                            <span className="text-[10px] font-bold uppercase text-foreground/50">
                              Status manuell setzen
                            </span>
                            <select
                              value={c.status}
                              onChange={(e) => changeStatus(c.id, e.target.value)}
                              className="mt-1 w-full rounded-lg border border-foreground/15 bg-foreground/5 px-2 py-1.5 text-xs font-bold uppercase text-foreground outline-none"
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
                {inColumn.length === 0 && (
                  <p className="px-1 py-4 text-center text-[11px] text-foreground/30">
                    Leer
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
