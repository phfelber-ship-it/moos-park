"use client";

import Link from "next/link";
import type { ReactNode } from "react";

// Wrapper um next/link, der vor der Navigation einen Button-Klick fuer die
// Anhaenger-Statistik meldet (sendBeacon = feuert im Hintergrund, blockiert
// die Navigation nicht). Nur fuer Seiten aus TARGET_PAGES in
// lib/banner-ads.ts gedacht.
export default function TrackedCTA({
  href,
  page,
  button,
  className,
  children,
}: {
  href: string;
  page: string;
  button: string;
  className?: string;
  children: ReactNode;
}) {
  const track = () => {
    try {
      const payload = JSON.stringify({ page, button });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/track/click",
          new Blob([payload], { type: "application/json" })
        );
      } else {
        fetch("/api/track/click", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        });
      }
    } catch {
      // Tracking darf die Navigation nie stoeren.
    }
  };

  return (
    <Link href={href} className={className} onClick={track}>
      {children}
    </Link>
  );
}
