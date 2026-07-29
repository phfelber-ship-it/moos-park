"use client";

import { motion, type Variants } from "motion/react";
import MotionLink from "@/components/MotionLink";
import FlipText from "@/components/FlipText";
import HeroBackground from "@/components/HeroBackground";
import { MAIN_ACTIONS } from "@/lib/nav";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

export default function Hero({ images }: { images: string[] }) {
  return (
    <section className="relative flex h-[100vh] items-end overflow-hidden text-center text-white sm:h-[85vh]">
      <HeroBackground images={images} />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pb-4 pt-36 sm:pb-16 sm:pt-0"
      >
        <motion.span
          variants={item}
          className="rounded-lg bg-accent-lime px-4 py-1.5 text-xs font-black uppercase tracking-wide text-black"
        >
          #1 Eventlocation
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-5 text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
        >
          Moos.park
        </motion.h1>
        <motion.p
          variants={item}
          className="text-4xl font-normal uppercase leading-[0.95] tracking-tight text-white/70 sm:text-7xl"
        >
          Pöttmes
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex w-full max-w-md flex-col gap-2.5 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-3"
        >
          {MAIN_ACTIONS.map((action) => (
            <MotionLink
              key={action.href}
              href={action.href}
              fullWidth={false}
              className={
                action.filled
                  ? "block w-full rounded-lg bg-accent-lime px-6 py-2.5 text-center text-xs font-black uppercase tracking-wide text-black sm:py-3.5 sm:text-sm sm:w-auto"
                  : "block w-full rounded-lg border border-white/40 px-6 py-2.5 text-center text-xs font-black uppercase tracking-wide text-white transition-colors hover:border-white sm:py-3.5 sm:text-sm sm:w-auto"
              }
            >
              <FlipText text={action.label} />
            </MotionLink>
          ))}
        </motion.div>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col items-center gap-3 text-white/70 sm:mt-14"
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]">
            Scroll
          </span>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border-2 border-white/40 p-1.5">
            <span className="h-1.5 w-1.5 animate-scroll-dot rounded-full bg-accent-lime" />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
