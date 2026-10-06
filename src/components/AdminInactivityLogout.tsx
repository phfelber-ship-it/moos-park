"use client";

import { useEffect, useRef } from "react";

// Meldet im Adminpanel automatisch ab, wenn 30 Minuten lang keine
// Aktivitaet (Maus/Tastatur/Touch/Scroll) stattgefunden hat - der
// admin_session-Cookie selbst laeuft gar nicht von selbst ab (siehe
// lib/session.ts) - fuer ein offen liegendes/gemeinsam genutztes Geraet
// ohne diesen Timer zu lang. Rein clientseitiger Inaktivitaets-Timer, der bei
// Aktivitaet immer wieder zurueckgesetzt wird.
const INACTIVITY_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"] as const;

export default function AdminInactivityLogout() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch("/api/admin/logout", { method: "POST" });
      } catch {
        // ignorieren - Weiterleitung zur Login-Seite passiert trotzdem,
        // dort wird die Session ohnehin per Proxy erneut geprueft.
      }
      window.location.href = "/admin/login";
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(logout, INACTIVITY_MS);
    };

    resetTimer();
    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, resetTimer, { passive: true });
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, []);

  return null;
}
