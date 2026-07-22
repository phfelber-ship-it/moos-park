"use client";

import { useState } from "react";

export default function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-foreground/8 rounded-xl border border-foreground/8 bg-foreground/[0.025]">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="font-bold text-foreground">{item.q}</span>
            <span className="text-xl text-accent">{open === i ? "−" : "+"}</span>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-sm text-foreground/70">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
