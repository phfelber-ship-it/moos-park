"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type ScanState =
  | { kind: "SCANNING" }
  | { kind: "LOADING" }
  | { kind: "OK"; name: string; company: string }
  | { kind: "DUPLICATE"; name: string; company: string; checkedInAt: string | null }
  | { kind: "ERROR"; message: string };

const RESULT_DISPLAY_MS = 2500;

// Mobile Kamera-Scanner fuers Einlasspersonal - liest QR-Codes live per
// jsQR (leichtgewichtig, reines JS, kein natives Paket) aus dem
// Kamerabild und schickt den erkannten Code an /api/scanner/[eventId]/
// checkin. Bewusst als eigenstaendige Client-Komponente: braucht direkten
// Zugriff auf <video>/<canvas> und den rAF-Scan-Loop.
export default function ScannerApp({ eventId }: { eventId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);
  const busyRef = useRef(false);

  const [state, setState] = useState<ScanState>({ kind: "SCANNING" });
  const [cameraError, setCameraError] = useState<string | null>(null);

  const resumeScanning = useCallback(() => {
    busyRef.current = false;
    setState({ kind: "SCANNING" });
  }, []);

  const handleCode = useCallback(
    async (code: string) => {
      // Denselben Code direkt hintereinander (z.B. Kamera erkennt ihn
      // mehrfach in Folgeframes, bevor der Nutzer das Handy wegzieht)
      // nicht mehrfach an die API schicken.
      const now = Date.now();
      if (
        lastCodeRef.current &&
        lastCodeRef.current.code === code &&
        now - lastCodeRef.current.at < RESULT_DISPLAY_MS
      ) {
        return;
      }
      lastCodeRef.current = { code, at: now };
      busyRef.current = true;
      setState({ kind: "LOADING" });

      try {
        const res = await fetch(`/api/scanner/${eventId}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (res.status === 401) {
          window.location.reload();
          return;
        }

        if (data.status === "OK") {
          setState({ kind: "OK", name: data.name, company: data.company });
        } else if (data.status === "ALREADY_CHECKED_IN") {
          setState({
            kind: "DUPLICATE",
            name: data.name,
            company: data.company,
            checkedInAt: data.checkedInAt,
          });
        } else {
          setState({
            kind: "ERROR",
            message: data.message ?? "Unbekannter Code.",
          });
        }
      } catch {
        setState({ kind: "ERROR", message: "Verbindungsfehler – bitte erneut versuchen." });
      }

      window.setTimeout(resumeScanning, RESULT_DISPLAY_MS);
    },
    [eventId, resumeScanning]
  );

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        tick();
      } catch {
        setCameraError(
          "Kamera-Zugriff nicht möglich – bitte Berechtigung erteilen und Seite neu laden."
        );
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (video.readyState === video.HAVE_ENOUGH_DATA && !busyRef.current) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const result = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (result?.data) {
            handleCode(result.data);
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [handleCode]);

  const logout = async () => {
    await fetch("/api/scanner/logout", { method: "POST" });
    window.location.reload();
  };

  // Grosse Vollbild-Erfolgs-/Fehlerzustaende - an der Tuer soll man das
  // Ergebnis auch aus einigen Metern Entfernung erkennen koennen.
  if (state.kind === "OK" || state.kind === "DUPLICATE" || state.kind === "ERROR") {
    const isOk = state.kind === "OK";
    const isDuplicate = state.kind === "DUPLICATE";
    return (
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 px-6 text-center ${
          isOk ? "bg-green-600" : "bg-red-600"
        }`}
      >
        <p className="text-6xl">{isOk ? "✓" : "✕"}</p>
        {isOk && (
          <>
            <p className="text-2xl font-black uppercase text-white">{state.name}</p>
            <p className="text-sm text-white/80">{state.company}</p>
            <p className="mt-2 text-sm font-bold uppercase text-white/90">
              Eingecheckt
            </p>
          </>
        )}
        {isDuplicate && (
          <>
            <p className="text-2xl font-black uppercase text-white">{state.name}</p>
            <p className="text-sm text-white/80">{state.company}</p>
            <p className="mt-2 text-sm font-bold uppercase text-white/90">
              Bereits gescannt
            </p>
            {state.checkedInAt && (
              <p className="text-xs text-white/70">
                Erster Check-in:{" "}
                {new Date(state.checkedInAt).toLocaleString("de-DE")}
              </p>
            )}
          </>
        )}
        {state.kind === "ERROR" && (
          <p className="text-lg font-bold text-white">{state.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <video
        ref={videoRef}
        playsInline
        muted
        className="h-full w-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-2xl border-4 border-accent-lime/80" />
      </div>

      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <p className="rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white">
          {eventId}
        </p>
        <button
          onClick={logout}
          className="rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white"
        >
          Abmelden
        </button>
      </div>

      {state.kind === "LOADING" && (
        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <p className="rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white">
            Prüfe…
          </p>
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-x-6 bottom-10 rounded-xl bg-red-600 p-4 text-center text-sm font-bold text-white">
          {cameraError}
        </div>
      )}

      {!cameraError && state.kind === "SCANNING" && (
        <div className="absolute inset-x-0 bottom-10 flex justify-center">
          <p className="rounded-full bg-black/60 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80">
            QR-Code ins Bild halten
          </p>
        </div>
      )}
    </div>
  );
}
