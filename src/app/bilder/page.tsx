import { getGalleries } from "@/lib/clubscale";
import GalleryCard from "@/components/GalleryCard";

export const metadata = { title: "Bilder - moos.park | Eventlocation" };

export default async function BilderPage() {
  const galleries = await getGalleries();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <h1 className="text-4xl font-black uppercase text-foreground">Bilder</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery) => (
          <GalleryCard key={gallery.id} gallery={gallery} />
        ))}
      </div>
    </div>
  );
}
