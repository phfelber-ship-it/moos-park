"use client";

import GalleryLightbox, { type LightboxPhoto } from "@/components/GalleryLightbox";

export default function GalleryMasonry({
  photos,
}: {
  photos: LightboxPhoto[];
}) {
  const openAt = (i: number) => {
    window.dispatchEvent(new CustomEvent("open-lightbox", { detail: i }));
  };

  return (
    <>
      <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => openAt(i)}
            className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl bg-foreground/5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="w-full rounded-xl transition-transform duration-300 hover:scale-[1.02]"
            />
          </button>
        ))}

        <div className="mb-3 flex aspect-[4/3] w-full break-inside-avoid flex-col items-center justify-center rounded-xl bg-accent-lime p-6 text-center">
          <p className="font-black uppercase leading-tight text-black">
            Alle Bilder findest du in unserer kostenlosen App.
          </p>
        </div>
      </div>

      <GalleryLightbox photos={photos} />
    </>
  );
}
