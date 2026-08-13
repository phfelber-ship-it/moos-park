import { Suspense } from "react";
import { getLastSeoAuditResult } from "@/lib/seo-audit";
import SeoAuditManager from "@/components/SeoAuditManager";

export const dynamic = "force-dynamic";

export default async function SeoToolPage() {
  const result = await getLastSeoAuditResult();

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        SEO-Tool
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Prüft die gesamte Website (alle Seitenvorlagen inkl. je einem
        Beispiel-Event, einer Beispiel-Galerie und allen Blogartikeln) auf
        Überschriften-Struktur, Text/Inhalt, wichtige Bausteine (Navigation,
        Footer, Bild-Alt-Texte) und technisches SEO (Title, Meta-Description,
        Canonical, strukturierte Daten, Mobilfreundlichkeit, Ladezeit,
        robots.txt/sitemap.xml).
      </p>

      <Suspense>
        <SeoAuditManager initialResult={result} autorun />
      </Suspense>
    </div>
  );
}
