"use client";

import Image from "next/image";
import { motion } from "motion/react";

// Choreografierte Endlosschleife (angelehnt an shop.club-savoy.com): die
// vier Clubcards (Bronze/Silber/Gold/Premium) kommen aus der Mitte
// zusammen, beruehren sich mit den Ecken, faechern sich dann auf ihre
// Position auf und stellen sich - leicht zeitversetzt je Karte - einzeln
// vor, bevor die Schleife von vorne beginnt. Das leichte Kippen
// (rotateY) fuer den Glanzeffekt laeuft unabhaengig und schneller weiter.
type CardConfig = {
  key: string;
  label: string;
  gradient: string;
  shine: string;
  dark?: boolean;
  // Position, wenn die Karten in der Mitte zusammenkommen und sich mit
  // den Ecken beruehren.
  cluster: { x: number; y: number; rotate: number };
  // Aufgefaecherte Ruheposition.
  fan: { x: number; y: number; rotate: number; scale: number; z: number };
  delay: number;
};

const CARDS: CardConfig[] = [
  {
    key: "silber",
    label: "SILBER",
    gradient: "linear-gradient(135deg, #9aa1a8 0%, #e8ebee 35%, #6b7278 65%, #cfd3d7 100%)",
    shine: "rgba(255,255,255,0.55)",
    cluster: { x: -16, y: -6, rotate: -10 },
    fan: { x: -168, y: -8, rotate: -15, scale: 0.8, z: 5 },
    delay: 0,
  },
  {
    key: "bronze",
    label: "BRONZE",
    gradient: "linear-gradient(135deg, #6b3e21 0%, #c98a52 35%, #7c4a2d 65%, #e3a86a 100%)",
    shine: "rgba(255,214,170,0.5)",
    cluster: { x: 8, y: -4, rotate: 5 },
    fan: { x: -60, y: 8, rotate: -6, scale: 0.9, z: 10 },
    delay: 0.55,
  },
  {
    key: "gold",
    label: "GOLD",
    gradient: "linear-gradient(135deg, #8a6a12 0%, #f5d580 35%, #96731a 65%, #ffe9a8 100%)",
    shine: "rgba(255,241,196,0.6)",
    cluster: { x: -6, y: 8, rotate: -6 },
    fan: { x: 112, y: -14, rotate: 9, scale: 0.85, z: 8 },
    delay: 1.1,
  },
  {
    key: "premium",
    label: "PREMIUM",
    gradient: "linear-gradient(135deg, #050505 0%, #2b2b2b 35%, #000000 65%, #1c1c1c 100%)",
    shine: "rgba(185,206,173,0.4)",
    dark: true,
    cluster: { x: 10, y: 10, rotate: 11 },
    fan: { x: 22, y: 42, rotate: 2, scale: 1, z: 20 },
    delay: 1.65,
  },
];

// Zeitpunkte (0-1) fuer eine Schleife: zusammenkommen -> beruehren ->
// auffaechern -> kurz halten -> zurueck zur Mitte (naht sich fuer den
// nahtlosen Loop-Neustart wieder an den Startzustand an).
const TIMES = [0, 0.16, 0.2, 0.42, 0.75, 1];
const CYCLE_DURATION = 9;

function MemberCard({ card }: { card: CardConfig }) {
  const { cluster, fan, gradient, shine, label, delay, dark } = card;
  const textStrong = dark ? "text-white" : "text-black/85";
  const textMid = dark ? "text-white/70" : "text-black/70";
  const textSoft = dark ? "text-white/50" : "text-black/50";
  const chip = dark ? "bg-white/20" : "bg-black/25";

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ zIndex: fan.z, perspective: 800 }}
    >
      <motion.div
        animate={{
          x: [cluster.x, cluster.x, cluster.x, fan.x, fan.x, cluster.x],
          y: [cluster.y + 60, cluster.y, cluster.y, fan.y, fan.y - 10, cluster.y + 60],
          rotate: [cluster.rotate, cluster.rotate, cluster.rotate, fan.rotate, fan.rotate + 2, cluster.rotate],
          scale: [0.6, 0.72, 0.72, fan.scale, fan.scale, 0.6],
          opacity: [0, 1, 1, 1, 1, 0],
          rotateY: [-16, 16, -16],
        }}
        transition={{
          default: {
            duration: CYCLE_DURATION,
            times: TIMES,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          },
          rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformStyle: "preserve-3d" }}
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
