import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GALLERIES } from "../page";
import { photosFor } from "@/lib/galleryPhotos";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = GALLERIES.findIndex((g) => g.slug === slug);
  const gallery = GALLERIES[index];

  if (!gallery) {
    notFound();
  }

  const photos = photosFor(index, 4);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/bilder" className="text-sm font-bold text-accent">
        ← Alle Bilder
      </Link>

      <h1 className="mt-4 text-3xl font-black uppercase text-foreground sm:text-4xl">
        {gallery.title}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">{gallery.date}</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {photos.map((src, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl bg-foreground/5 ${
              i === 0 ? "col-span-2 aspect-video" : "aspect-square"
            }`}
          >
            <Image
              src={src}
              alt={`${gallery.title} – Foto ${i + 1}`}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
