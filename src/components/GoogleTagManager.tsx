"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, getStoredConsent, type Consent } from "@/components/CookieConsent";

const GTM_ID = "GTM-5WX2BJ9J";

export default function GoogleTagManager() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const check = (consent: Consent | null) => {
      if (consent && (consent.statistics || consent.marketing) && !loaded) {
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

    (window as unknown as { dataLayer: unknown[] }).dataLayer =
      (window as unknown as { dataLayer: unknown[] }).dataLayer || [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
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
