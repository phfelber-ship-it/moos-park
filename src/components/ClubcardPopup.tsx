"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import FlipText from "@/components/FlipText";

const STORAGE_KEY = "clubcard-popup-dismissed-at";
// Erscheint hoechstens einmal pro Tag wieder, statt bei jedem Besuch neu zu
// nerven - fuer eine zeitlich begrenzte Aktion reicht das, um trotzdem
// immer wieder sichtbar zu sein.
const REAPPEAR_AFTER_MS = 24 * 60 * 60 * 1000;

export default function ClubcardPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissedAt = 0;
    try {
      dismissedAt = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    } catch {
      // localStorage evtl. blockiert - dann zeigen wir es einfach.
    }
    if (Date.now() - dismissedAt < REAPPEAR_AFTER_MS) return;

    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // egal, dann erscheint es beim naechsten Mal halt wieder.
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-foreground/10 bg-background text-center shadow-2xl"
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Schließen"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground/70 transition-colors hover:bg-foreground/20"
            >
              ✕
            </button>

            <div className="relative overflow-hidden bg-gradient-to-br from-[#050505] via-[#2b2b2b] to-[#0a0a0a] px-8 pb-6 pt-10">
              <div
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 30%, rgba(185,206,173,0.4) 48%, transparent 60%)",
                }}
              />
              <span className="relative inline-block rounded-full bg-accent-lime px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                Jetzt neu
              </span>
              <h2 className="relative mt-3 text-2xl font-black uppercase leading-tight text-white">
                MOOS.PARK
                <br />
                Clubcard
              </h2>
              <p className="relative mt-2 text-xs font-bold uppercase tracking-wide text-white/60">
                Nur für kurze Zeit zum Early-Bird-Preis
              </p>
            </div>

            <div className="px-8 py-6">
              <p className="text-sm text-foreground/70">
                Bronze, Silber, Gold oder Premium – sichere dir jetzt
                günstigeren Eintritt oder gleich die ganze Saison
                eintrittsfrei. Nur bis zum Reopening am 12.09. zum
                Early-Bird-Preis.
              </p>
              <a
                href="/clubcard"
                onClick={dismiss}
                className="mt-5 inline-block w-full rounded-lg bg-accent-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
              >
                <FlipText text="Jetzt entdecken" />
              </a>
              <button
                type="button"
                onClick={dismiss}
                className="mt-3 text-xs font-bold text-foreground/40 underline"
              >
                Später
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
