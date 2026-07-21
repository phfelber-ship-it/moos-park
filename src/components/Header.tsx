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

const MAIN_ACTIONS = [
  { href: "/eventtickets", label: "Events + Tickets", filled: true },
  { href: "/reservierung", label: "Reservierung", filled: false },
  { href: "/eventlocation", label: "Location mieten", filled: false },
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
      <header className="relative z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full bg-background px-5 py-2.5 shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
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

        <nav className="hidden items-center gap-3 lg:flex">
          {MAIN_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={
                action.filled
                  ? "rounded-full bg-accent px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
                  : "rounded-full border border-foreground/20 px-5 py-2.5 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground/50"
              }
            >
              {action.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpen((v) => !v)}
            className="text-foreground"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 5l14 14M19 5 5 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-background px-6">
          <div className="flex w-full max-w-xs flex-col gap-3 lg:hidden">
            {MAIN_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                onClick={() => setOpen(false)}
                className={
                  action.filled
                    ? "rounded-full bg-accent px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-black"
                    : "rounded-full border border-foreground/20 px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-foreground"
                }
              >
                {action.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col items-center gap-6 overflow-y-auto">
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
                  className={`text-2xl font-black uppercase tracking-tight sm:text-4xl ${
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
