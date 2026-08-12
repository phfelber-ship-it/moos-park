"use client";

import { useEffect, useState } from "react";
import FlipText from "@/components/FlipText";

export type Consent = {
  necessary: true;
  statistics: boolean;
  marketing: boolean;
};

type StoredConsent = Consent & { savedAt: number };

const STORAGE_KEY = "cookie-consent";
export const CONSENT_EVENT = "cookie-consent-updated";

// Laufzeit der Entscheidung, bevor wir erneut fragen. Bei "nur notwendige"
// speichern wir keinerlei Statistik-/Marketing-Cookies, daher reicht hier
// eine kurze Frist (24h) statt einer echten Speicherfrist wie bei Zustimmung
// (24 Monate, ueblicher Richtwert fuer Cookie-Consent-Banner).
const ACCEPT_TTL_MS = 24 * 30 * 24 * 60 * 60 * 1000; // 24 Monate
const REJECT_TTL_MS = 24 * 60 * 60 * 1000; // 24 Stunden

function ttlFor(consent: Consent): number {
  return consent.statistics || consent.marketing ? ACCEPT_TTL_MS : REJECT_TTL_MS;
}

export function getStoredConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<StoredConsent>;
    // Aeltere gespeicherte Entscheidungen ohne Zeitstempel (vor diesem
    // Ablauf-Mechanismus) gelten als abgelaufen - Banner erscheint erneut,
    // statt auf unbestimmte Zeit von einer alten Entscheidung auszugehen.
    if (typeof stored.savedAt !== "number") return null;
    if (Date.now() - stored.savedAt > ttlFor(stored as Consent)) return null;
    return stored as Consent;
  } catch {
    return null;
  }
}

function saveConsent(consent: Consent) {
  const stored: StoredConsent = { ...consent, savedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);
  const [statistics, setStatistics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    // Bewusst SSR-sicher: Banner startet ausgeblendet (Server-Render) und
    // wird nur nach dem Mount anhand von localStorage eingeblendet, um
    // Hydration-Mismatches zu vermeiden.
    if (!getStoredConsent()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent({ necessary: true, statistics: true, marketing: true });
    setVisible(false);
  };

  const rejectAll = () => {
    saveConsent({ necessary: true, statistics: false, marketing: false });
    setVisible(false);
  };

  const saveSelection = () => {
    saveConsent({ necessary: true, statistics, marketing });
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-foreground/10 bg-background/95 p-5 backdrop-blur sm:p-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-wide text-foreground">
          🍪 Wir nutzen Cookies
        </p>
        <p className="mt-2 text-sm text-foreground/70">
          Wir verwenden Cookies, um unsere Website und eure Erfahrung zu
          verbessern. Notwendige Cookies sind für den Betrieb der Seite
          erforderlich, Statistik- und Marketing-Cookies helfen uns, die
          Seite zu optimieren.
        </p>

        {details && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-foreground/10 p-4 text-sm">
            <label className="flex items-center justify-between gap-4 opacity-60">
              <span>Notwendig (immer aktiv)</span>
              <input type="checkbox" checked disabled />
            </label>
            <label className="flex items-center justify-between gap-4">
              <span>Statistik</span>
              <input
                type="checkbox"
                checked={statistics}
                onChange={(e) => setStatistics(e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between gap-4">
              <span>Marketing</span>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={acceptAll}
            className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Alle akzeptieren" />
          </button>
          <button
            onClick={rejectAll}
            className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground"
          >
            <FlipText text="Nur notwendige" />
          </button>
          {details ? (
            <button
              onClick={saveSelection}
              className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground"
            >
              <FlipText text="Auswahl speichern" />
            </button>
          ) : (
            <button
              onClick={() => setDetails(true)}
              className="text-xs font-bold text-foreground/60 underline"
            >
              Einstellungen
            </button>
          )}
          <a
            href="/datenschutz"
            className="text-xs font-bold text-foreground/60 underline"
          >
            Datenschutz
          </a>
        </div>
      </div>
    </div>
  );
}
