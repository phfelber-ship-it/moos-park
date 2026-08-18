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
  if (score >= 90) return { label: "🔥 TOP LEAD", className: "bg-orange-500/15 text-orange-400" };
  if (score >= 70) return { label: "🟢 SEHR INTERESSANT", className: "bg-green-500/15 text-green-400" };
  if (score >= 50) return { label: "🟡 INTERESSANT", className: "bg-yellow-500/15 text-yellow-400" };
  return { label: "⚪ NIEDRIGE PRIORITÄT", className: "bg-foreground/10 text-foreground/50" };
}

export default function FirmenManager({
  initialCompanies,
}: {
  initialCompanies: Company[];
}) {
  const [companies, setCompanies] = useState(initialCompanies);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const changeStatus = async (id: string, status: string) => {
    setSavingId(id);
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    try {
      await fetch("/api/admin/firmen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } finally {
      setSavingId(null);
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
    <div className="mt-8 grid gap-4">
      {companies.map((c) => {
        const badge = scoreBadge(c.lead_score);
        const isOpen = expanded === c.id;
        return (
          <div
            key={c.id}
            className="rounded-2xl border border-foreground/10 p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-black uppercase text-foreground">
                  {c.name}
                </p>
                <p className="text-xs text-foreground/50">
                  {c.email} {c.phone ? `· ${c.phone}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}
                >
                  {badge.label} ({c.lead_score})
                </span>
                <select
                  value={c.status}
                  onChange={(e) => changeStatus(c.id, e.target.value)}
                  disabled={savingId === c.id}
                  className="rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs font-bold uppercase text-foreground outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setExpanded(isOpen ? null : c.id)}
              className="mt-3 text-xs font-bold uppercase text-accent-lime"
            >
              {isOpen ? "Details verbergen" : `${c.leads.length} Anfrage(n) anzeigen`}
            </button>

            {isOpen && (
              <div className="mt-4 grid gap-3 border-t border-foreground/10 pt-4">
                <div>
                  <p className="text-xs font-bold uppercase text-foreground/50">
                    Score-Begründung
                  </p>
                  <ul className="mt-1 text-xs text-foreground/60">
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
                    className="rounded-xl bg-foreground/[0.03] p-4 text-sm"
                  >
                    <p className="font-bold text-foreground">
                      {l.event_type}
                      {l.guest_count ? ` · ${l.guest_count} Personen` : ""}
                    </p>
                    <p className="mt-1 text-xs text-foreground/50">
                      {l.contact_name} · {l.email}
                      {l.phone ? ` · ${l.phone}` : ""}
                    </p>
                    {l.preferred_date && (
                      <p className="mt-1 text-xs text-foreground/50">
                        Wunschtermin: {l.preferred_date}
                      </p>
                    )}
                    {l.budget && (
                      <p className="mt-1 text-xs text-foreground/50">
                        Budget: {l.budget}
                      </p>
                    )}
                    {l.message && (
                      <p className="mt-2 text-foreground/70">{l.message}</p>
                    )}
                    <p className="mt-2 text-[11px] text-foreground/30">
                      {new Date(l.created_at).toLocaleString("de-DE")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
