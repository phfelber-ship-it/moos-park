import { getHeroBlobsOrdered, FALLBACK_HERO_IMAGES } from "@/lib/hero-images";
import HeroImageManager from "@/components/HeroImageManager";
import HeroVideoManager from "@/components/HeroVideoManager";
import { getHeroVideo } from "@/lib/hero-video";

export const dynamic = "force-dynamic";

export default async function HeroBilderPage() {
  const [images, video] = await Promise.all([
    getHeroBlobsOrdered(),
    getHeroVideo(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Hero-Bilder verwalten
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Diese Bilder laufen als Hintergrund-Slideshow auf der Startseite und
        der /links-Seite. Reihenfolge per Pfeiltasten anpassbar.
      </p>
      <HeroVideoManager initialVideoUrl={video?.url ?? null} />

      <HeroImageManager
        initialImages={images}
        fallbackImages={FALLBACK_HERO_IMAGES}
      />
    </div>
  );
}
