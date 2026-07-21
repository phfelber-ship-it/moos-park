"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/tanzabend", label: "Tanzabend" },
  { href: "/geburtstag", label: "Geburtstag" },
  { href: "/eventlocation", label: "Eventlocation" },
];

const NAV_LINKS_RIGHT = [
  { href: "/bilder", label: "Bilder" },
  { href: "/jobs", label: "Jobs" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-3 z-50 px-3">
      <header className="mx-auto flex max-w-6xl items-center justify-between rounded-full bg-white px-6 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
        <Link href="/" aria-label="Home" className="text-foreground">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 11.5 12 4l9 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:text-black/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS_RIGHT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:text-black/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/events"
            className="hidden items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 sm:inline-flex"
          >
            Tickets
          </Link>
          <button
            className="text-foreground lg:hidden"
            aria-label="Menü öffnen"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <nav className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-3xl bg-white p-4 shadow-[0_2px_20px_rgba(0,0,0,0.08)] lg:hidden">
          {[...NAV_LINKS, ...NAV_LINKS_RIGHT].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-bold uppercase tracking-wide text-foreground hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/events"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-accent px-5 py-2 text-center text-xs font-black uppercase tracking-wide text-black"
          >
            Tickets
          </Link>
        </nav>
      )}
    </div>
  );
}
