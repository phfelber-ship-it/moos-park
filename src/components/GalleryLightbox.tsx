"use client";

import { useEffect, useRef, useState } from "react";

export type LightboxPhoto = { src: string; alt: string; ticketHref?: string };

export default function GalleryLightbox({
  photos,
}: {
  photos: LightboxPhoto[];
}) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") {
        setIndex((i) => (i === null ? null : (i + 1) % photos.length));
      }
      if (e.key === "ArrowLeft") {
        setIndex((i) =>
          i === null ? null : (i - 1 + photos.length) % photos.length
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, photos.length]);

  useEffect(() => {
    const handler = (e: Event) => {
      const i = (e as CustomEvent<number>).detail;
      setIndex(i);
    };
    window.addEventListener("open-lightbox", handler);
    return () => window.removeEventListener("open-lightbox", handler);
  }, []);

  // Rondell per Maus, Trackpad UND Touch drehen: Pointer Events decken
  // Maus/Touch/Stift einheitlich ab, zusaetzlich ein Wheel-Handler fuer
  // Trackpad-Horizontal-Wischgesten (deltaX) ohne Klick-Drag.
  const dragStartX = useRef(0);
  const dragging = useRef(false);
  const lastWheelAt = useRef(0);

  if (index === null) return null;

  const next = () => setIndex((i) => (i === null ? null : (i + 1) % photos.length));
  const prev = () =>
    setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragging.current = true;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragging.current = false;
    const dx = e.clientX - dragStartX.current;
    if (dx > 50) prev();
    if (dx < -50) next();
  };

  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 24) {
      return;
    }
    const now = performance.now();
    if (now - lastWheelAt.current < 400) return;
    lastWheelAt.current = now;
    if (e.deltaX > 0) next();
    else prev();
  };

  const current = photos[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={() => setIndex(null)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
    >
      <button
        onClick={() => setIndex(null)}
        aria-label="Schließen"
        className="fixed right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-transform hover:scale-105"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 5l14 14M19 5 5 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        aria-label="Vorheriges Bild"
        className="fixed left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-transform hover:scale-105 sm:left-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 6l-6 6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        aria-label="Nächstes Bild"
        className="fixed right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-transform hover:scale-105 sm:right-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/*
        Gestapelter Karten-Effekt (angelehnt an Swipers "Cards"-Effekt):
        aktuelles Bild vorne mittig, die Nachbarbilder schimmern leicht
        gedreht/verkleinert dahinter durch. Drehbar per Maus-/Trackpad-/
        Touch-Drag (siehe onPointerDown/onPointerUp/onWheel oben).
      */}
      <div
        className="relative flex h-[80vh] w-full max-w-2xl cursor-grab items-center justify-center active:cursor-grabbing"
        style={{ perspective: "1200px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {[-2, -1, 0, 1, 2].map((offset) => {
          const i =
            (index + offset + photos.length * 2) % photos.length;
          const p = photos[i];
          const abs = Math.abs(offset);
          return (
            <div
              key={`${i}-${offset}`}
              className="absolute overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: `translateX(${offset * 36}px) rotateZ(${offset * 6}deg) scale(${1 - abs * 0.08})`,
                zIndex: 10 - abs,
                opacity: abs > 1 ? 0 : 1,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt={p.alt}
                className="max-h-[80vh] max-w-[80vw] object-contain"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {current?.ticketHref && (
        <a
          href={current.ticketHref}
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-x-6 bottom-8 z-10 mx-auto flex w-fit items-center gap-2 rounded-full bg-accent-lime px-6 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Jetzt Tickets sichern →
        </a>
      )}
    </div>
  );
}
