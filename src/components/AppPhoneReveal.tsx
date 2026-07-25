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
      className="relative order-2 mx-auto w-full max-w-[260px] sm:max-w-[300px] lg:order-1"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        whileHover={{ scale: 1.08, transition: { duration: 0.35, ease: "easeOut" } }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative aspect-[768/1365] w-full drop-shadow-2xl"
      >
        <Image
          src="/images/app-mockup.png"
          alt="moos.park App"
          fill
          className="object-contain"
          sizes="300px"
        />
      </motion.div>
    </motion.div>
  );
}
