"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function AppPhoneReveal() {
  return (
    <motion.div
      initial={{ x: -220, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative order-2 mx-auto w-full max-w-[220px] sm:max-w-[260px] lg:order-1"
      style={{ perspective: "1000px" }}
    >
      <div className="absolute inset-0 scale-125 rounded-full bg-accent-lime/20 blur-3xl" />
      {/*
        hero-home.jpg ist bereits ein fertiges 3D-Handy-Mockup mit echtem
        Rahmen - wir croppen hier nur den weißen Rand ringsum weg (statt
        einen eigenen CSS-Rahmen drüberzulegen) und wenden dann die
        3D-Neigung auf das ganze Bild an.
      */}
      <div
        className="relative aspect-[1454/2560] w-full overflow-hidden drop-shadow-2xl"
        style={{ transform: "rotateY(-18deg) rotateX(4deg)" }}
      >
        <Image
          src="/images/hero-home.jpg"
          alt="moos.park App"
          fill
          className="scale-[1.18] object-cover"
          sizes="260px"
        />
      </div>
    </motion.div>
  );
}
