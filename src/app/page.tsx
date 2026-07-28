import Link from "next/link";
import Image from "next/image";
import { getEvents, getGalleries } from "@/lib/clubscale";
import EventsExplorer from "@/components/EventsExplorer";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import AppPhoneReveal from "@/components/AppPhoneReveal";
import FanGallery from "@/components/FanGallery";
import FlipText from "@/components/FlipText";
import GalleryCard from "@/components/GalleryCard";
import RoomsShowcase from "@/components/RoomsShowcase";

function TicketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
  );
}

function CouponIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6h10a2 2 0 0 1 2 2v3a2 2 0 0 0 0 2v3a2 2 0 0 1-2 2H9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 4 4 12l5 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 10h16M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TICKER_ITEMS = [
  "Musik",
  "Eventlocation",
  "Kultur",
  "Festival",
  "Unvergessliche Events",
  "Tagungen",
  "Raum für mehr",
];

export default async function Home() {
  const events = await getEvents();
  const allGalleries = await getGalleries();
  const galleries = allGalleries.slice(0, 4);
  const heroImages = Array.from(
    { length: 11 },
    (_, i) => `/images/hero-fan-${i + 1}.jpg`
  );
  const fanPhotos = Array.from({ length: 11 }, (_, i) => ({
    src: `/images/fan-${i + 1}.jpg`,
    alt: "moos.park",
  }));

  return (
    <div>
      <Hero images={heroImages} />

      <div className="overflow-hidden bg-accent-lime py-3">
        <div className="flex animate-marquee gap-8 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-black"
              >
                <span className="inline-block animate-spin-slow">✔</span> {item}
              </span>
            )
          )}
        </div>
      </div>

      <section className="flex min-h-[720px] items-center px-6 py-24">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl font-black uppercase text-foreground sm:text-4xl">
              Kommende Events
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <EventsExplorer events={events} limit={3} columns={3} />
          </Reveal>

          <Reveal delay={0.2} className="mt-12 text-center">
            <Link
              href="/events"
              className="inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              <FlipText text="Alle Events ansehen" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-32 text-center">
        <Image
          src="/images/tanzabend-banner.png"
          alt="Tanz Nächte"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

        <Reveal direction="scale" className="relative">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
            Jeden 2. &amp; 4. Freitag im Monat
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.95] text-white sm:text-6xl">
            Tanz Nächte
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/70">
            &bdquo;Tanzbare Musik, gute Stimmung und echte Emotionen.&ldquo;
          </p>
          <Link
            href="/tanzveranstaltungen"
            className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Alle Tanztermine ansehen" />
          </Link>
        </Reveal>
      </section>

      <section className="flex min-h-[720px] items-center px-6 py-24">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl font-black uppercase text-foreground sm:text-4xl">
              Galerie
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-foreground/60">
              Jede Nacht ihre eigene Geschichte – stöbere durch unsere Fotos.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {galleries.map((gallery, i) => (
              <Reveal key={gallery.id} delay={i * 0.08}>
                <GalleryCard gallery={gallery} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-12 text-center">
            <Link
              href="/galerie"
              className="inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              <FlipText text="Alle Galerien ansehen" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="flex min-h-[720px] items-center px-6 py-24">
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <AppPhoneReveal />

            <Reveal direction="right" className="order-1 lg:order-2">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
                moos.park App
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-[1.05] sm:text-4xl">
                Deine Nacht. Deine App.
              </h2>
              <p className="mt-5 max-w-md text-foreground/70">
                Tickets kaufen, Tisch reservieren und Coupons einlösen – alles
                an einem Ort. Nie wieder eine Party verpassen.
              </p>

              <div className="mt-8 grid grid-cols-3 gap-4 max-w-sm">
                {[
                  { label: "Tickets", icon: TicketIcon },
                  { label: "Coupons", icon: CouponIcon },
                  { label: "Reservierung", icon: CalendarIcon },
                ].map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <Icon />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
              >
                <FlipText text="App laden" />
              </a>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href="https://www.apple.com/app-store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 transition-opacity hover:opacity-100"
                >
                  <Image
                    src="/images/appstore.png"
                    alt="App Store"
                    width={120}
                    height={33}
                  />
                </a>
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-70 transition-opacity hover:opacity-100"
                >
                  <Image
                    src="/images/googleplay.png"
                    alt="Google Play"
                    width={120}
                    height={34}
                  />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="flex min-h-[720px] flex-col justify-center px-6 py-24">
        <Reveal className="mx-auto w-full min-w-0 max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-wide text-accent-lime">
            moos.park
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase text-foreground">
            Mehr als eine Eventlocation.
          </h2>
          <p className="mt-6 text-foreground/70">
            Seit 1994 steht unser Haus für musikalische Highlights,
            unvergessliche Events und eine besondere Atmosphäre, die
            verbindet. Was damals als Club mit Charakter begann, hat sich
            längst zu einer der vielseitigsten Locations in Süddeutschland
            entwickelt: ein Raum für Kultur, Konzerte, Corporate-Events und
            Clubnächte – mit Seele und Substanz.
          </p>
        </Reveal>

        <FanGallery photos={fanPhotos} />
      </section>

      <section className="flex min-h-[720px] items-center px-6 py-24">
        <div className="mx-auto w-full min-w-0 max-w-5xl">
          <Reveal>
            <RoomsShowcase />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
