"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";

const SHOW_DURATION = 5000;

// Kurze Intro-Animation, die vor dem eigentlichen Hero einmal kurz
// aufblitzt (Logo faehrt ein, Titel folgt) und sich dann als Vorhang nach
// oben wegschiebt - der Hero darunter ist die ganze Zeit schon gerendert,
// wird also nicht neu aufgebaut, sondern nur freigelegt. Blockiert kurz das
// Scrollen, damit der Effekt nicht durch einen Sprung im Hintergrund
// gestoert wird.
export default function EventExperienceIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Seite soll beim Aufruf immer ganz oben starten - auch wenn der Link
    // einen #anmeldung-Anker enthaelt (z.B. geteilter Link) oder der
    // Browser eine alte Scrollposition wiederherstellen will.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => setVisible(false), SHOW_DURATION);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!visible) document.body.style.overflow = "";
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Image
              src="/images/logo.png"
              alt="moos.park"
              width={160}
              height={160}
              className="w-28 sm:w-40"
              priority
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="text-xl font-black uppercase tracking-[0.3em] text-accent-lime sm:text-2xl"
          >
            THE EVENT EXPERIENCE
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
