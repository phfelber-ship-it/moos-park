import { headers } from "next/headers";
import { getBannerAds, SUGGESTED_TARGET_PAGES } from "@/lib/banner-ads";
import { getBannerStats } from "@/lib/banner-stats";
import BannerAdsManager from "@/components/BannerAdsManager";

export const dynamic = "force-dynamic";

export default async function AnhaengerwerbungPage() {
  const [banners, stats, hdrs] = await Promise.all([
    getBannerAds(),
    getBannerStats(),
    headers(),
  ]);

  const host = hdrs.get("host") ?? "moos-park.de";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const siteOrigin = `${protocol}://${host}`;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Anhängerwerbung
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Bannerbilder für Werbe-Anhänger hochladen und mit einer Zielseite
        verknüpfen. Der erzeugte Link (bzw. ein daraus erstellter QR-Code)
        zählt jeden Scan – darunter siehst du, welcher Banner am häufigsten
        gescannt wurde, welche Zielseite die meisten Aufrufe hat und welcher
        Button dort jeweils am meisten geklickt wurde – Button-Klicks werden
        automatisch erfasst, jede eigene moos-park.de-Seite funktioniert
        sofort als Ziel, ganz ohne Code-Änderung.
      </p>

      <BannerAdsManager
        initialBanners={banners}
        stats={stats}
        suggestedTargetPages={SUGGESTED_TARGET_PAGES}
        siteOrigin={siteOrigin}
      />
    </div>
  );
}
