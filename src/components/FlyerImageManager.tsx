"use client";

import { useRef, useState } from "react";
import Image from "next/image";

type FlyerImage = { url: string; pathname: string; link?: string };

export default function FlyerImageManager({
  initialImages,
}: {
  initialImages: FlyerImage[];
}) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [savingLink, setSavingLink] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveOrder = async (next: FlyerImage[]) => {
    setImages(next);
    setSavingOrder(true);
    try {
      const res = await fetch("/api/admin/flyer-images/order", {
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

  const upload = async (files: FileList) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const res = await fetch("/api/admin/flyer-images", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload fehlgeschlagen.");
      const data = (await res.json()) as { uploaded: FlyerImage[] };
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
      const res = await fetch("/api/admin/flyer-images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen.");
      setImages((prev) => prev.filter((i) => i.pathname !== pathname));
    } catch {
      setError("Löschen fehlgeschlagen. Bitte nochmal versuchen.");
    } finally {
      setDeletingPath(null);
    }
  };

  const setLinkValue = (pathname: string, link: string) => {
    setImages((prev) =>
      prev.map((i) => (i.pathname === pathname ? { ...i, link } : i))
    );
  };

  const saveLink = async (pathname: string, link: string) => {
    setSavingLink(pathname);
    setError(null);
    try {
      const res = await fetch("/api/admin/flyer-images/link", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname, link }),
      });
      if (!res.ok) throw new Error("Link konnte nicht gespeichert werden.");
    } catch {
      setError("Link konnte nicht gespeichert werden.");
    } finally {
      setSavingLink(null);
    }
  };

  return (
    <div className="mt-6">
      <label className="block w-fit cursor-pointer rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105">
        {uploading ? "Wird hochgeladen..." : "Neuen Flyer hochladen"}
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
      {savingOrder && (
        <p className="mt-3 text-xs text-foreground/50">
          Reihenfolge wird gespeichert...
        </p>
      )}

      {images.length === 0 ? (
        <p className="mt-8 text-sm text-foreground/50">
          Noch keine Flyer hochgeladen - solange hier keine liegen, wird auch
          in den Galerien nichts eingeblendet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((img, i) => (
            <div
              key={img.pathname}
              className="group relative overflow-hidden rounded-xl border border-foreground/10"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={img.url}
                  alt={img.pathname}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
                <span
                  className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-bold ${
                    i < 2
                      ? "bg-accent-lime text-black"
                      : "bg-black/70 text-white"
                  }`}
                >
                  {i < 2 ? "Aktiv in Galerien" : `#${i + 1}`}
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
              <div className="p-2">
                <input
                  value={img.link ?? ""}
                  onChange={(e) => setLinkValue(img.pathname, e.target.value)}
                  onBlur={(e) => saveLink(img.pathname, e.target.value)}
                  placeholder="Ticket-/Event-Link (z.B. /tickets)"
                  className="w-full rounded-lg border border-foreground/15 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-accent-lime"
                />
                {savingLink === img.pathname && (
                  <p className="mt-1 text-[11px] text-foreground/40">
                    Speichert...
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
