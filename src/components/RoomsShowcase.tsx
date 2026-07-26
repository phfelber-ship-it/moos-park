"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ROOMS } from "@/lib/rooms";

export default function RoomsShowcase() {
  const [active, setActive] = useState(0);
  const room = ROOMS[active];

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={room.image}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={room.image}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 500px, 100vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-white/80">
            <span>{room.capacity}</span>
            <span className="h-3 w-px bg-white/30" />
            <span>{room.area}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
          Eventlocation mieten
        </p>
        <h2 className="mt-3 text-3xl font-black uppercase leading-[1.05] text-foreground sm:text-4xl">
          Sechs Räume. Ein Gefühl.
        </h2>
        <p className="mt-4 max-w-md text-foreground/70">
          Ob Main-Halle, Terrasse oder Lounge – jeder Bereich lässt sich
          einzeln oder in Kombination für dein Event nutzen.
        </p>

        <div className="mt-8 flex flex-col divide-y divide-foreground/10 border-t border-foreground/10">
          {ROOMS.map((r, i) => {
            const isActive = i === active;
            return (
              <button
                key={r.name}
                type="button"
                onClick={() => setActive(i)}
                className="group flex items-center gap-4 py-3.5 text-left"
              >
                <span
                  className={`h-8 w-1 shrink-0 rounded-full transition-colors ${
                    isActive ? "bg-accent-lime" : "bg-transparent"
                  }`}
                />
                <span
                  className={`flex-1 text-sm font-black uppercase tracking-wide transition-colors ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/35 group-hover:text-foreground/60"
                  }`}
                >
                  {r.name}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={room.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-5 text-sm text-foreground/60"
          >
            {room.text}
          </motion.p>
        </AnimatePresence>

        <Link
          href="/eventlocation#raeume"
          className="mt-6 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Mehr erfahren
        </Link>
      </div>
    </div>
  );
}
