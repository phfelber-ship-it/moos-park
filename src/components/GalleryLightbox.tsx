"use client";

import { useEffect, useState } from "react";

export type LightboxPhoto = { src: string; alt: string };

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

  if (index === null) return null;

  let touchStartX = 0;

  const next = () => setIndex((i) => (i === null ? null : (i + 1) % photos.length));
  const prev = () =>
    setIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={() => setIndex(null)}
      onTouchStart={(e) => {
        touchStartX = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (dx > 50) prev();
        if (dx < -50) next();
      }}
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
        gedreht/verkleinert dahinter durch.
      */}
      <div
        className="relative flex h-[80vh] w-full max-w-2xl items-center justify-center"
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
    </div>
  );
}
