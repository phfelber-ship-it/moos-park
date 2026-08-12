"use client";

import { motion } from "motion/react";

// Visuelles Pendant zu AppPhoneReveal fuer den WhatsApp-Channel-Teaser -
// gleiche Animation/Positionierung, aber ohne Phone-Mockup-Bild (das es fuer
// den Channel noch nicht gibt), stattdessen ein grosses WhatsApp-Icon.
export default function WhatsAppChannelReveal() {
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
        className="relative flex aspect-square w-full items-center justify-center rounded-[3rem] bg-[#25D366] drop-shadow-2xl"
      >
        <svg width="42%" height="42%" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.38 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2m0 18c-1.65 0-3.19-.47-4.5-1.28l-.32-.2-3.01.79.8-2.93-.21-.32A7.94 7.94 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8m4.36-5.96c-.24-.12-1.41-.7-1.63-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.92-1.18-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.41-.58 1.61-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
