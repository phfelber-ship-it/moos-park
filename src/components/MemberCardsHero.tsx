"use client";

import Image from "next/image";
import { motion } from "motion/react";

// Radialer Kartenburst (angelehnt an
// marketplace.savee.com/products/credit-card-7): die vier Clubcards
// (Bronze/Silber/Gold/Premium) sitzen zunaechst dicht uebereinander an
// einem gemeinsamen Drehpunkt, faechern sich dann wie ein aufgefaechertes
// Kartenspiel radial nach aussen auf, halten kurz und ziehen sich wieder
// zusammen - in Dauerschleife, je Karte leicht zeitversetzt.
type CardConfig = {
  key: string;
  label: string;
  gradient: string;
  shine: string;
  dark?: boolean;
  angleDeg: number;
  delay: number;
};

const CARDS: CardConfig[] = [
  {
    key: "silber",
    label: "SILBER",
    gradient: "linear-gradient(135deg, #9aa1a8 0%, #e8ebee 35%, #6b7278 65%, #cfd3d7 100%)",
    shine: "rgba(255,255,255,0.55)",
    angleDeg: -42,
    delay: 0,
  },
  {
    key: "bronze",
    label: "BRONZE",
    gradient: "linear-gradient(135deg, #6b3e21 0%, #c98a52 35%, #7c4a2d 65%, #e3a86a 100%)",
    shine: "rgba(255,214,170,0.5)",
    angleDeg: -14,
    delay: 0.4,
  },
  {
    key: "gold",
    label: "GOLD",
    gradient: "linear-gradient(135deg, #8a6a12 0%, #f5d580 35%, #96731a 65%, #ffe9a8 100%)",
    shine: "rgba(255,241,196,0.6)",
    angleDeg: 14,
    delay: 0.8,
  },
  {
    key: "premium",
    label: "PREMIUM",
    gradient: "linear-gradient(135deg, #050505 0%, #2b2b2b 35%, #000000 65%, #1c1c1c 100%)",
    shine: "rgba(185,206,173,0.4)",
    dark: true,
    angleDeg: 42,
    delay: 1.2,
  },
];

// Radius (Abstand vom Drehpunkt) waehrend der Schleife: eng zusammen ->
// beruehren -> weit aufgefaechert -> halten -> wieder eng zusammen.
const RADIUS_KEYFRAMES = [22, 22, 22, 150, 150, 22];
const TIMES = [0, 0.16, 0.22, 0.45, 0.78, 1];
const CYCLE_DURATION = 9;
// Drehpunkt: etwas unterhalb der Containermitte, Karten faechern nach oben
// und zur Seite auf (wie eine in der Hand gehaltene Kartenfaecher).
const PIVOT_Y = 70;

function polarToXY(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.sin(rad), y: PIVOT_Y - radius * Math.cos(rad) };
}

function MemberCard({ card }: { card: CardConfig }) {
  const { angleDeg, gradient, shine, label, delay, dark } = card;
  const textStrong = dark ? "text-white" : "text-black/85";
  const textMid = dark ? "text-white/70" : "text-black/70";
  const textSoft = dark ? "text-white/50" : "text-black/50";
  const iconColor = dark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.55)";

  const points = RADIUS_KEYFRAMES.map((r) => polarToXY(angleDeg, r));
  const xValues = points.map((p) => p.x);
  const yValues = points.map((p) => p.y);
  // Waehrend des "Haltens" wackelt die Karte minimal um ihren Winkel, statt
  // stocksteif zu stehen.
  const rotateValues = [
    angleDeg,
    angleDeg,
    angleDeg,
    angleDeg - 2,
    angleDeg + 2,
    angleDeg,
  ];
  const opacityValues = [0, 1, 1, 1, 1, 0.4];
  const scaleValues = [0.55, 0.65, 0.68, 1, 1, 0.55];

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ zIndex: 10 + Math.round(Math.abs(angleDeg)), perspective: 800 }}
    >
      <motion.div
        animate={{
          x: xValues,
          y: yValues,
          rotate: rotateValues,
          scale: scaleValues,
          opacity: opacityValues,
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
        {/* Feine gebuerstete Metall-Textur fuer den realistischen Look */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            background:
              "repeating-linear-gradient(100deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            background: `linear-gradient(115deg, transparent 30%, ${shine} 48%, transparent 60%)`,
          }}
        />
        {/* Innenschatten fuer Kanten-Tiefe, wie bei echtem Plastik/Metall */}
        <div className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-6px_16px_rgba(0,0,0,0.35)]" />

        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {/* EMV-Chip mit Kontaktfeldern */}
              <div
                className="relative h-6 w-8 rounded-[3px] sm:h-7 sm:w-9"
                style={{
                  background:
                    "linear-gradient(135deg, #f6e3a1 0%, #d8b45c 30%, #b8860b 55%, #f6e3a1 80%, #caa04a 100%)",
                  boxShadow: "inset 0 0 1px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  className="absolute inset-[3px] rounded-[2px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(0,0,0,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.35) 1px, transparent 1px)",
                    backgroundSize: "33% 50%",
                  }}
                />
              </div>
              {/* Kontaktlos-Symbol */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-80">
                <path d="M6 15a9 9 0 0 1 0-6" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
                <path d="M9.5 17.5a13 13 0 0 1 0-11" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
                <path d="M13 19a17 17 0 0 1 0-14" stroke={iconColor} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="relative h-6 w-6 opacity-80 sm:h-7 sm:w-7">
              <Image src="/images/logo.png" alt="" fill className="object-contain" />
            </div>
          </div>

          {/* Geprägte Kartennummer */}
          <p
            className={`font-mono text-sm tracking-[0.15em] sm:text-base ${textStrong}`}
            style={{
              textShadow: dark
                ? "0 1px 0 rgba(255,255,255,0.15), 0 -1px 0 rgba(0,0,0,0.4)"
                : "0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.25)",
            }}
          >
            •••• •••• •••• 2627
          </p>

          <div className="flex items-end justify-between">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.25em] sm:text-xs ${textMid}`}>
                Club Card
              </p>
              <p className={`mt-0.5 text-2xl font-black uppercase leading-none tracking-tight sm:text-3xl ${textStrong}`}>
                {label}
              </p>
            </div>
            <p className={`text-[10px] font-bold uppercase tracking-wide ${textSoft}`}>
              moos.park
              <br />
              26/27
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
