"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import FlipText from "@/components/FlipText";
import type { BannerAd } from "@/lib/banner-ads";
import type { BannerStats } from "@/lib/banner-stats";

export default function BannerAdsManager({
  initialBanners,
  stats,
  suggestedTargetPages,
  siteOrigin,
}: {
  initialBanners: BannerAd[];
  stats: BannerStats;
  suggestedTargetPages: string[];
  siteOrigin: string;
}) {
  const [banners, setBanners] = useState(initialBanners);
  const [name, setName] = useState("");
  const [targetPath, setTargetPath] = useState(suggestedTargetPages[0] ?? "/");
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    if (!name.trim()) {
      setError("Bitte einen Namen fuer den Banner vergeben.");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("targetPath", targetPath);
      formData.append("file", file);
      const res = await fetch("/api/admin/banner-ads", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Upload fehlgeschlagen.");
      }
      const data = (await res.json()) as { banner: BannerAd };
      setBanners((prev) => [...prev, data.banner]);
      setName("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload fehlgeschlagen.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const remove = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/banner-ads", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Loeschen fehlgeschlagen.");
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError("Loeschen fehlgeschlagen. Bitte nochmal versuchen.");
    } finally {
      setDeletingId(null);
    }
  };

  const copyLink = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`${siteOrigin}/r/${code}`);
    } catch {
      // Clipboard evtl. ohne Rechte - egal, Link steht ja sichtbar da.
    }
  };

  const bannersSortedByViews = [...banners].sort(
    (a, b) =>
      (stats.banners[b.code]?.views ?? 0) - (stats.banners[a.code]?.views ?? 0)
  );

  // Zielseiten ergeben sich aus den tatsaechlich angelegten Bannern - keine
  // fixe Liste noetig, jede neue Zielseite taucht automatisch auf.
  const usedPages = Array.from(new Set(banners.map((b) => b.targetPath)));

  const pageViews = usedPages
    .map((path) => ({
      path,
      views: banners
        .filter((b) => b.targetPath === path)
        .reduce((sum, b) => sum + (stats.banners[b.code]?.views ?? 0), 0),
    }))
    .sort((a, b) => b.views - a.views);

  return (
    <div className="mt-6">
      {/* Neuer Banner */}
      <div className="rounded-2xl border border-foreground/10 p-6">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
          Neuen Banner anlegen
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name, z.B. Bierbank-Anhaenger Sommer"
            className="rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40"
          />
          <input
            type="text"
            value={targetPath}
            onChange={(e) => setTargetPath(e.target.value)}
            placeholder="/qrcodewerbung"
            list="target-page-suggestions"
            className="rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40"
          />
          <datalist id="target-page-suggestions">
            {suggestedTargetPages.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        </div>
        <p className="mt-2 text-xs text-foreground/50">
          Pfad einer eigenen moos-park.de-Seite, z.B. /qrcodewerbung – auch
          eine ganz neue Seite geht, Buttons dort werden automatisch
          mitgezählt.
        </p>
        <label className="mt-4 block w-fit cursor-pointer rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105">
          <FlipText text={uploading ? "Wird hochgeladen..." : "Bannerbild hochladen"} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            className="hidden"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {/* Liste + Links */}
      <div className="mt-8">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
          Banner ({banners.length})
        </h2>
        {banners.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/50">
            Noch keine Banner angelegt.
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {banners.map((b) => {
              const link = `${siteOrigin}/r/${b.code}`;
              const views = stats.banners[b.code]?.views ?? 0;
              return (
                <div
                  key={b.id}
                  className="flex gap-4 rounded-xl border border-foreground/10 p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-foreground/10">
                    <Image
                      src={b.imageUrl}
                      alt={b.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">
                      {b.name}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/50">
                      → {b.targetPath} · {views}{" "}
                      {views === 1 ? "Aufruf" : "Aufrufe"}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="min-w-0 flex-1 truncate rounded bg-foreground/[0.04] px-2 py-1 text-xs text-foreground/70">
                        {link}
                      </code>
                      <button
                        type="button"
                        onClick={() => copyLink(b.code)}
                        className="shrink-0 rounded bg-foreground/[0.06] px-2 py-1 text-xs font-bold uppercase text-foreground/70 hover:bg-foreground/10"
                      >
                        Kopieren
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(b.id)}
                      disabled={deletingId === b.id}
                      className="mt-2 text-xs font-bold uppercase text-red-500 hover:underline disabled:opacity-40"
                    >
                      {deletingId === b.id ? "..." : "Löschen"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Statistik */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-foreground/10 p-6">
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
            Meistgescannte Banner
          </h2>
          {bannersSortedByViews.length === 0 ? (
            <p className="mt-3 text-sm text-foreground/50">Noch keine Daten.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <tbody>
                {bannersSortedByViews.map((b) => (
                  <tr key={b.id} className="border-b border-foreground/5">
                    <td className="py-2 pr-4 text-foreground/80">{b.name}</td>
                    <td className="py-2 text-right font-bold text-foreground">
                      {stats.banners[b.code]?.views ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-2xl border border-foreground/10 p-6">
          <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
            Aufrufe je Zielseite
          </h2>
          {pageViews.length === 0 ? (
            <p className="mt-3 text-sm text-foreground/50">Noch keine Daten.</p>
          ) : (
            <table className="mt-3 w-full text-sm">
              <tbody>
                {pageViews.map(({ path, views }) => (
                  <tr key={path} className="border-b border-foreground/5">
                    <td className="py-2 pr-4 text-foreground/80">{path}</td>
                    <td className="py-2 text-right font-bold text-foreground">
                      {views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-foreground/10 p-6">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
          Button-Klicks je Zielseite
        </h2>
        <p className="mt-1 text-xs text-foreground/50">
          Wird automatisch erfasst – jeder Link/Button-Klick auf den unten
          angelegten Zielseiten zählt mit, ohne dass jemand einzelne Buttons
          pflegen muss.
        </p>
        {usedPages.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/50">
            Noch keine Zielseite über einen Banner angelegt.
          </p>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {usedPages.map((path) => {
              const buttons = Object.entries(stats.buttons[path] ?? {}).sort(
                (a, b) => b[1].clicks - a[1].clicks
              );
              return (
                <div key={path}>
                  <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
                    {path}
                  </p>
                  {buttons.length === 0 ? (
                    <p className="mt-2 text-sm text-foreground/50">
                      Noch keine Klicks.
                    </p>
                  ) : (
                    <table className="mt-2 w-full text-sm">
                      <tbody>
                        {buttons.map(([button, data]) => (
                          <tr key={button} className="border-b border-foreground/5">
                            <td className="py-2 pr-4 text-foreground/80">
                              {button}
                            </td>
                            <td className="py-2 text-right font-bold text-foreground">
                              {data.clicks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
