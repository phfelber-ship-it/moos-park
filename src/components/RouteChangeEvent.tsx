"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Meldet jeden Seitenwechsel ohne Neuladen (Klick auf einen internen Link) an
// den Tag Manager. Ein normaler Seitenaufruf wird vom GTM selbst erkannt, nur
// der erste Pfad wird daher uebersprungen. Im GTM koennen Trigger auf das
// Ereignis "route_change" (Variable "page_path") gelegt werden, damit z.B. die
// seitenspezifischen Pixel-Events auch bei Client-Navigation feuern.
export default function RouteChangeEvent() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (previous.current === null) {
      previous.current = pathname;
      return;
    }
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (pathname.startsWith("/admin")) return;

    const w = window as unknown as {
      dataLayer?: unknown[];
      google_tag_manager?: unknown;
    };
    // Nur melden, wenn der GTM (nach Einwilligung) geladen ist - sonst wuerde
    // er die aufgelaufenen Seitenwechsel spaeter rueckwirkend verarbeiten.
    if (!w.google_tag_manager) return;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({
      event: "route_change",
      page_path: pathname,
      page_location: window.location.href,
    });
  }, [pathname]);

  return null;
}
