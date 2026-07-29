import { list } from "@vercel/blob";
import HeroImageManager from "@/components/HeroImageManager";

export const dynamic = "force-dynamic";

const HERO_PREFIX = "hero/";

export default async function HeroBilderPage() {
  const { blobs } = await list({ prefix: HERO_PREFIX });
  const images = [...blobs]
    .sort((a, b) => a.pathname.localeCompare(b.pathname))
    .map((b) => ({ url: b.url, pathname: b.pathname }));

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Hero-Bilder verwalten
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Diese Bilder laufen als Hintergrund-Slideshow auf der Startseite und
        der /links-Seite. Reihenfolge richtet sich nach dem Dateinamen.
      </p>
      <HeroImageManager initialImages={images} />
    </div>
  );
}
