"use client";

import { useState } from "react";
import FlipText from "@/components/FlipText";

// Meldet ALLE Geraete ab (Adminpanel-Logins + Scanner-QR-Login-Links) -
// sinnvoll, wenn ein Scanner-Handy verloren geht oder der QR-Code in
// falsche Haende geraten ist. Trifft auch die eigene, gerade aktive
// Session (Tokens laufen seit dem Umbau nicht mehr von selbst ab, siehe
// lib/session.ts) - danach ist ein erneuter Login noetig.
export default function RevokeAllSessionsButton() {
  const [status, setStatus] = useState<"idle" | "revoking">("idle");

  const revoke = async () => {
    if (
      !window.confirm(
        "Wirklich ALLE Geräte abmelden? Das trifft auch dieses Gerät hier - inkl. aller Scanner-QR-Login-Links, die dann neu gescannt werden müssen."
      )
    )
      return;
    setStatus("revoking");
    try {
      await fetch("/api/admin/revoke-sessions", { method: "POST" });
    } finally {
      window.location.href = "/admin/login";
    }
  };

  return (
    <button
      type="button"
      onClick={revoke}
      disabled={status === "revoking"}
      className="rounded-lg border border-red-500/30 px-4 py-2 text-[11px] font-black uppercase tracking-wide text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-40"
    >
      <FlipText text={status === "revoking" ? "Wird abgemeldet..." : "Alle Geräte abmelden"} />
    </button>
  );
}
