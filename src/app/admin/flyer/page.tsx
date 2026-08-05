import { getFlyerBlobsOrdered } from "@/lib/flyer-images";
import FlyerImageManager from "@/components/FlyerImageManager";

export const dynamic = "force-dynamic";

export default async function FlyerAdminPage() {
  const images = await getFlyerBlobsOrdered();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Flyer verwalten
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Die ersten zwei Flyer (per Pfeiltasten sortierbar) werden automatisch
        in jede Bilder-Galerie eingemischt - egal wie alt die Galerie ist.
      </p>
      <FlyerImageManager initialImages={images} />
    </div>
  );
}
