"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, getStoredConsent, type Consent } from "@/components/CookieConsent";

const GTM_ID = "GTM-5WX2BJ9J";

type DataLayerWindow = Window & { dataLayer?: unknown[] };

function dl(): unknown[] {
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  return w.dataLayer;
}

// Google Consent Mode (v2): gtag-Syntax, der GTM erwartet Argumente-Objekte.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  dl().push(arguments);
}

// Gibt die Einwilligung an den GTM weiter. Tags im Container koennen darueber
// (Einwilligungspruefung ad_storage/analytics_storage bzw. Trigger-Ereignisse)
// auf Statistik bzw. Marketing beschraenkt werden.
function pushConsent(consent: Consent) {
  gtag("consent", "update", {
    analytics_storage: consent.statistics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  });
  dl().push({
    event: "cookie_consent_update",
    consent_statistics: consent.statistics,
    consent_marketing: consent.marketing,
  });
  // Ereignisnamen wie im frueheren Cookie-Tool (Borlabs), auf die bestehende
  // Trigger im Container hoeren.
  if (consent.statistics) {
    dl().push({ event: "borlabs-cookie-opt-in-google-analytics" });
  }
}

function pushConsentDefault() {
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function GoogleTagManager() {
  const [loaded, setLoaded] = useState(false);
  const defaultSent = useRef(false);
  const lastPushed = useRef("");

  useEffect(() => {
    const check = (consent: Consent | null) => {
      if (!consent) return;
      if (!defaultSent.current) {
        defaultSent.current = true;
        pushConsentDefault();
      }
      const key = `${consent.statistics}|${consent.marketing}`;
      if (key !== lastPushed.current) {
        lastPushed.current = key;
        pushConsent(consent);
      }
      if ((consent.statistics || consent.marketing) && !loaded) {
        setLoaded(true);
      }
    };

    check(getStoredConsent());

    const handler = (e: Event) => check((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;

    dl().push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);

    const noscript = document.createElement("noscript");
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
    iframe.height = "0";
    iframe.width = "0";
    iframe.style.display = "none";
    iframe.style.visibility = "hidden";
    noscript.appendChild(iframe);
    document.body.prepend(noscript);
  }, [loaded]);

  return null;
}
