"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, getStoredConsent } from "@/components/CookieConsent";

type FbqFn = { (...args: unknown[]): void };

function pixelLoaded(): boolean {
  return typeof (window as unknown as { fbq?: FbqFn }).fbq === "function";
}

export default function FacebookPixelStatus() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const check = () => {
      const consent = getStoredConsent();
      setConsentGiven(Boolean(consent?.statistics || consent?.marketing));
      setLoaded(pixelLoaded());
    };
    check();
    const id = setInterval(check, 1000);
    window.addEventListener(CONSENT_EVENT, check);
    return () => {
      clearInterval(id);
      window.removeEventListener(CONSENT_EVENT, check);
    };
  }, []);

  const grantMarketingForTest = () => {
    const consent = { necessary: true as const, statistics: true, marketing: true };
    localStorage.setItem("cookie-consent", JSON.stringify(consent));
    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT, { detail: consent })
    );
  };

  const status = loaded
    ? {
        color: "bg-green-500",
        text: "Aktiv - GTM hat den Facebook-Pixel-Tag geladen, Verknuepfung funktioniert.",
      }
    : consentGiven
      ? {
          color: "bg-yellow-500",
          text: "Einwilligung vorhanden, Pixel aber (noch) nicht geladen - Seite neu laden oder GTM-Tag/Trigger pruefen.",
        }
      : {
          color: "bg-red-500",
          text: "Inaktiv - in diesem Browser wurde noch keine Statistik-/Marketing-Einwilligung gegeben.",
        };

  return (
    <div className="mt-8 border-t border-foreground/10 pt-8">
      <h2 className="text-lg font-black uppercase text-foreground">
        Facebook Pixel (über GTM)
      </h2>
      <p className="mt-2 text-xs text-foreground/50">
        Das Pixel laeuft ausschliesslich als Tag im Google Tag Manager - diese
        Anzeige prueft, ob die Verknuepfung tatsaechlich funktioniert.
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className={`h-3 w-3 shrink-0 rounded-full ${status.color}`} />
        <p className="text-sm text-foreground/70">{status.text}</p>
      </div>
      {!loaded && (
        <button
          type="button"
          onClick={grantMarketingForTest}
          className="mt-4 rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground"
        >
          Cookies (nur hier) testweise akzeptieren
        </button>
      )}
      <p className="mt-3 text-xs text-foreground/50">
        Zeigt nur den Status in deinem eigenen Browser gerade jetzt - kein
        Tracking anderer Besucher.
      </p>
    </div>
  );
}
