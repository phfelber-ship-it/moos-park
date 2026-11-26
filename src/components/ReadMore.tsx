"use client";

import { useState } from "react";

export default function ReadMore({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <p
        className={`whitespace-pre-line text-foreground/80 ${
          open ? "" : "line-clamp-3"
        }`}
      >
        {text}
      </p>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 text-sm font-black text-accent-lime hover:underline"
      >
        {open ? "Weniger anzeigen" : "Mehr anzeigen"}
      </button>
    </div>
  );
}
