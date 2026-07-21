import Link from "next/link";
import Image from "next/image";
import { getEvents } from "@/lib/clubscale";
import EventsExplorer from "@/components/EventsExplorer";

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

  return (
    <div>
      <section className="relative flex min-h-[75vh] items-end overflow-hidden text-center text-white sm:min-h-[90vh]">
        <Image
          src="/images/hero-bg.jpg"
          alt="moos.park"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

        <div className="absolute left-1/2 top-16 z-10 w-24 -translate-x-1/2">
          <Image
            src="/images/logo.png"
            alt="moos.park – Dein Hotspot für Tag und Nacht"
            width={96}
            height={96}
            className="w-full"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 pb-10">
          <h1 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Deine Freiheit
            <br />
            beginnt hier – im moos.park
          </h1>

          <div className="mt-8 flex justify-center gap-12 sm:gap-20">
            <div>
              <p className="text-4xl font-black sm:text-5xl">2200</p>
              <p className="mt-1 max-w-[10rem] text-sm text-white/80">
                QM Eventfläche, Exclusive Ausstattung
              </p>
            </div>
            <div>
              <p className="text-4xl font-black sm:text-5xl">100%</p>
              <p className="mt-1 max-w-[10rem] text-sm text-white/80">
                Spaß. Für jede Altersklasse.
              </p>
            </div>
          </div>

          <div className="mt-8 inline-flex rounded-full bg-black/30 p-1 backdrop-blur">
            <span className="rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-wide text-black">
              Club
            </span>
            <Link
              href="/eventlocation"
              className="rounded-full px-5 py-2 text-xs font-black uppercase tracking-wide text-white"
            >
              Eventlocation
            </Link>
          </div>
        </div>
      </section>

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
          <h2 className="text-center text-3xl font-black uppercase text-foreground sm:text-4xl">
            Kommende Events
          </h2>

          <div className="mt-12">
            <EventsExplorer events={events} limit={4} />
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/events"
              className="inline-block rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              Alle Events ansehen
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-24 text-center">
        <h2 className="text-2xl font-black uppercase text-foreground sm:text-3xl">
          Tanz Nächte
        </h2>
        <p className="mx-auto mt-4 max-w-md text-foreground/60">
          &bdquo;Jeden 2. und 4. Freitag im Monat. Tanzbare Musik, gute
          Stimmung und echte Emotionen.&ldquo;
        </p>
        <Link
          href="/tanzabend"
          className="mt-8 inline-block rounded-full bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Alle Tanztermine ansehen
        </Link>
      </section>

      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-black uppercase leading-tight text-foreground">
            &bdquo;App drauf – mehr drin.&ldquo;
          </h2>
          <p className="mt-4 text-foreground/60">
            Exklusive Specials, Aktionen &amp; Überraschungen – nur in der
            moos.park App.
          </p>

          <ul className="mx-auto mt-6 inline-flex flex-col gap-2 text-left font-semibold text-accent-lime">
            <li>› Coupons &amp; Vorteile</li>
            <li>› Alle Events</li>
            <li>› Tickets &amp; Reservierungen</li>
            <li>› Kundenkarte</li>
            <li>› News &amp; Updates</li>
          </ul>

          <div className="mt-8 flex justify-center gap-4">
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/appstore.png"
                alt="App Store"
                width={150}
                height={41}
              />
            </a>
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/images/googleplay.png"
                alt="Google Play"
                width={150}
                height={42}
              />
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-12 aspect-[1454/2560] w-full max-w-xs">
          <Image
            src="/images/hero-home.jpg"
            alt="moos.park App"
            fill
            className="object-contain"
            sizes="400px"
          />
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
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
        </div>

        <div className="relative mx-auto mt-10 aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl">
          <Image
            src="/images/gallery-1.jpg"
            alt="moos.park"
            fill
            className="object-cover"
            sizes="(min-width: 640px) 400px, 100vw"
          />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl">
          <Image
            src="/images/gallery-2.jpg"
            alt="moos.park"
            fill
            className="object-cover grayscale"
            sizes="(min-width: 640px) 400px, 100vw"
          />
        </div>

        <div className="mx-auto mt-10 max-w-2xl text-center">
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
        </div>
      </section>
    </div>
  );
}
