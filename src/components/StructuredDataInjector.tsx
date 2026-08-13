"use client";

import { useEffect } from "react";
import { buildStructuredData } from "@/lib/structured-data";

// Fragt clientseitig ab, ob strukturierte Daten (JSON-LD) aktiviert sind
// (siehe /admin/seo-tool), und haengt das Script bei Bedarf an <head> an.
// Bewusst client-seitig statt im Server-Rendering der Seite, siehe
// Kommentar in lib/seo-overrides.ts (haengender Blob-Request beim Build).
export default function StructuredDataInjector() {
  useEffect(() => {
    let cancelled = false;

    fetch("/api/seo-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((settings: { structuredDataEnabled?: boolean } | null) => {
        if (cancelled || !settings?.structuredDataEnabled) return;
        if (document.getElementById("seo-structured-data")) return;

        const script = document.createElement("script");
        script.id = "seo-structured-data";
        script.type = "application/ld+json";
        script.text = JSON.stringify(buildStructuredData(window.location.origin));
        document.head.appendChild(script);
      })
      .catch(() => {
        // Kein Nutzer-sichtbarer Effekt, wenn das fehlschlaegt.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
