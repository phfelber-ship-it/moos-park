"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, getStoredConsent, type Consent } from "@/components/CookieConsent";

const PIXEL_ID = "825782290474986";

// Facebook Pixel ist reines Marketing-Tracking, daher nur mit
// ausdruecklicher Marketing-Einwilligung laden (nicht schon bei
// "nur Statistik").
export default function FacebookPixel() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const check = (consent: Consent | null) => {
      if (consent?.marketing && !loaded) {
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

    type FbqFn = {
      (...args: unknown[]): void;
      queue: unknown[];
      loaded: boolean;
      version: string;
      callMethod?: (...args: unknown[]) => void;
    };
    const w = window as unknown as { fbq?: FbqFn; _fbq?: FbqFn };

    if (!w.fbq) {
      const fbq: FbqFn = function (...args: unknown[]) {
        if (fbq.callMethod) {
          fbq.callMethod(...args);
        } else {
          fbq.queue.push(args);
        }
      } as FbqFn;
      fbq.queue = [];
      fbq.loaded = true;
      fbq.version = "2.0";
      w.fbq = fbq;
      w._fbq = fbq;

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(script);
    }

    w.fbq!("init", PIXEL_ID);
    w.fbq!("track", "PageView");
  }, [loaded]);

  return null;
}
