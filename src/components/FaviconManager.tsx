"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function FaviconManager({
  currentUrl,
}: {
  currentUrl: string | null;
}) {
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/favicon", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload fehlgeschlagen.");
      const data = (await res.json()) as { uploaded: { url: string } };
      setPreview(data.uploaded.url);
    } catch {
      setError("Upload fehlgeschlagen. Bitte nochmal versuchen.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mt-6">
      <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
        Aktuell
      </p>
      <div className="mt-2 flex h-20 w-20 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/5 p-3">
        {preview ? (
          <Image
            src={preview}
            alt="Aktuelles Favicon"
            width={64}
            height={64}
            className="h-full w-full object-contain"
            unoptimized
          />
        ) : (
          <span className="text-xs text-foreground/40">Standard</span>
        )}
      </div>

      <label className="mt-6 block w-fit cursor-pointer rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105">
        {uploading ? "Wird hochgeladen..." : "Neues Favicon hochladen"}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/x-icon,image/svg+xml,image/jpeg"
          disabled={uploading}
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          className="hidden"
        />
      </label>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <p className="mt-3 text-xs text-foreground/50">
        Browser cachen Favicons teils hartnaeckig - falls es im Tab nicht
        sofort neu aussieht, hilft ein Hard-Refresh (Cmd/Strg+Shift+R).
      </p>
    </div>
  );
}
