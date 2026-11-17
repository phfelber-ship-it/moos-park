"use client";

import { useEffect, useRef } from "react";
import { CONSENT_EVENT, getStoredConsent, type Consent } from "@/components/CookieConsent";

// Metricool-Webtracking (https://metricool.com). Wird wie der Google Tag
// Manager erst nach Einwilligung geladen - hier nur bei "Statistik". Die Hash-ID
// ist die öffentliche Tracking-ID des Metricool-Kontos (steht auch im Snippet).
const METRICOOL_HASH = "cb15c2eb704e8144a18e901c0c8b259d";
const SCRIPT_SRC = "https://tracker.metricool.com/resources/be.js";

type BeTracker = { t: (options: { hash: string }) => void };

export default function MetricoolTracker() {
  const started = useRef(false);

  useEffect(() => {
    const start = (consent: Consent | null) => {
      if (started.current || !consent?.statistics) return;
      started.current = true;

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => {
        const tracker = (window as unknown as { beTracker?: BeTracker }).beTracker;
        tracker?.t({ hash: METRICOOL_HASH });
      };
      document.head.appendChild(script);
    };

    start(getStoredConsent());

    const handler = (e: Event) => start((e as CustomEvent<Consent>).detail);
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, []);

  return null;
}
