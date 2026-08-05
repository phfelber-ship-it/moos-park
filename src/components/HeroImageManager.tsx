"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import FlipText from "@/components/FlipText";

type HeroImage = { url: string; pathname: string };

export default function HeroImageManager({
  initialImages,
  fallbackImages,
}: {
  initialImages: HeroImage[];
  fallbackImages: string[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveOrder = async (next: HeroImage[]) => {
    setImages(next);
    setSavingOrder(true);
    try {
      const res = await fetch("/api/admin/hero-images/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: next.map((i) => i.pathname) }),
      });
      if (!res.ok) throw new Error("Reihenfolge konnte nicht gespeichert werden.");
    } catch {
      setError("Reihenfolge konnte nicht gespeichert werden.");
    } finally {
      setSavingOrder(false);
    }
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    saveOrder(next);
  };

  const migrate = async () => {
    setMigrating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero-images/migrate", {
        method: "POST",
      });
      if (!res.ok) throw new Error("Übernahme fehlgeschlagen.");
      const data = (await res.json()) as { uploaded: HeroImage[] };
      setImages(data.uploaded);
    } catch {
      setError("Standardbilder konnten nicht übernommen werden.");
    } finally {
      setMigrating(false);
    }
  };

  const upload = async (files: FileList) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const res = await fetch("/api/admin/hero-images", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Upload fehlgeschlagen.");
      }
      const data = (await res.json()) as { uploaded: HeroImage[] };
      setImages((prev) => [...prev, ...data.uploaded]);
    } catch {
      setError("Upload fehlgeschlagen. Bitte nochmal versuchen.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const remove = async (pathname: string) => {
    setDeletingPath(pathname);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      });
      if (!res.ok) {
        throw new Error("Löschen fehlgeschlagen.");
      }
      setImages((prev) => prev.filter((i) => i.pathname !== pathname));
    } catch {
      setError("Löschen fehlgeschlagen. Bitte nochmal versuchen.");
    } finally {
      setDeletingPath(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3">
        <label className="block w-fit cursor-pointer rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105">
          <FlipText text={uploading ? "Wird hochgeladen..." : "Neue Bilder hochladen"} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => e.target.files && upload(e.target.files)}
            className="hidden"
          />
        </label>

        {images.length === 0 && (
          <button
            type="button"
            onClick={migrate}
            disabled={migrating}
            className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground disabled:opacity-40"
          >
            {migrating
              ? "Wird übernommen..."
              : "Aktuelle Standardbilder übernehmen"}
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      {savingOrder && (
        <p className="mt-3 text-xs text-foreground/50">
          Reihenfolge wird gespeichert...
        </p>
      )}

      {images.length === 0 ? (
        <>
          <p className="mt-8 text-sm text-foreground/50">
            Noch keine Bilder im Verwaltungs-Speicher - aktuell laufen die
            urspruenglichen Standardbilder aus dem Repo (Vorschau unten,
            schreibgeschuetzt). Klicke oben auf &bdquo;Aktuelle Standardbilder
            übernehmen&ldquo;, um sie hier bearbeitbar zu machen.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {fallbackImages.map((src) => (
              <div
                key={src}
                className="relative aspect-video overflow-hidden rounded-xl border border-foreground/10"
              >
                <Image
                  src={src}
                  alt={src}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={img.pathname}
              className="group relative aspect-video overflow-hidden rounded-xl border border-foreground/10"
            >
              <Image
                src={img.url}
                alt={img.pathname}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 33vw, 50vw"
              />
              <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-white">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(img.pathname)}
                disabled={deletingPath === img.pathname}
                className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
              >
                {deletingPath === img.pathname ? "..." : "Löschen"}
              </button>
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-black disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === images.length - 1}
                  className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-black disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
