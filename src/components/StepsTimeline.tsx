"use client";

import { useEffect, useRef, useState } from "react";

type Step = { num: string; title: string; text: string };

// Vertikale Fortschrittslinie fuer "So einfach geht's"-Schritte: der erste
// Schritt ist von Anfang an als erledigt markiert, weitere Schritte werden
// beim Herunterscrollen automatisch nachgezogen (IntersectionObserver).
export default function StepsTimeline({ steps }: { steps: Step[] }) {
  const [doneCount, setDoneCount] = useState(1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(
            (entry.target as HTMLElement).dataset.stepIndex ?? -1
          );
          if (idx >= 0) {
            setDoneCount((d) => Math.max(d, idx + 1));
          }
        });
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0.25 }
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const progressPercent =
    steps.length > 1 ? ((doneCount - 1) / (steps.length - 1)) * 100 : 100;

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-foreground/10 sm:left-5">
        <div
          className="w-full bg-accent-lime transition-[height] duration-500 ease-out"
          style={{ height: `${progressPercent}%` }}
        />
      </div>

      <div className="flex flex-col gap-10">
        {steps.map((s, i) => {
          const done = i < doneCount;
          return (
            <div
              key={s.num}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              data-step-index={i}
              className="relative flex gap-5 pl-12 sm:pl-14"
            >
              <span
                className={`absolute left-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black transition-colors sm:h-10 sm:w-10 ${
                  done
                    ? "bg-accent-lime text-black"
                    : "bg-foreground/10 text-foreground/50"
                }`}
              >
                {done ? "✓" : s.num}
              </span>
              <div>
                <h3 className="font-black uppercase text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
