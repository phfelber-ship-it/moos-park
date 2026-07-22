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
      <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full border border-foreground/10 bg-background px-5 py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="moos.park"
            width={44}
            height={44}
            className="w-10 sm:w-11"
          />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-black uppercase tracking-wide text-foreground">
              moos.park
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-foreground/50">
              Pöttmes
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.slice(1).map((link) => (
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
          <Link
            href="/eventtickets"
            aria-label="Tickets kaufen"
            className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 sm:px-5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
            <span className="hidden sm:inline">Tickets</span>
          </Link>
          <ThemeToggle />
          <button
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpen((v) => !v)}
            className="relative h-6 w-6 text-foreground"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className={`absolute inset-0 m-auto transition-all duration-300 ${
                open ? "rotate-90 opacity-100" : "rotate-0 opacity-0"
              }`}
            >
              <path
                d="M5 5l14 14M19 5 5 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`absolute inset-0 m-auto transition-all duration-300 ${
                open ? "-rotate-90 opacity-0" : "rotate-0 opacity-100"
              }`}
            >
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
        <div className="animate-menu-fade-in fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background px-6">
          <div className="flex flex-col items-center gap-6 overflow-y-auto">
            {NAV_LINKS.map((link, i) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={`animate-menu-item-in text-2xl font-black uppercase tracking-tight sm:text-4xl ${
                    active ? "text-accent-lime" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
