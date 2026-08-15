"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Trackt automatisch jeden Klick auf einen Link/Button auf den
// oeffentlichen Seiten - kein manueller Einbau je Seite noetig. Damit kann
// eine neue Landingpage direkt als Anhaenger-Zielseite genutzt werden, ohne
// dass jemand im Code eine Buttonliste pflegen muss (siehe
// /admin/anhaengerwerbung).
function sendBeaconOrFetch(url: string, payload: string) {
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    // Tracking darf die Navigation nie stoeren.
  }
}

export default function ClickTracker() {
  const pathname = usePathname();

  // Direkter Seitenaufruf, einmal je Seitenwechsel - faengt Anhaenger-Scans
  // ab, deren gedruckter QR-Code nicht (mehr aenderbar) ueber /r/[code]
  // laeuft, sondern direkt auf die Zielseite zeigt (siehe
  // /admin/anhaengerwerbung).
  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    sendBeaconOrFetch(
      "/api/track/pageview",
      JSON.stringify({ page: pathname })
    );
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button");
      if (!target) return;

      const label =
        target.getAttribute("aria-label")?.trim() ||
        target.textContent?.trim().replace(/\s+/g, " ") ||
        "";
      if (!label) return;

      sendBeaconOrFetch(
        "/api/track/click",
        JSON.stringify({ page: pathname, button: label.slice(0, 120) })
      );
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}
