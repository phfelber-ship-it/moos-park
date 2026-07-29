"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type HeroImage = { url: string; pathname: string };

export default function HeroImageManager({
  initialImages,
}: {
  initialImages: HeroImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImages((prev) =>
        [...prev, ...data.uploaded].sort((a, b) =>
          a.pathname.localeCompare(b.pathname)
        )
      );
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
      <label className="block w-fit cursor-pointer rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105">
        {uploading ? "Wird hochgeladen..." : "Neue Bilder hochladen"}
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

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      {images.length === 0 ? (
        <p className="mt-8 text-sm text-foreground/50">
          Noch keine Bilder hochgeladen - es wird der bisherige Standard aus
          dem Repo angezeigt.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img) => (
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
              <button
                type="button"
                onClick={() => remove(img.pathname)}
                disabled={deletingPath === img.pathname}
                className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-xs font-bold uppercase text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
              >
                {deletingPath === img.pathname ? "..." : "Löschen"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
