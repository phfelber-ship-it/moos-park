"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/tanzabend", label: "Tanzabend" },
  { href: "/geburtstag", label: "Geburtstag" },
  { href: "/eventlocation", label: "Eventlocation" },
  { href: "/bilder", label: "Bilder" },
  { href: "/jobs", label: "Jobs" },
  { href: "/faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

const NAV_LINKS_LEFT = NAV_LINKS.slice(1, 5);
const NAV_LINKS_RIGHT = NAV_LINKS.slice(5);

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sticky top-3 z-50 px-3">
      <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full bg-background px-6 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
        <button
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
          className="text-foreground lg:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 5l14 14M19 5 5 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        <Link href="/" aria-label="Home" className="hidden text-foreground lg:block">
          <HomeIcon />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS_LEFT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          aria-label="Home"
          className="absolute left-1/2 top-1/2 w-8 -translate-x-1/2 -translate-y-1/2"
        >
          <Image
            src="/images/logo.png"
            alt="moos.park"
            width={40}
            height={40}
            className="w-full"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS_RIGHT.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-bold uppercase tracking-wide text-foreground transition-colors hover:text-foreground/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/eventtickets"
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 sm:px-5"
          >
            Tickets
          </Link>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-background lg:hidden">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-4xl font-black uppercase tracking-tight ${
                  active ? "text-accent-lime" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
