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
  });
}

export default function GalleryCard({ gallery }: { gallery: Gallery }) {
  const cover = gallery.coverMediaObjects[0]?.thumbnail?.presignedURL;

  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}
      transition={SPRING}
      className="flex flex-col items-center rounded-2xl border border-foreground/10 p-4 text-center transition-colors hover:border-foreground/25"
    >
      <Link
        href={`/bilder/${gallery.id}`}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-foreground/5"
      >
        {cover && (
          <Image
            src={cover}
            alt={gallery.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        )}
      </Link>

      <Link href={`/bilder/${gallery.id}`}>
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
