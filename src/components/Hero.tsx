"use client";

import Image from "next/image";
import { motion } from "motion/react";
import MotionLink from "@/components/MotionLink";
import { MAIN_ACTIONS } from "@/lib/nav";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26 },
  },
};

export default function Hero() {
  return (
    <section className="relative -mt-[66px] flex min-h-[75vh] items-end overflow-hidden pt-[66px] text-center text-white sm:min-h-[90vh]">
      <Image
        src="/images/hero-bg.jpg"
        alt="moos.park"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pb-16"
      >
        <motion.div variants={item}>
          <Image
            src="/images/logo.png"
            alt="moos.park – Dein Hotspot für Tag und Nacht"
            width={160}
            height={160}
            className="w-32 sm:w-40"
            priority
          />
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
        >
          Moos.park
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-2 text-lg font-bold uppercase tracking-[0.3em] text-white/70"
        >
          Pöttmes
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex w-full max-w-xs flex-col gap-3"
        >
          {MAIN_ACTIONS.map((action) => (
            <MotionLink
              key={action.href}
              href={action.href}
              className={
                action.filled
                  ? "block w-full rounded-full bg-accent px-6 py-3.5 text-center text-sm font-black uppercase tracking-wide text-black"
                  : "block w-full rounded-full border border-white/40 px-6 py-3.5 text-center text-sm font-black uppercase tracking-wide text-white transition-colors hover:border-white"
              }
            >
              {action.label}
            </MotionLink>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
