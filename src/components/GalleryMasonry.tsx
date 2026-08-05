"use client";

import GalleryLightbox, { type LightboxPhoto } from "@/components/GalleryLightbox";
import AppDownloadCta from "@/components/AppDownloadCta";

export type FlyerCard = { src: string; alt: string; href: string };

export default function GalleryMasonry({
  photos,
  flyers = [],
}: {
  photos: LightboxPhoto[];
  flyers?: FlyerCard[];
}) {
  const openAt = (i: number) => {
    window.dispatchEvent(new CustomEvent("open-lightbox", { detail: i }));
  };

  // Flyer werden mittig eingestreut (nie am Anfang oder Ende) - als eigene
  // verlinkte Karten, nicht als Teil der Lightbox-Fotos.
  const insertAt =
    photos.length === 0
      ? 0
      : Math.max(1, Math.min(photos.length - 1, Math.floor(photos.length / 2)));

  const items: Array<
    { kind: "photo"; photo: LightboxPhoto; index: number } | { kind: "flyer"; flyer: FlyerCard }
  > = [];
  photos.forEach((photo, i) => {
    if (i === insertAt) {
      flyers.forEach((flyer) => items.push({ kind: "flyer", flyer }));
    }
    items.push({ kind: "photo", photo, index: i });
  });
  if (photos.length === 0) {
    flyers.forEach((flyer) => items.push({ kind: "flyer", flyer }));
  }

  return (
    <>
      <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
        {items.map((item, i) =>
          item.kind === "photo" ? (
            <button
              key={item.photo.src}
              onClick={() => openAt(item.index)}
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-foreground/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.photo.src}
                alt={item.photo.alt}
                loading="lazy"
                className="w-full rounded-xl transition-transform duration-300 hover:scale-[1.02]"
              />
            </button>
          ) : (
            <a
              key={`flyer-${i}-${item.flyer.src}`}
              href={item.flyer.href}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-foreground/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.flyer.src}
                alt={item.flyer.alt}
                loading="lazy"
                className="w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 py-2.5 text-xs font-black uppercase tracking-wide text-white">
                Jetzt Tickets sichern →
              </span>
            </a>
          )
        )}

        <div className="mb-3 w-full break-inside-avoid">
          <AppDownloadCta />
        </div>
      </div>

      <GalleryLightbox photos={photos} />
    </>
  );
}
