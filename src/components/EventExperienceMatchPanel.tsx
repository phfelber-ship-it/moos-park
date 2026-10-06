"use client";

import { useMemo, useState } from "react";
import FlipText from "@/components/FlipText";

// Erkennt aussagekraeftige Woerter in einem Firmennamen (ohne
// Rechtsform-Suffixe) - identisch zur Server-Logik in page.tsx, hier aber
// clientseitig fuer die interaktive Bestaetigung noetig.
const COMPANY_STOPWORDS = new Set([
  "gmbh", "co", "kg", "ag", "ug", "ohg", "gbr", "ev", "e", "v", "und", "the", "ltd", "inc",
]);
function companyWords(c: string): string[] {
  return c
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !COMPANY_STOPWORDS.has(w));
}
function normalizeCompany(c: string): string {
  return c.trim().toLowerCase();
}
function companiesMatch(a: string, b: string): boolean {
  const wordsB = new Set(companyWords(b));
  return companyWords(a).some((w) => wordsB.has(w));
}

type Decision = { invitedKey: string; registeredKey: string; status: "confirmed" | "rejected" };
type Pair = { invited: string; registered: string; invitedKey: string; registeredKey: string };

export default function EventExperienceMatchPanel({
  eventId,
  invitedCompanies,
  registeredCompanies,
  initialDecisions,
}: {
  eventId: string;
  invitedCompanies: string[];
  registeredCompanies: string[];
  initialDecisions: Decision[];
}) {
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
  const [pending, setPending] = useState<Set<string>>(new Set());

  const decisionKey = (invitedKey: string, registeredKey: string) => `${invitedKey}|${registeredKey}`;

  // Alle unscharfen Kandidaten-Paare bilden (ein Invited kann mehrere
  // registrierte Kandidaten haben, z.B. bei mehrdeutigen Namen).
  const candidatePairs: Pair[] = useMemo(() => {
    const pairs: Pair[] = [];
    for (const invited of invitedCompanies) {
      for (const registered of registeredCompanies) {
        if (companiesMatch(invited, registered)) {
          pairs.push({
            invited,
            registered,
            invitedKey: normalizeCompany(invited),
            registeredKey: normalizeCompany(registered),
          });
        }
      }
    }
    return pairs;
  }, [invitedCompanies, registeredCompanies]);

  const decisionFor = (p: Pair) =>
    decisions.find((d) => d.invitedKey === p.invitedKey && d.registeredKey === p.registeredKey);

  const confirmedPairs = candidatePairs.filter((p) => decisionFor(p)?.status === "confirmed");
  const openPairs = candidatePairs.filter((p) => !decisionFor(p));

  const confirmedInvitedKeys = new Set(confirmedPairs.map((p) => p.invitedKey));
  const confirmedRegisteredKeys = new Set(confirmedPairs.map((p) => p.registeredKey));

  const notYetRegisteredCompanies = invitedCompanies.filter(
    (c) => !confirmedInvitedKeys.has(normalizeCompany(c))
  );
  const uninvitedRegisteredCompanies = registeredCompanies.filter(
    (c) => !confirmedRegisteredKeys.has(normalizeCompany(c))
  );

  const decide = async (p: Pair, status: "confirmed" | "rejected") => {
    const key = decisionKey(p.invitedKey, p.registeredKey);
    setPending((cur) => new Set(cur).add(key));
    try {
      await fetch(`/api/admin/company-events/${eventId}/matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitedKey: p.invitedKey, registeredKey: p.registeredKey, status }),
      });
      setDecisions((cur) => [
        ...cur.filter((d) => !(d.invitedKey === p.invitedKey && d.registeredKey === p.registeredKey)),
        { invitedKey: p.invitedKey, registeredKey: p.registeredKey, status },
      ]);
    } finally {
      setPending((cur) => {
        const next = new Set(cur);
        next.delete(key);
        return next;
      });
    }
  };

  const split = async (p: Pair) => {
    if (!window.confirm(`"${p.invited}" und "${p.registered}" wieder trennen?`)) return;
    const key = decisionKey(p.invitedKey, p.registeredKey);
    setPending((cur) => new Set(cur).add(key));
    try {
      await fetch(`/api/admin/company-events/${eventId}/matches`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitedKey: p.invitedKey, registeredKey: p.registeredKey }),
      });
      setDecisions((cur) =>
        cur.filter((d) => !(d.invitedKey === p.invitedKey && d.registeredKey === p.registeredKey))
      );
    } finally {
      setPending((cur) => {
        const next = new Set(cur);
        next.delete(key);
        return next;
      });
    }
  };

  return (
    <div className="mt-4">
      {openPairs.length > 0 && (
        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-yellow-500">
            Neue Übereinstimmung gefunden – bitte bestätigen ({openPairs.length})
          </p>
          <p className="mt-1 text-xs text-foreground/50">
            Passt das? Erst nach Bestätigung zählt die Firma als angemeldet.
          </p>
          <div className="mt-3 grid gap-2">
            {openPairs.map((p) => {
              const key = decisionKey(p.invitedKey, p.registeredKey);
              const busy = pending.has(key);
              return (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-foreground/10 bg-background px-4 py-3"
                >
                  <p className="text-sm text-foreground">
                    <span className="font-bold">{p.invited}</span>
                    <span className="mx-2 text-foreground/30">↔</span>
                    <span className="font-bold">{p.registered}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => decide(p, "confirmed")}
                      disabled={busy}
                      className="rounded-lg bg-accent-lime px-4 py-1.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
                    >
                      <FlipText text="Passt" />
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(p, "rejected")}
                      disabled={busy}
                      className="rounded-lg border border-foreground/15 px-4 py-1.5 text-xs font-black uppercase tracking-wide text-foreground/70 transition-colors hover:border-red-500 hover:text-red-500 disabled:opacity-40"
                    >
                      Falsch
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-accent-lime/30 bg-accent-lime/5 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-accent-lime">
            Angemeldet ({confirmedPairs.length})
          </p>
          {confirmedPairs.length === 0 ? (
            <p className="mt-2 text-xs text-foreground/40">
              Noch keine bestätigte Anmeldung.
            </p>
          ) : (
            <ul className="mt-2 grid gap-1.5">
              {confirmedPairs.map((p) => {
                const key = decisionKey(p.invitedKey, p.registeredKey);
                const busy = pending.has(key);
                return (
                  <li key={key} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-foreground">{p.invited}</span>
                    <button
                      type="button"
                      onClick={() => split(p)}
                      disabled={busy}
                      title="Match wieder trennen"
                      className="shrink-0 text-[11px] font-bold uppercase text-foreground/30 transition-colors hover:text-red-500 disabled:opacity-40"
                    >
                      Trennen
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-foreground/10 bg-background p-4">
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50">
            Noch nicht angemeldet ({notYetRegisteredCompanies.length})
          </p>
          {notYetRegisteredCompanies.length === 0 ? (
            <p className="mt-2 text-xs text-foreground/40">
              Alle eingeladenen Firmen haben sich bereits angemeldet.
            </p>
          ) : (
            <ul className="mt-2 grid gap-1">
              {notYetRegisteredCompanies.map((c) => (
                <li key={c} className="text-sm text-foreground/70">
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {uninvitedRegisteredCompanies.length > 0 && (
        <div className="mt-6 rounded-xl border border-foreground/10 bg-background p-4">
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50">
            Zusätzliche Anmeldungen ohne Einladung ({uninvitedRegisteredCompanies.length})
          </p>
          <p className="mt-1 text-xs text-foreground/40">
            Firmen, die sich angemeldet haben, ohne vorher postalisch
            eingeladen worden zu sein.
          </p>
          <ul className="mt-2 grid gap-1">
            {uninvitedRegisteredCompanies.map((c) => (
              <li key={c} className="text-sm text-foreground">
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
