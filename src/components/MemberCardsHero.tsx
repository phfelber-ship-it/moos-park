"use client";

import Image from "next/image";
import { motion } from "motion/react";

// Angelehnt an schwebende, leicht gedrehte Kartenstapel (siehe
// shop.club-savoy.com) - vier liegende Clubcards in Bronze/Silber/Gold/
// Premium, die dauerhaft sanft schweben und sich leicht drehen
// (2D-Wackeln + 3D-Kippen fuers Licht-/Glanz-Gefuehl), mit dem
// Ankuendigungstext darunter.
type CardConfig = {
  key: string;
  label: string;
  gradient: string;
  shine: string;
  dark?: boolean;
  base: { x: number; y: number; rotate: number; scale: number; z: number };
  duration: number;
};

const CARDS: CardConfig[] = [
  {
    key: "silber",
    label: "SILBER",
    gradient: "linear-gradient(135deg, #9aa1a8 0%, #e8ebee 35%, #6b7278 65%, #cfd3d7 100%)",
    shine: "rgba(255,255,255,0.55)",
    base: { x: -168, y: -8, rotate: -15, scale: 0.8, z: 5 },
    duration: 7,
  },
  {
    key: "bronze",
    label: "BRONZE",
    gradient: "linear-gradient(135deg, #6b3e21 0%, #c98a52 35%, #7c4a2d 65%, #e3a86a 100%)",
    shine: "rgba(255,214,170,0.5)",
    base: { x: -60, y: 8, rotate: -6, scale: 0.9, z: 10 },
    duration: 6,
  },
  {
    key: "gold",
    label: "GOLD",
    gradient: "linear-gradient(135deg, #8a6a12 0%, #f5d580 35%, #96731a 65%, #ffe9a8 100%)",
    shine: "rgba(255,241,196,0.6)",
    base: { x: 112, y: -14, rotate: 9, scale: 0.85, z: 8 },
    duration: 6.5,
  },
  {
    key: "premium",
    label: "PREMIUM",
    gradient: "linear-gradient(135deg, #050505 0%, #2b2b2b 35%, #000000 65%, #1c1c1c 100%)",
    shine: "rgba(185,206,173,0.4)",
    dark: true,
    base: { x: 22, y: 42, rotate: 2, scale: 1, z: 20 },
    duration: 5.5,
  },
];

function MemberCard({ card }: { card: CardConfig }) {
  const { base, gradient, shine, label, duration, dark } = card;
  const textStrong = dark ? "text-white" : "text-black/85";
  const textMid = dark ? "text-white/70" : "text-black/70";
  const textSoft = dark ? "text-white/50" : "text-black/50";
  const chip = dark ? "bg-white/20" : "bg-black/25";

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
            <div className={`h-6 w-9 rounded-sm sm:h-7 sm:w-10 ${chip}`} />
            <div className="relative h-6 w-6 opacity-80 sm:h-7 sm:w-7">
              <Image src="/images/logo.png" alt="" fill className="object-contain" />
            </div>
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.25em] sm:text-xs ${textMid}`}>
              Club Card
            </p>
            <p className={`mt-0.5 text-2xl font-black uppercase leading-none tracking-tight sm:text-3xl ${textStrong}`}>
              {label}
            </p>
            <p className={`mt-1 text-[10px] font-bold uppercase tracking-wide ${textSoft}`}>
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
    <div className="relative mx-auto h-[340px] w-full max-w-3xl sm:h-[400px]">
      {CARDS.map((card) => (
        <MemberCard key={card.key} card={card} />
      ))}
    </div>
  );
}
