"use client";

import Image from "next/image";
import { motion } from "motion/react";

// Angelehnt an schwebende, leicht gedrehte Kartenstapel (siehe
// shop.club-savoy.com) - drei liegende Clubcards in Bronze/Silber/Gold, die
// dauerhaft sanft schweben und sich leicht drehen (2D-Wackeln + 3D-Kippen
// fuers Licht-/Glanz-Gefuehl), mit dem Ankuendigungstext mittig davor.
type CardConfig = {
  key: string;
  label: string;
  gradient: string;
  shine: string;
  base: { x: number; y: number; rotate: number; scale: number; z: number };
  duration: number;
};

const CARDS: CardConfig[] = [
  {
    key: "silber",
    label: "SILBER",
    gradient: "linear-gradient(135deg, #9aa1a8 0%, #e8ebee 35%, #6b7278 65%, #cfd3d7 100%)",
    shine: "rgba(255,255,255,0.55)",
    base: { x: -100, y: -4, rotate: -10, scale: 0.88, z: 10 },
    duration: 7,
  },
  {
    key: "bronze",
    label: "BRONZE",
    gradient: "linear-gradient(135deg, #6b3e21 0%, #c98a52 35%, #7c4a2d 65%, #e3a86a 100%)",
    shine: "rgba(255,214,170,0.5)",
    base: { x: 0, y: 20, rotate: -3, scale: 1, z: 20 },
    duration: 6,
  },
  {
    key: "gold",
    label: "GOLD",
    gradient: "linear-gradient(135deg, #8a6a12 0%, #f5d580 35%, #96731a 65%, #ffe9a8 100%)",
    shine: "rgba(255,241,196,0.6)",
    base: { x: 100, y: -10, rotate: 8, scale: 0.92, z: 15 },
    duration: 6.5,
  },
];

function MemberCard({ card }: { card: CardConfig }) {
  const { base, gradient, shine, label, duration } = card;
  return (
    <motion.div
      initial={{ opacity: 0, x: base.x, y: base.y + 40, rotate: base.rotate, scale: base.scale }}
      whileInView={{ opacity: 1, y: base.y }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-1/2"
      style={{ zIndex: base.z, perspective: 800 }}
    >
      <motion.div
        animate={{
          y: [base.y, base.y - 12, base.y],
          rotate: [base.rotate, base.rotate + 2.5, base.rotate],
          rotateY: [-16, 16, -16],
        }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        style={{ x: base.x, scale: base.scale, transformStyle: "preserve-3d" }}
        className="relative -ml-32 -mt-20 h-40 w-64 overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:h-44 sm:w-72"
      >
        <div className="absolute inset-0" style={{ background: gradient }} />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            background: `linear-gradient(115deg, transparent 30%, ${shine} 48%, transparent 60%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div className="h-6 w-9 rounded-sm bg-black/25 sm:h-7 sm:w-10" />
            <div className="relative h-6 w-6 opacity-80 sm:h-7 sm:w-7">
              <Image src="/images/logo.png" alt="" fill className="object-contain" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-black/70 sm:text-xs">
              Club Card
            </p>
            <p className="mt-0.5 text-2xl font-black uppercase leading-none tracking-tight text-black/85 sm:text-3xl">
              {label}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-black/50">
              moos.park · 26/27
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MemberCardsHero() {
  return (
    <div className="relative mx-auto h-[300px] w-full max-w-2xl sm:h-[340px]">
      {CARDS.map((card) => (
        <MemberCard key={card.key} card={card} />
      ))}
    </div>
  );
}
