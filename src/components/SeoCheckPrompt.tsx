"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FlipText from "@/components/FlipText";

// Login-Seite setzt dieses Flag direkt nach erfolgreichem Login (siehe
// admin/login/page.tsx) - wird hier einmalig konsumiert, damit die Frage
// "Jetzt Webseite prüfen?" genau einmal pro frischem Login erscheint, nicht
// bei jeder weiteren Navigation im Adminbereich.
const JUST_LOGGED_IN_KEY = "admin-just-logged-in";

export default function SeoCheckPrompt() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    try {
      if (sessionStorage.getItem(JUST_LOGGED_IN_KEY) === "1") {
        sessionStorage.removeItem(JUST_LOGGED_IN_KEY);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
      }
    } catch {
      // sessionStorage evtl. blockiert - dann einfach keine Nachfrage.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible || pathname === "/admin/login") return null;

  const no = () => setVisible(false);
  const yes = () => {
    setVisible(false);
    router.push("/admin/seo-tool?autorun=1");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-background p-8 text-center shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          SEO-Tool
        </p>
        <h2 className="mt-3 text-xl font-black uppercase text-foreground">
          Jetzt Webseite prüfen?
        </h2>
        <p className="mt-3 text-sm text-foreground/60">
          Prüft die gesamte Website auf Überschriften, Inhalte und
          technisches SEO. Dauert bis zu einer Minute.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={yes}
            className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Ja" />
          </button>
          <button
            type="button"
            onClick={no}
            className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground"
          >
            <FlipText text="Nein" />
          </button>
        </div>
      </div>
    </div>
  );
}
