import { list } from "@vercel/blob";
import { FAVICON_PREFIX } from "@/lib/favicon";
import FaviconManager from "@/components/FaviconManager";

export const dynamic = "force-dynamic";

export default async function FaviconAdminPage() {
  const { blobs } = await list({ prefix: FAVICON_PREFIX });
  const current = blobs[0]?.url ?? null;

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Favicon verwalten
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Das kleine Icon im Browser-Tab. Am besten quadratisch, PNG oder ICO.
      </p>
      <FaviconManager currentUrl={current} />
    </div>
  );
}
