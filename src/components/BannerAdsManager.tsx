"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import FlipText from "@/components/FlipText";
import type { BannerAd } from "@/lib/banner-ads";
import type { BannerStats } from "@/lib/banner-stats";

// Erste Seite eines hochgeladenen PDFs auf ein Canvas rendern - Banner
// werden oft als PDF angeliefert, gespeichert/angezeigt wird trotzdem ein
// normales Bild (PNG der ersten Seite).
async function pdfFirstPageToCanvas(file: File): Promise<HTMLCanvasElement> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas nicht verfuegbar.");
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return canvas;
}

function canvasToPngFile(canvas: HTMLCanvasElement, name: string): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Bild konnte nicht erzeugt werden."));
        return;
      }
      resolve(new File([blob], `${name}.png`, { type: "image/png" }));
    }, "image/png");
  });
}

function imageFileToCanvas(file: File): Promise<HTMLCanvasElement> {
  return createImageBitmap(file).then((bitmap) => {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas nicht verfuegbar.");
    ctx.drawImage(bitmap, 0, 0);
    return canvas;
  });
}

// Liest, falls vorhanden, den QR-Code aus einem Canvas aus und liefert den
// enthaltenen Link zurueck - so muss der Link nicht per Hand abgetippt
// werden, wenn er schon im Bild/PDF steckt.
async function decodeQrFromCanvas(canvas: HTMLCanvasElement): Promise<string | null> {
  const jsQR = (await import("jsqr")).default;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, imageData.width, imageData.height);
  return result?.data ?? null;
}

