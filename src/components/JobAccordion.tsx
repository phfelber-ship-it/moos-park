"use client";

import { useState } from "react";

export type Job = { icon?: string; title: string; text: string };

export default function JobAccordion({ jobs }: { jobs: Job[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job, i) => (
        <div
          key={job.title}
          className="overflow-hidden rounded-2xl bg-accent-lime/40"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
          >
            <span className="text-base font-black uppercase leading-tight text-foreground sm:text-lg">
              {job.icon ? `${job.icon} ` : ""}
              {job.title}
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`shrink-0 text-foreground transition-transform ${
                open === i ? "rotate-90" : ""
              }`}
            >
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {open === i && (
            <div className="px-6 pb-6 text-sm text-foreground/70">
              {job.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
