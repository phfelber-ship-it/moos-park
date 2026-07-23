import Link from "next/link";
import { notFound } from "next/navigation";
import { getGallery, getGalleryMedia } from "@/lib/clubscale";
import GalleryMasonry from "@/components/GalleryMasonry";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gallery = await getGallery(id);

  if (!gallery) {
    return { title: "Galerie nicht gefunden - moos.park" };
  }

  const cover = gallery.coverMediaObjects[0]?.thumbnail?.presignedURL;

  return {
    title: `${gallery.name} - Bilder - moos.park`,
    description: `Fotos von ${gallery.name} im moos.park Pöttmes am ${formatDate(
      gallery.date
    )}.`,
    openGraph: cover ? { images: [{ url: cover }] } : undefined,
  };
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
  const photos = media
    .map((item) => ({
      src: item.fullImage?.presignedURL ?? item.thumbnail?.presignedURL,
      alt: `${gallery.name} – ${item.title}`,
    }))
    .filter((p): p is { src: string; alt: string } => Boolean(p.src))
    .slice(0, 20);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-16 pt-32">
      <Link href="/bilder" className="text-sm font-bold text-accent-lime">
        ← Alle Bilder
      </Link>

      <h1 className="mt-4 text-3xl font-black uppercase text-foreground sm:text-4xl">
        {gallery.name}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        {formatDate(gallery.date)} · {gallery.mediaCount} Fotos
      </p>

      <GalleryMasonry photos={photos} />
    </div>
  );
}
