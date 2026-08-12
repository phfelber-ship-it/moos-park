"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Gallery } from "@/lib/clubscale";

const SPRING = { type: "spring", stiffness: 300, damping: 24 } as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}

export default function GalleryCard({ gallery }: { gallery: Gallery }) {
  const previewPhotos = gallery.coverMediaObjects.slice(0, 6);

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
      transition={SPRING}
      className="flex flex-col items-center rounded-2xl border border-foreground/10 p-4 text-center transition-colors hover:border-foreground/25"
    >
      <Link
        href={`/galerie/${gallery.id}`}
        className="group grid aspect-square w-full grid-cols-3 grid-rows-3 grid-flow-row-dense gap-1 overflow-hidden rounded-xl"
      >
        {previewPhotos.map((photo, i) => (
          <div
            key={photo.id}
            className={`relative overflow-hidden bg-foreground/5 ${
              i === 0 ? "col-span-2 row-span-2" : ""
            }`}
          >
            {photo.thumbnail?.presignedURL && (
              <Image
                src={photo.thumbnail.presignedURL}
                alt={`${gallery.name} ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 12vw, (min-width: 640px) 25vw, 40vw"
              />
            )}
          </div>
        ))}
      </Link>

      <Link href={`/galerie/${gallery.id}`}>
        <h3 className="mt-3 text-lg font-black uppercase leading-tight text-foreground line-clamp-2">
          {gallery.name}
        </h3>
      </Link>

      <p className="mt-2 text-sm text-foreground/60">
        {formatDate(gallery.date)} · {gallery.mediaCount} Fotos
      </p>
    </motion.div>
  );
}
