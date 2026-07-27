"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";

const IMAGE_INTERVAL = 4000;

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d={dir === "left" ? "M15 5 8 12l7 7" : "m9 5 7 7-7 7"}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

export default function RoomImageRotator({
  images,
  alt,
  sizes,
}: {
  images: string[];
  alt: string;
  sizes: string;
}) {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  const paginate = (dir: 1 | -1) => {
    setState(([i]) => [(i + dir + images.length) % images.length, dir]);
  };

  const restartTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => paginate(1), IMAGE_INTERVAL);
  };

  useEffect(() => {
    restartTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const goTo = (dir: 1 | -1) => {
    paginate(dir);
    restartTimer();
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDown.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const down = pointerDown.current;
    pointerDown.current = null;
    if (!down || images.length <= 1) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="absolute inset-0 touch-pan-y select-none overflow-hidden"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={images[index]}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={alt}
            fill
            draggable={false}
            className="pointer-events-none object-cover"
            sizes={sizes}
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Vorheriges Bild"
            onClick={() => goTo(-1)}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-accent-lime hover:text-black"
          >
            <Arrow dir="left" />
          </button>
          <button
            type="button"
            aria-label="Nächstes Bild"
            onClick={() => goTo(1)}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-accent-lime hover:text-black"
          >
            <Arrow dir="right" />
          </button>
          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-accent-lime" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
