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
      {/*
        hero-home.jpg ist bereits ein fertiges 3D-Handy-Mockup mit echtem
        Rahmen - wir croppen hier den weißen Rand ringsum komplett weg
        (statt einen eigenen CSS-Rahmen drüberzulegen) und ersetzen ihn
        durch einen schmalen, kantenbündigen Lime-Akzentstrich (angelehnt
        an Bootshaus). Die 3D-Neigung liegt auf dem ganzen Bild.
      */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative aspect-[1454/2560] w-full overflow-hidden drop-shadow-2xl"
        style={{ transform: "rotateY(-18deg) rotateX(4deg)" }}
      >
        <span className="absolute inset-y-0 left-0 z-10 w-1.5 bg-accent-lime" />
        <Image
          src="/images/hero-home.jpg"
          alt="moos.park App"
          fill
          className="scale-[1.3] object-cover"
          sizes="260px"
        />
      </motion.div>
    </motion.div>
  );
}
