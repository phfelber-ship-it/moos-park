"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

const SLIDE_DURATION = 8000;

export default function HeroBackground({ images }: { images: string[] }) {
  const slides = images.length > 0 ? images : ["/images/hero-bg.jpg"];
  // Jeden Tag startet ein anderes Bild als erstes (Reihenfolge bleibt
  // gleich, nur der Einstiegspunkt rotiert taeglich weiter) - Server- und
  // Client-Render laufen praktisch immer am selben Kalendertag, daher kein
  // Hydration-Mismatch zu erwarten.
  const [startIndex] = useState(() => {
    const daysSinceEpoch = Math.floor(Date.now() / 86_400_000);
    return slides.length > 0 ? daysSinceEpoch % slides.length : 0;
  });
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <motion.div
      initial={{ clipPath: "inset(20% round 32px)" }}
      animate={{ clipPath: "inset(0% round 0px)" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0 }}
      className="absolute inset-0"
    >
      {slides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            src={src}
            // Rotierende Slideshow aus fest hinterlegten und im Adminpanel
            // hochgeladenen Bildern (letztere ohne Beschreibungstext) - ein
            // generischer, aber inhaltlich zutreffender Alt-Text statt
            // reinem Markennamen, echte Bildunterschrift ist technisch
            // erst mit Caption-Feld im Adminpanel moeglich.
            alt="Partystimmung im moos.park Pöttmes"
            fill
            priority={i === startIndex}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" />

      {slides.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex gap-1.5 p-4">
          {slides.map((src, i) => (
            <div
              key={src}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
            >
              {i === index && (
                <div
                  key={index}
                  className="h-full rounded-full bg-accent-lime"
                  style={{ animation: `hero-progress ${SLIDE_DURATION}ms linear` }}
                />
              )}
              {((i - startIndex + slides.length) % slides.length) <
                ((index - startIndex + slides.length) % slides.length) && (
                <div className="h-full rounded-full bg-accent-lime" />
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
