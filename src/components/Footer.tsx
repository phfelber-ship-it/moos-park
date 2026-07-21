import Link from "next/link";
import Image from "next/image";

const SOCIALS = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    icon: (
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" />
    ),
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: (
      <path d="M12 2c-2.7 0-3.1 0-4.2.1-1.1 0-1.8.2-2.5.5-.7.3-1.3.6-1.8 1.2-.6.5-.9 1.1-1.2 1.8-.3.7-.5 1.4-.5 2.5C1.7 9.2 1.7 9.6 1.7 12.3s0 3.1.1 4.2c0 1.1.2 1.8.5 2.5.3.7.6 1.3 1.2 1.8.5.6 1.1.9 1.8 1.2.7.3 1.4.5 2.5.5 1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1c1.1 0 1.8-.2 2.5-.5.7-.3 1.3-.6 1.8-1.2.6-.5.9-1.1 1.2-1.8.3-.7.5-1.4.5-2.5.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2c0-1.1-.2-1.8-.5-2.5-.3-.7-.6-1.3-1.2-1.8-.5-.6-1.1-.9-1.8-1.2-.7-.3-1.4-.5-2.5-.5C15.1 2 14.7 2 12 2m0 1.8c2.6 0 3 0 4 .1 1 0 1.5.2 1.9.3.5.2.8.4 1.1.8.4.3.6.6.8 1.1.2.4.3.9.3 1.9.1 1 .1 1.4.1 4s0 3-.1 4c0 1-.2 1.5-.3 1.9-.2.5-.4.8-.8 1.1-.3.4-.6.6-1.1.8-.4.2-.9.3-1.9.3-1 .1-1.4.1-4 .1s-3 0-4-.1c-1 0-1.5-.2-1.9-.3-.5-.2-.8-.4-1.1-.8-.4-.3-.6-.6-.8-1.1-.2-.4-.3-.9-.3-1.9-.1-1-.1-1.4-.1-4s0-3 .1-4c0-1 .2-1.5.3-1.9.2-.5.4-.8.8-1.1.3-.4.6-.6 1.1-.8.4-.2.9-.3 1.9-.3 1-.1 1.4-.1 4-.1M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4m5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0" />
    ),
  },
];

const APP_LINKS = [
  {
    href: "https://www.apple.com/app-store/",
    label: "App Store",
    icon: (
      <path d="M16.5 1.5c.1 1-.3 2-1 2.7-.6.7-1.7 1.3-2.6 1.2-.1-1 .3-2 1-2.7.6-.7 1.8-1.2 2.6-1.2M19 17.4c-.4.9-.9 1.8-1.6 2.6-1 1.1-2 2.3-3.4 2.3-1.4 0-1.7-.8-3.3-.8-1.6 0-2 .8-3.3.9-1.4 0-2.5-1.3-3.4-2.4-1.9-2.4-3.3-6.8-1.4-9.8.9-1.5 2.6-2.5 4.4-2.5 1.4 0 2.7.9 3.3.9.7 0 2.2-1.1 3.8-1 .6 0 2.5.3 3.7 2-3 1.9-2.6 5.7.2 6.9" />
    ),
  },
  {
    href: "https://play.google.com/store",
    label: "Google Play",
    icon: (
      <path d="M4.5 2.6a1.2 1.2 0 0 0-.5 1v16.8c0 .4.2.8.5 1l9.4-9.4zm11 9.4-2.3 2.3 2.3 2.3 4-2.3c.5-.3.8-.8.8-1.4 0-.5-.3-1-.8-1.3l-4-2.3zm-1.4-1.4L5.4 2 16.6 8.4zm0 2.8L5.4 22l11.2-6.4z" />
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-foreground/8 bg-foreground/[0.02] px-6 py-16 text-center">
      <div className="mx-auto max-w-3xl">
        <Image
          src="/images/logo.png"
          alt="moos.park – Dein Hotspot für Tag und Nacht"
          width={96}
          height={96}
          className="mx-auto w-20"
        />

        <p className="mt-6 text-lg font-black uppercase text-foreground">
          Deine Eventlocation seit 1994.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                {s.icon}
              </svg>
            </a>
          ))}
          {APP_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                {s.icon}
              </svg>
            </a>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-foreground/60">
          <Link href="/impressum" className="hover:text-foreground">
            Impressum
          </Link>
          <span>·</span>
          <Link href="/datenschutz" className="hover:text-foreground">
            Datenschutz
          </Link>
          <span>·</span>
          <Link href="/agb" className="hover:text-foreground">
            AGB
          </Link>
        </div>

        <p className="mt-6 text-xs text-foreground/40">
          © moos-park Gastronomie GmbH {new Date().getFullYear()}. Alle
          Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