// Aus einem gescannten QR-Inhalt (voller Link oder nur Pfad) den relativen
// Pfad extrahieren - nur wenn es die eigene Domain ist, sonst null
// (Zielseite muss eine eigene moos-park.de-Seite sein).
function pathFromScannedLink(raw: string): string | null {
  const value = raw.trim();
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    if (!/(^|\.)moos-park\.de$/i.test(url.hostname) && url.hostname !== "localhost") {
      return null;
    }
    return `${url.pathname}${url.search}` || "/";
  } catch {
    return null;
  }
}

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
  const [targetPath, setTargetPath] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanHint, setScanHint] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pickFile = async (picked: File) => {
    setScanHint(null);
    setError(null);
    setScanning(true);

    // PDF-Uploads (haeufig bei Banner-Druckdaten) auf ein Bild der ersten
    // Seite reduzieren - Speicherung/Anzeige/QR-Scan laufen danach wie bei
    // jedem anderen Bild.
    const isPdf =
      picked.type === "application/pdf" || picked.name.toLowerCase().endsWith(".pdf");

    let canvas: HTMLCanvasElement;
    try {
      canvas = isPdf ? await pdfFirstPageToCanvas(picked) : await imageFileToCanvas(picked);
      const effectiveFile = isPdf
        ? await canvasToPngFile(canvas, picked.name.replace(/\.pdf$/i, "") || "banner")
        : picked;
      setFile(effectiveFile);
      setPreviewUrl(URL.createObjectURL(effectiveFile));
    } catch {
      setError(isPdf ? "PDF konnte nicht gelesen werden." : "Bild konnte nicht gelesen werden.");
      setScanning(false);
      return;
    }

    try {
      const raw = await decodeQrFromCanvas(canvas);
      if (!raw) {
        setScanHint("Kein QR-Code im Bild erkannt - Link bitte manuell eintragen.");
        return;
      }
      const path = pathFromScannedLink(raw);
      if (!path) {
        setScanHint(
          `QR-Code gefunden, zeigt aber nicht auf moos-park.de (${raw}) - Link bitte manuell eintragen.`
        );
        return;
      }
      setTargetPath(path);
      setScanHint(`QR-Code erkannt: Link automatisch übernommen (${path}).`);
    } catch {
      setScanHint("QR-Code konnte nicht gelesen werden - Link bitte manuell eintragen.");
    } finally {
      setScanning(false);
    }
  };

  const save = async () => {
    if (!name.trim()) {
      setError("Bitte einen Titel für den Banner vergeben.");
      return;
    }
    if (!file) {
      setError("Bitte ein Bannerbild hochladen.");
      return;
    }
    if (!targetPath.trim()) {
      setError("Bitte den Link zur Seite angeben.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("targetPath", targetPath.trim());
      formData.append("file", file);
      const res = await fetch("/api/admin/banner-ads", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? "Speichern fehlgeschlagen.");
      }
      const data = (await res.json()) as { banner: BannerAd };
      setBanners((prev) => [...prev, data.banner]);
      setName("");
      setTargetPath("");
      setFile(null);
      setPreviewUrl(null);
      setScanHint(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setSaving(false);
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

  // Wie viele Banner zeigen auf dieselbe Zielseite? Nur wenn genau einer,
  // koennen wir direkte Seitenaufrufe (QR-Code zeigt nicht auf /r/[code],
  // z.B. weil der Druck nicht mehr aenderbar ist) diesem Banner eindeutig
  // zurechnen.
  const bannersPerPage = new Map<string, number>();
  for (const b of banners) {
    bannersPerPage.set(b.targetPath, (bannersPerPage.get(b.targetPath) ?? 0) + 1);
  }

  const bannerViewBreakdown = (b: BannerAd) => {
    const qrScans = stats.banners[b.code]?.views ?? 0;
    const attributable = bannersPerPage.get(b.targetPath) === 1;
    const directViews = attributable ? stats.pageViews[b.targetPath]?.views ?? 0 : 0;
    return { qrScans, directViews, total: qrScans + directViews, attributable };
  };

  const bannersSortedByViews = [...banners].sort(
    (a, b) => bannerViewBreakdown(b).total - bannerViewBreakdown(a).total
  );

  // Zielseiten ergeben sich aus den tatsaechlich angelegten Bannern - keine
  // fixe Liste noetig, jede neue Zielseite taucht automatisch auf.
  const usedPages = Array.from(new Set(banners.map((b) => b.targetPath)));

  return (
    <div className="mt-6">
      {/* Neuer Banner */}
      <div className="rounded-2xl border border-foreground/10 p-6">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
          Neuen Banner anlegen
        </h2>

        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-foreground/40">
          1. Titel
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Titel, z.B. Bierbank-Anhaenger Sommer"
          className="mt-1.5 w-full max-w-sm rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40"
        />

        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-foreground/40">
          2. Bannerbild
        </p>
        <div className="mt-1.5 flex items-center gap-4">
          {previewUrl && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-foreground/10">
              <Image src={previewUrl} alt="" fill className="object-cover" sizes="64px" unoptimized />
            </div>
          )}
          <label className="block w-fit cursor-pointer rounded-lg border border-foreground/20 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground">
            <FlipText text={file ? "Anderes Bild/PDF wählen" : "Bild oder PDF auswählen"} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files?.[0] && pickFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
        {scanning && (
          <p className="mt-2 text-xs text-foreground/50">QR-Code wird gelesen...</p>
        )}
        {scanHint && !scanning && (
          <p className="mt-2 text-xs text-foreground/60">{scanHint}</p>
        )}

        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-foreground/40">
          3. Link zur Seite
        </p>
        <input
          type="text"
          value={targetPath}
          onChange={(e) => setTargetPath(e.target.value)}
          placeholder="/qrcodewerbung"
          list="target-page-suggestions"
          className="mt-1.5 w-full max-w-sm rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40"
        />
        <datalist id="target-page-suggestions">
          {suggestedTargetPages.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
        <p className="mt-1.5 text-xs text-foreground/50">
          Wird automatisch aus dem QR-Code im Bild übernommen, wenn erkannt –
          sonst hier eintragen. Muss eine eigene moos-park.de-Seite sein.
        </p>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="mt-5 rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
        >
          <FlipText text={saving ? "Wird gespeichert..." : "Banner anlegen"} />
        </button>
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
              const { qrScans, directViews, total, attributable } =
                bannerViewBreakdown(b);
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
                      → {b.targetPath} · {total} {total === 1 ? "Aufruf" : "Aufrufe"}
                      {directViews > 0 && (
                        <> ({qrScans} über QR-Link, {directViews} direkt)</>
                      )}
                    </p>
                    {!attributable && (bannersPerPage.get(b.targetPath) ?? 0) > 1 && (
                      <p className="mt-0.5 text-xs text-amber-500">
                        Zielseite wird von mehreren Bannern genutzt – direkte
                        Seitenaufrufe (ohne /r/-Link) können hier nicht
                        eindeutig zugeordnet werden.
                      </p>
                    )}
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
      <div className="mt-12 rounded-2xl border border-foreground/10 p-6">
        <h2 className="text-sm font-black uppercase tracking-wide text-foreground">
          Meistgescannte Banner
        </h2>
        {bannersSortedByViews.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/50">Noch keine Daten.</p>
        ) : (
          <div className="mt-3 flex flex-col">
            {bannersSortedByViews.map((b) => {
              const { total } = bannerViewBreakdown(b);
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-4 border-b border-foreground/5 py-2.5"
                >
                  <span className="text-sm text-foreground/80">{b.name}</span>
                  <span className="text-sm font-bold text-foreground">{total}</span>
                </div>
              );
            })}
          </div>
        )}
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
