"use client";

import GalleryLightbox, { type LightboxPhoto } from "@/components/GalleryLightbox";
import AppDownloadCta from "@/components/AppDownloadCta";

export type FlyerCard = { src: string; alt: string; href: string };

type Slide = LightboxPhoto & { isFlyer?: boolean };

// Verteilt die Flyer gleichmaessig ueber die Fotostrecke (nie am Anfang
// oder Ende, nie alle hintereinander) statt sie an einer einzigen Stelle
// zu buendeln.
function buildSlides(photos: LightboxPhoto[], flyers: FlyerCard[]): Slide[] {
  if (flyers.length === 0) return photos;
  if (photos.length === 0) {
    return flyers.map((f) => ({ src: f.src, alt: f.alt, ticketHref: f.href, isFlyer: true }));
  }

  const n = flyers.length;
  const insertAfter = flyers.map((_, i) => {
    const fraction = (i + 1) / (n + 1);
    const idx = Math.round(fraction * photos.length) - 1;
    return Math.max(0, Math.min(photos.length - 2, idx));
  });

  const slides: Slide[] = [];
  photos.forEach((photo, i) => {
    slides.push(photo);
    insertAfter.forEach((afterIdx, fi) => {
      if (afterIdx === i) {
        const f = flyers[fi];
        slides.push({ src: f.src, alt: f.alt, ticketHref: f.href, isFlyer: true });
      }
    });
  });
  return slides;
}

export default function GalleryMasonry({
  photos,
  flyers = [],
}: {
  photos: LightboxPhoto[];
  flyers?: FlyerCard[];
}) {
  const slides = buildSlides(photos, flyers);

  const openAt = (i: number) => {
    window.dispatchEvent(new CustomEvent("open-lightbox", { detail: i }));
  };

  return (
    <>
      <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
        {slides.map((slide, i) =>
          slide.isFlyer ? (
            <button
              key={`flyer-${i}-${slide.src}`}
              onClick={() => openAt(i)}
              className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-foreground/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                className="w-full rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 py-2.5 text-xs font-black uppercase tracking-wide text-white">
                Jetzt Tickets sichern →
              </span>
            </button>
          ) : (
            <button
              key={slide.src}
              onClick={() => openAt(i)}
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-foreground/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src}
                alt={slide.alt}
                loading="lazy"
                className="w-full rounded-xl transition-transform duration-300 hover:scale-[1.02]"
              />
            </button>
          )
        )}

        <div className="mb-3 w-full break-inside-avoid">
          <AppDownloadCta />
        </div>
      </div>

      <GalleryLightbox photos={slides} />
    </>
  );
}
