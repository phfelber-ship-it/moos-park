import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGallery, getGalleryMedia } from "@/lib/clubscale";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = await getGallery(id);

  if (!gallery) {
    notFound();
  }

  const media = await getGalleryMedia(id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link href="/bilder" className="text-sm font-bold text-accent">
        ← Alle Bilder
      </Link>

      <h1 className="mt-4 text-3xl font-black uppercase text-foreground sm:text-4xl">
        {gallery.name}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        {formatDate(gallery.date)} · {gallery.mediaCount} Fotos
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {media.map((item, i) => {
          const src = item.thumbnail?.presignedURL;
          if (!src) return null;
          return (
            <div
              key={item.id}
              className={`relative overflow-hidden rounded-xl bg-foreground/5 ${
                i === 0 ? "col-span-2 aspect-video" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt={`${gallery.name} – ${item.title}`}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 33vw, 50vw"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
