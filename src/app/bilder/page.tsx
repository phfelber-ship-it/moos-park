import Image from "next/image";
import Link from "next/link";
import { getGalleries } from "@/lib/clubscale";

export const metadata = { title: "Bilder - moos.park | Eventlocation" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BilderPage() {
  const galleries = await getGalleries();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black uppercase text-foreground">Bilder</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery) => {
          const cover = gallery.coverMediaObjects[0]?.thumbnail?.presignedURL;
          return (
            <Link
              key={gallery.id}
              href={`/bilder/${gallery.id}`}
              className="group overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.025] transition-colors hover:border-accent-lime/40"
            >
              <div className="relative aspect-[4/3] w-full bg-foreground/5">
                {cover && (
                  <Image
                    src={cover}
                    alt={gallery.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="text-sm font-bold text-accent">
                  {formatDate(gallery.date)}
                </p>
                <h3 className="mt-1 font-black uppercase text-foreground">
                  {gallery.name}
                </h3>
                <p className="mt-1 text-xs text-foreground/50">
                  {gallery.mediaCount} Fotos
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
