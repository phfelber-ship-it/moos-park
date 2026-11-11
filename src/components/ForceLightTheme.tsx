"use client";

import { useEffect } from "react";

// Stellt die Seite beim Betreten auf das helle Design um (ohne die gespeicherte
// Wahl des Besuchers zu ueberschreiben) und gibt sie beim Verlassen wieder frei.
export default function ForceLightTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "light");
    return () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        stored = null;
      }
      if (stored === "light") {
        root.setAttribute("data-theme", "light");
      } else {
        root.removeAttribute("data-theme");
      }
    };
  }, []);

  return null;
}
