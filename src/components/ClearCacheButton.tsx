"use client";

import { useState } from "react";

export default function ClearCacheButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const clear = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/clear-cache", { method: "POST" });
      if (!res.ok) throw new Error();
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-8 flex items-center gap-3">
      <button
        type="button"
        onClick={clear}
        disabled={status === "loading"}
        className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground disabled:opacity-40"
      >
        {status === "loading" ? "Wird geleert..." : "Cache leeren"}
      </button>
      {status === "done" && (
        <span className="text-xs font-bold text-accent-lime">
          Erledigt - Seite ist frisch.
        </span>
      )}
      {status === "error" && (
        <span className="text-xs font-bold text-red-500">
          Fehlgeschlagen, bitte nochmal versuchen.
        </span>
      )}
    </div>
  );
}
