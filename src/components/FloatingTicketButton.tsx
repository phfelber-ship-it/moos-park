"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingTicketButton() {
  const pathname = usePathname();

  if (pathname === "/eventtickets") {
    return null;
  }

  return (
    <Link
      href="/eventtickets"
      aria-label="Tickets kaufen"
      className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-xs font-black uppercase tracking-wide text-black shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 1 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 1 0 0-4z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M10 7v10"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 2"
          strokeLinecap="round"
        />
      </svg>
      <span className="hidden sm:inline">Tickets kaufen</span>
    </Link>
  );
}
