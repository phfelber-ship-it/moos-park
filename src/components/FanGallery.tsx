"use client";

import Image from "next/image";
import { motion } from "motion/react";

type FanPhoto = { src: string; alt: string };

const LAYOUT = [
  { tx: -360, ty: 40, rotate: -12, z: 10 },
  { tx: -180, ty: 14, rotate: -6, z: 20 },
  { tx: 0, ty: -8, rotate: 0, z: 40 },
  { tx: 180, ty: 14, rotate: 6, z: 20 },
  { tx: 360, ty: 40, rotate: 12, z: 10 },
];

export default function FanGallery({ photos }: { photos: FanPhoto[] }) {
  const cards = photos.slice(0, LAYOUT.length);

  return (
    <div
      className="relative mx-auto mt-10 h-[280px] w-full max-w-[1000px] scale-[0.55] sm:scale-75 sm:h-[340px] lg:scale-100 lg:h-[380px]"
      style={{ transformOrigin: "50% 50%" }}
    >
      {cards.map((photo, i) => {
        const { tx, ty, rotate, z } = LAYOUT[i];
        return (
          <motion.div
            key={photo.src}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.05, rotate: 0, zIndex: 50 }}
            className="absolute left-1/2 top-1/2 h-[320px] w-[240px] overflow-hidden rounded-2xl border-[1.5px] border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
            style={{
              x: tx,
              y: ty,
              marginLeft: "-120px",
              marginTop: "-160px",
              rotate: `${rotate}deg`,
              zIndex: z,
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="240px"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
