import Link from "next/link";
import Image from "next/image";
import { getEvents, getGalleries } from "@/lib/clubscale";
import EventsExplorer from "@/components/EventsExplorer";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import AppPhoneReveal from "@/components/AppPhoneReveal";

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

function formatGalleryDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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
  const galleries = (await getGalleries()).slice(0, 4);

  return (
    <div>
      <Hero />

      <div className="overflow-hidden bg-accent-lime py-3">
        <div className="flex animate-marquee gap-8 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map(
            (item, i) => (
              <span
                key={i}
                className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-black"
              >
                <span>✔</span> {item}
              </span>
            )
          )}
        </div>
      </div>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
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
              Alle Events ansehen
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="text-center text-3xl font-black uppercase text-foreground sm:text-4xl">
              Galerie
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-foreground/60">
              Manche Momente brauchen keine Worte – nur das richtige Bild.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {galleries.map((gallery, i) => {
              const cover = gallery.coverMediaObjects[0]?.thumbnail?.presignedURL;
              return (
                <Reveal key={gallery.id} delay={i * 0.08}>
                  <Link
                    href={`/bilder/${gallery.id}`}
                    className="group block overflow-hidden rounded-xl border border-foreground/8 bg-foreground/[0.025] transition-colors hover:border-accent-lime/40"
                  >
                    <div className="relative aspect-[4/3] w-full bg-foreground/5">
                      {cover && (
                        <Image
                          src={cover}
                          alt={gallery.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-black uppercase leading-tight text-foreground line-clamp-2">
                        {gallery.name}
                      </h3>
                      <p className="mt-1 text-xs text-foreground/50">
                        {formatGalleryDate(gallery.date)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2} className="mt-12 text-center">
            <Link
              href="/bilder"
              className="inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              Alle Galerien ansehen
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-24 text-center">
        <Reveal direction="scale">
          <h2 className="text-2xl font-black uppercase text-foreground sm:text-3xl">
            Tanz Nächte
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/60">
            &bdquo;Jeden 2. und 4. Freitag im Monat. Tanzbare Musik, gute
            Stimmung und echte Emotionen.&ldquo;
          </p>
          <Link
            href="/tanzabend"
            className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            Alle Tanztermine ansehen
          </Link>
        </Reveal>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-foreground text-background">
          <div className="grid items-center gap-10 px-8 py-14 sm:px-14 sm:py-16 lg:grid-cols-2 lg:gap-16">
            <AppPhoneReveal />

            <Reveal direction="right" className="order-1 lg:order-2">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
                moos.park App
              </p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-[1.05] sm:text-4xl">
                Deine Nacht. Deine App.
              </h2>
              <p className="mt-5 max-w-md text-background/70">
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
                App laden
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

      <section className="px-6 py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
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

        <Reveal
          direction="scale"
          delay={0.15}
          className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/gallery-1.jpg"
            alt="moos.park"
            fill
            className="object-cover"
            sizes="(min-width: 640px) 400px, 100vw"
          />
        </Reveal>
      </section>

      <section className="px-6 pb-24">
        <Reveal
          direction="left"
          className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl"
        >
          <Image
            src="/images/gallery-2.jpg"
            alt="moos.park"
            fill
            className="object-cover grayscale"
            sizes="(min-width: 640px) 400px, 100vw"
          />
        </Reveal>

        <Reveal
          direction="right"
          delay={0.1}
          className="mx-auto mt-10 max-w-2xl text-center"
        >
          <h2 className="text-3xl font-black uppercase text-foreground">
            Raum für mehr.
          </h2>
          <p className="mt-6 text-foreground/70">
            Mit wachsendem Bedarf an professionellen Veranstaltungsflächen
            wurde der moos.park kontinuierlich erweitert. Heute bieten wir:
          </p>
          <ul className="mx-auto mt-6 max-w-md list-disc space-y-3 pl-5 text-left text-foreground/70">
            <li>Mehrere individuell nutzbare Eventbereiche</li>
            <li>Eine stilvolle Terrasse mit Platz für Outdoor-Events</li>
            <li>Eine hauseigene Pizzeria für kulinarische Vielfalt</li>
            <li>
              Voll ausgestattete Techniklösungen für Business-Events und
              Kultur
            </li>
            <li>Backstage- und Produktionsflächen für Künstler &amp; Veranstalter</li>
          </ul>
        </Reveal>
      </section>
    </div>
  );
}
