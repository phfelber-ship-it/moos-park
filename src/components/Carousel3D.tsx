"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";

type Photo = { src: string; alt: string };

function wrapDeg(v: number) {
  let d = ((v % 360) + 360) % 360;
  if (d > 180) d -= 360;
  return d;
}

function Card({
  photo,
  index,
  step,
  radius,
  width,
  angle,
  priority,
  onSelect,
}: {
  photo: Photo;
  index: number;
  step: number;
  radius: number;
  width: number;
  angle: MotionValue<number>;
  priority: boolean;
  onSelect: (index: number) => void;
}) {
  // Abstand dieser Karte zur Vorderseite in Grad (0 = vorne)
  const rel = useTransform(angle, (a) => wrapDeg(index * step + a));
  const opacity = useTransform(rel, (r) => 1 - 0.8 * Math.min(Math.abs(r) / 100, 1));

  return (
    <motion.button
      type="button"
      aria-label={photo.alt}
      onClick={() => onSelect(index)}
      style={{
        width,
        height: width * (4 / 3),
        marginLeft: -width / 2,
        marginTop: -(width * (4 / 3)) / 2,
        transform: `rotateY(${index * step}deg) translateZ(${radius}px)`,
        backfaceVisibility: "hidden",
        opacity,
      }}
      className="absolute left-1/2 top-1/2 overflow-hidden rounded-2xl bg-foreground/10 shadow-2xl"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        draggable={false}
        priority={priority}
        sizes="300px"
        className="pointer-events-none select-none object-cover"
      />
    </motion.button>
  );
}

export default function Carousel3D({ photos }: { photos: Photo[] }) {
  const reduce = useReducedMotion();
  const n = photos.length;
  const step = 360 / n;
  const angle = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [width, setWidth] = useState(260);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Kartenbreite je nach Bildschirm; Radius so, dass sich die Karten nicht überlappen
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setWidth(w < 640 ? 190 : w < 1024 ? 230 : 270);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const radius = useMemo(
    () => Math.round(((width * 1.12) / 2 / Math.tan(Math.PI / n)) || 0),
    [width, n]
  );

  useEffect(
    () =>
      angle.on("change", (a) => {
        const idx = ((Math.round(-a / step) % n) + n) % n;
        setActive((prev) => (prev === idx ? prev : idx));
      }),
    [angle, step, n]
  );

  const snapTo = useCallback(
    (target: number) =>
      animate(angle, target, { type: "spring", stiffness: 70, damping: 16 }),
    [angle]
  );

  const goBy = useCallback(
    (dir: 1 | -1) => {
      const current = Math.round(-angle.get() / step);
      snapTo(-(current + dir) * step);
    },
    [angle, snapTo, step]
  );

  const goTo = useCallback(
    (index: number) => {
      const current = Math.round(-angle.get() / step);
      const diff = wrapDeg((index - current) * step) / step;
      snapTo(-(current + Math.round(diff)) * step);
    },
    [angle, snapTo, step]
  );

  const onPan = (_: PointerEvent, info: PanInfo) => {
    angle.stop();
    angle.set(angle.get() + info.delta.x * 0.3);
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    const projected = angle.get() + info.velocity.x * 0.08;
    snapTo(Math.round(projected / step) * step);
  };

  if (reduce) {
    // Weniger Bewegung: einfache, seitlich scrollbare Reihe ohne Drehung
    return (
      <div className="mt-10 flex snap-x gap-4 overflow-x-auto px-6 pb-4">
        {photos.map((p) => (
          <div
            key={p.src}
            className="relative aspect-[3/4] w-[70vw] max-w-xs shrink-0 snap-center overflow-hidden rounded-2xl bg-foreground/10"
          >
            <Image src={p.src} alt={p.alt} fill sizes="320px" className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  const height = Math.round(width * (4 / 3) + 80);

  return (
    <div
      ref={wrapRef}
      role="region"
      aria-roledescription="Karussell"
      aria-label="Eindrücke aus dem moos.park"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goBy(-1);
        if (e.key === "ArrowRight") goBy(1);
      }}
      className="relative mt-10 select-none outline-none"
    >
      <motion.div
        onPan={onPan}
        onPanEnd={onPanEnd}
        style={{ perspective: 1600, height, touchAction: "pan-y" }}
        className="relative cursor-grab overflow-visible active:cursor-grabbing"
      >
        <motion.div
          style={{
            rotateY: angle,
            z: -radius,
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-0"
        >
          {photos.map((photo, i) => (
            <Card
              key={photo.src}
              photo={photo}
              index={i}
              step={step}
              radius={radius}
              width={width}
              angle={angle}
              priority={i === 0}
              onSelect={goTo}
            />
          ))}
        </motion.div>
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => goBy(-1)}
          aria-label="Vorheriges Bild"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/30 text-foreground transition-colors hover:border-foreground"
        >
          ‹
        </button>
        <span
          className="min-w-[4.5rem] text-center font-mono text-xs tracking-[0.2em] text-foreground/60"
          aria-live="polite"
        >
          {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => goBy(1)}
          aria-label="Nächstes Bild"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/30 text-foreground transition-colors hover:border-foreground"
        >
          ›
        </button>
      </div>
    </div>
  );
}
