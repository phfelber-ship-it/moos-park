"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "motion/react";

type FanPhoto = { src: string; alt: string };

const PX_PER_SLOT = 170;
const AUTO_ROTATE_SLOTS_PER_SEC = 0.05;
const RESUME_DELAY_MS = 2500;

function wrap(value: number, total: number) {
  const half = total / 2;
  let v = value % total;
  if (v > half) v -= total;
  if (v < -half) v += total;
  return v;
}

function xFor(p: number) {
  const a = Math.min(Math.abs(p), 2);
  const extra = Math.max(Math.abs(p) - 2, 0);
  return Math.sign(p) * (a * PX_PER_SLOT + extra * 90);
}

function opacityFor(p: number) {
  const a = Math.abs(p);
  if (a <= 1.6) return 1;
  if (a <= 2.6) return 1 - ((a - 1.6) / 1.0) * 0.55;
  if (a <= 3.4) return 0.45 - ((a - 2.6) / 0.8) * 0.33;
  return 0;
}

function Card({
  photo,
  index,
  offset,
  total,
}: {
  photo: FanPhoto;
  index: number;
  offset: ReturnType<typeof useMotionValue<number>>;
  total: number;
}) {
  const p = useTransform(offset, (o) => wrap(index - o, total));
  const x = useTransform(p, xFor);
  const y = useTransform(p, (v) => -8 + 14 * Math.min(Math.abs(v), 3) ** 2 * 0.28);
  const rotate = useTransform(p, (v) => Math.max(Math.min(v, 2.4), -2.4) * 6);
  const opacity = useTransform(p, opacityFor);
  const zIndex = useTransform(p, (v) => Math.round(100 - Math.abs(v) * 10));
  const scale = useTransform(p, (v) => 1 - Math.min(Math.abs(v), 3) * 0.04);

  return (
    <motion.div
      data-photo-index={index}
      className="absolute left-1/2 top-1/2 h-[320px] w-[240px] overflow-hidden rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
      style={{
        x,
        y,
        rotate,
        opacity,
        zIndex,
        scale,
        marginLeft: "-120px",
        marginTop: "-160px",
      }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        draggable={false}
        className="pointer-events-none object-cover"
        sizes="240px"
      />
    </motion.div>
  );
}

export default function FanGallery({ photos }: { photos: FanPhoto[] }) {
  const offset = useMotionValue(0);
  const total = photos.length;
  const [dragging, setDragging] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<FanPhoto | null>(null);
  const startOffset = useRef(0);
  const resumeAt = useRef(0);
  const rafRef = useRef<number | null>(null);
  const pointerDown = useRef<{ x: number; y: number; target: EventTarget | null } | null>(
    null
  );

  useEffect(() => {
    if (total <= 1) return;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!dragging && now >= resumeAt.current) {
        offset.set(offset.get() + (AUTO_ROTATE_SLOTS_PER_SEC * dt) / 1000);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dragging, offset, total]);

  const handlePanStart = () => {
    setDragging(true);
    startOffset.current = offset.get();
  };

  const handlePan = (_e: PointerEvent, info: PanInfo) => {
    offset.set(startOffset.current - info.offset.x / PX_PER_SLOT);
  };

  const handlePanEnd = (_e: PointerEvent, info: PanInfo) => {
    setDragging(false);
    resumeAt.current = performance.now() + RESUME_DELAY_MS;
    const velocitySlots = -info.velocity.x / PX_PER_SLOT;
    const target = Math.round(offset.get() + velocitySlots * 0.15);
    animate(offset, target, {
      type: "spring",
      stiffness: 260,
      damping: 32,
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDown.current = { x: e.clientX, y: e.clientY, target: e.target };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const down = pointerDown.current;
    pointerDown.current = null;
    if (!down) return;
    const dist = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    if (dist > 6) return;
    const el =
      down.target instanceof Element ? down.target.closest("[data-photo-index]") : null;
    const indexAttr = el?.getAttribute("data-photo-index");
    if (indexAttr == null) return;
    const photo = photos[Number(indexAttr)];
    if (photo) setLightboxPhoto(photo);
  };

  const step = (dir: 1 | -1) => {
    resumeAt.current = performance.now() + RESUME_DELAY_MS;
    const target = Math.round(offset.get()) + dir;
    animate(offset, target, { type: "spring", stiffness: 260, damping: 32 });
  };

  return (
    <div className="relative mx-auto mt-10 w-full max-w-[1000px]">
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Vorheriges Bild"
            onClick={() => step(-1)}
            className="absolute left-2 top-1/2 z-[60] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/10 text-foreground backdrop-blur transition-colors hover:bg-accent-lime hover:text-black sm:left-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 5 8 12l7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Nächstes Bild"
            onClick={() => step(1)}
            className="absolute right-2 top-1/2 z-[60] flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/10 text-foreground backdrop-blur transition-colors hover:bg-accent-lime hover:text-black sm:right-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="m9 5 7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}

      <motion.div
        className="relative h-[280px] touch-pan-y select-none scale-[0.55] sm:scale-75 sm:h-[340px] lg:scale-100 lg:h-[380px]"
        style={{
          transformOrigin: "50% 50%",
          cursor: total > 1 ? (dragging ? "grabbing" : "grab") : undefined,
        }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {photos.map((photo, i) => (
          <Card key={photo.src} photo={photo} index={i} offset={offset} total={total} />
        ))}
      </motion.div>

      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-6"
            onClick={() => setLightboxPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[3/4] w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxPhoto.src}
                alt={lightboxPhoto.alt}
                fill
                className="rounded-2xl object-contain"
                sizes="90vw"
              />
            </motion.div>
            <button
              type="button"
              aria-label="Schließen"
              onClick={() => setLightboxPhoto(null)}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
