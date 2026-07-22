"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

const CIRCLE_BTN =
  "flex h-[46px] w-[46px] items-center justify-center rounded-full bg-accent-lime shadow-[var(--header-shadow)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-105";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 40, y: 40 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setOpen((v) => !v);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label={open ? "Menü schließen" : "Menü öffnen"}
        className={`fixed left-10 top-10 z-50 ${CIRCLE_BTN}`}
      >
        <span className="relative h-4 w-4 text-black">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute inset-0 -m-0.5 transition-all duration-300 ${
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
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute inset-0 -m-0.5 transition-all duration-300 ${
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
        </span>
      </button>

      <Link
        href="/"
        aria-label="moos.park Startseite"
        className="fixed left-1/2 top-8 z-50 -translate-x-1/2 sm:top-6"
      >
        <Image
          src="/images/logo.png"
          alt="moos.park"
          width={88}
          height={88}
          className="w-16 sm:w-20"
          priority
        />
      </Link>

      <Link
        href="/eventtickets"
        aria-label="Tickets kaufen"
        className="fixed right-10 top-10 z-50 flex h-[46px] w-[46px] items-center justify-center rounded-full bg-accent-lime text-black shadow-[0_4px_20px_rgba(185,206,173,0.4)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-105"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
      </Link>

      <div
        style={{
          clipPath: open
            ? `circle(150% at ${origin.x}px ${origin.y}px)`
            : `circle(0% at ${origin.x}px ${origin.y}px)`,
        }}
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-foreground transition-[clip-path] duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col items-center gap-5 overflow-y-auto transition-opacity duration-300 ${
            open ? "opacity-100 delay-300" : "opacity-0"
          }`}
        >
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
                style={open ? { animationDelay: `${300 + i * 40}ms` } : undefined}
                className={`${
                  open ? "animate-menu-item-in" : ""
                } text-2xl font-black uppercase tracking-tight sm:text-4xl ${
                  active
                    ? "text-accent-lime underline decoration-2 underline-offset-4"
                    : "text-background"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-5 left-5 z-30">
        <ThemeToggle />
      </div>
    </>
  );
}
