"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type Variants } from "motion/react";
import MotionLink from "@/components/MotionLink";
import FlipText from "@/components/FlipText";
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

const SLIDE_DURATION = 2800;

export default function Hero({ images }: { images: string[] }) {
  const slides = images.length > 0 ? images : ["/images/hero-bg.jpg"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="relative flex min-h-[75vh] items-end overflow-hidden text-center text-white sm:min-h-[90vh]">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.06 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.18, ease: "easeOut" },
            scale: { duration: SLIDE_DURATION / 1000, ease: "easeOut" },
          }}
          className="absolute inset-0"
        >
          <Image
            src={slides[index]}
            alt="moos.park"
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pb-16"
      >
        <motion.span
          variants={item}
          className="rounded-lg bg-accent-lime px-4 py-1.5 text-xs font-black uppercase tracking-wide text-black"
        >
          #1 Eventlocation
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-5 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-7xl"
        >
          Moos.park
        </motion.h1>
        <motion.p
          variants={item}
          className="text-5xl font-normal uppercase leading-[0.95] tracking-tight text-white/70 sm:text-7xl"
        >
          Pöttmes
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
        >
          {MAIN_ACTIONS.map((action) => (
            <MotionLink
              key={action.href}
              href={action.href}
              fullWidth={false}
              className={
                action.filled
                  ? "block w-full rounded-lg bg-accent-lime px-6 py-3.5 text-center text-sm font-black uppercase tracking-wide text-black sm:w-auto"
                  : "block w-full rounded-lg border border-white/40 px-6 py-3.5 text-center text-sm font-black uppercase tracking-wide text-white transition-colors hover:border-white sm:w-auto"
              }
            >
              <FlipText text={action.label} />
            </MotionLink>
          ))}
        </motion.div>

        <motion.div
          variants={item}
          className="mt-14 flex flex-col items-center gap-3 text-white/70"
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
