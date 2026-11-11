"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
// bewusst nicht aus lib/hero-video importiert (zieht serverseitigen Blob-Code ins Client-Bundle)
const HERO_VIDEO_PREFIX = "hero-video/";

const MAX_MB = 200;

export default function HeroVideoManager({
  initialVideoUrl,
}: {
  initialVideoUrl: string | null;
}) {
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`Das Video ist größer als ${MAX_MB} MB.`);
      return;
    }
    setProgress(0);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const blob = await upload(`${HERO_VIDEO_PREFIX}hero.${ext}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/hero-video/upload",
        multipart: file.size > 20 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      const res = await fetch("/api/admin/hero-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keepPathname: blob.pathname }),
      });
      if (!res.ok) throw new Error("Aufräumen fehlgeschlagen.");
      setVideoUrl(blob.url);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? `Upload fehlgeschlagen: ${e.message}`
          : "Upload fehlgeschlagen."
      );
    } finally {
      setProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const remove = async () => {
    if (!confirm("Hero-Video wirklich entfernen? Danach laufen wieder die Bilder.")) return;
    setRemoving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/hero-video", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVideoUrl(null);
    } catch {
      setError("Video konnte nicht entfernt werden.");
    } finally {
      setRemoving(false);
    }
  };

  const uploading = progress !== null;

  return (
    <section className="mt-8 rounded-2xl border border-foreground/10 p-6">
      <h2 className="text-lg font-black uppercase text-foreground">
        Hero-Video
      </h2>
      <p className="mt-2 text-sm text-foreground/60">
        Optional: Ein Video statt der Bilder im Header der Startseite. Quer- und
        Hochkant-Videos gehen, das Video füllt immer die volle Breite
        (bei Hochkant wird oben und unten etwas abgeschnitten). Es läuft ohne
        Ton in Dauerschleife. Empfehlung: MP4 (H.264), 10–30 Sekunden, möglichst
        unter 20 MB, damit es auch mobil schnell lädt.
      </p>

      {videoUrl && (
        <div className="mt-4">
          <video
            src={videoUrl}
            muted
            loop
            playsInline
            controls
            className="max-h-80 w-auto rounded-xl bg-black"
          />
          <p className="mt-2 text-xs text-foreground/50">
            Aktuell aktiv – ersetzt auf der Startseite die Bilder-Slideshow.
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black disabled:opacity-40"
        >
          {uploading
            ? `Lädt hoch… ${progress}%`
            : videoUrl
            ? "Video ersetzen"
            : "Video hochladen"}
        </button>
        {videoUrl && !uploading && (
          <button
            type="button"
            onClick={remove}
            disabled={removing}
            className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground disabled:opacity-40"
          >
            {removing ? "Entfernt…" : "Video entfernen"}
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </section>
  );
}
