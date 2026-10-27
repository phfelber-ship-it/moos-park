import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import { getAllRoomImages } from "@/lib/room-images";
import RoomImageRotator from "@/components/RoomImageRotator";
import EventlocationRequestForm from "@/components/EventlocationRequestForm";
import FlipText from "@/components/FlipText";

export const metadata = {
  alternates: { canonical: "/eventlocation" },
  title: "Eventlocation Pöttmes – Veranstaltungslocation Bayern | moos.park",
  description:
    "Eventlocation in Pöttmes für bis zu 2200 Gäste – sechs kombinierbare Räume für Konzerte, Firmenfeiern, Hochzeiten und private Feiern.",
};

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0 2c-4.4 0-9 2.2-9 5v3h18v-3c0-2.8-4.6-5-9-5" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default async function EventlocationPage() {
  const roomImages = await getAllRoomImages();
  return (
    <div>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden text-center text-white sm:min-h-[85vh]">
        <Image
          src="/images/eventlocation-hero.png"
          alt="Leere Haupthalle im moos.park mit Bar, Tanzfläche und bunter Bühnenbeleuchtung"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-10">
          <h1 className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            Jede Idee verdient die perfekte Bühne
          </h1>

          <div className="mt-8 flex justify-center gap-12 sm:gap-20">
            <div>
              <p className="text-4xl font-black sm:text-5xl">2200</p>
              <p className="mt-1 max-w-[10rem] text-sm text-white/80">
                QM Eventfläche, Exclusive Ausstattung
              </p>
            </div>
            <div>
              <p className="text-4xl font-black sm:text-5xl">92%</p>
              <p className="mt-1 max-w-[10rem] text-sm text-white/80">
                der Fachleute erleben Marken positiver durch Live-Events.
              </p>
            </div>
          </div>

          <div className="mt-8 inline-flex rounded-lg bg-black/30 p-1 backdrop-blur">
            <Link
              href="/"
              className="rounded-lg px-5 py-2 text-xs font-black uppercase tracking-wide text-white"
            >
              Club
            </Link>
            <span className="rounded-lg bg-white px-5 py-2 text-xs font-black uppercase tracking-wide text-black">
              Eventlocation
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-black uppercase text-foreground">
            Die Eventlocation für einzigartige Momente.
          </h2>
          <p className="mt-6 text-foreground/70">
            Der <strong>moos.park in Pöttmes</strong> – wo Erlebnis auf
            Atmosphäre trifft. Mit seinem modernen Industrieflair und einer
            Ausstattung auf höchstem Niveau bietet der moos.park den idealen
            Rahmen für{" "}
            <strong>
              Firmenveranstaltungen, Präsentationen, Hochzeiten oder private
              Events
            </strong>
            .
          </p>
          <p className="mt-4 text-foreground/70">
            Dank <strong>variabler Raumkonzepte</strong>, neuester
            Eventtechnik und einem engagierten Team wird jedes Event zu einem
            individuellen Erlebnis. Von der ersten Idee bis zur letzten Minute
            begleiten wir Sie mit Leidenschaft und Präzision –{" "}
            <strong>alles aus einer Hand.</strong>
          </p>
          <p className="mt-4 text-foreground/70">
            Ob stilvoll, außergewöhnlich oder ganz nach Ihren Vorstellungen –
            im <strong>moos.park Pöttmes</strong> entstehen Momente, die
            bleiben.
          </p>
          <p className="mt-4 text-foreground/70">
            Eine <strong>Location voller Möglichkeiten</strong>, perfekt für
            alle, die mehr als nur einen Veranstaltungsort suchen.
          </p>

          <a
            href="#raeume"
            className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Unvergesslich werden" />
          </a>
        </div>
      </section>

      <section id="raeume" className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-black uppercase text-foreground">
            Unsere Räume
          </h2>
          <p className="mt-4 text-foreground/70">
            Ob einzelne Bereiche, flexible Kombinationen oder die gesamte
            Anlage:
          </p>
          <p className="mt-4 text-foreground/70">
            Nutzen Sie unser vielseitiges Raumkonzept mit{" "}
            <strong>2200 m² Eventfläche</strong> inklusive neuer{" "}
            <strong>460 m² Sonnen-Terrasse</strong>. Auf einer Gesamtfläche
            von <strong>10.000 m²</strong> – ideal für Events jeder Art.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ROOMS.map((room) => (
            <div
              key={room.name}
              className="flex flex-col items-center rounded-2xl bg-foreground/[0.03] p-4 text-center"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-foreground/5">
                <RoomImageRotator
                  images={roomImages[room.slug] ?? room.images}
                  alt={room.name}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>

              <div className="mt-5 flex items-center gap-4 text-sm font-semibold text-foreground/70">
                <span className="flex items-center gap-1.5">
                  <PersonIcon />
                  {room.capacity}
                </span>
                <span className="h-5 w-px bg-foreground/15" />
                <span className="flex items-center gap-1.5">
                  <AreaIcon />
                  {room.area}
                </span>
              </div>

              <h3 className="mt-3 text-lg font-black uppercase text-foreground">
                {room.name}
              </h3>
              <p className="mt-3 text-sm text-foreground/70">{room.text}</p>

              <a
                href="#anfragen"
                className="mt-5 inline-block rounded-lg bg-accent-lime px-8 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
              >
                Anfragen
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="anfragen" className="px-6 pb-28">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-12">
          <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
            Ihr Event, unsere Beratung.
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase text-foreground">
            Ganz unverbindlich anfragen.
          </h2>
          <p className="mt-4 text-foreground/70">
            Ihre Idee sind unser Antrieb. Melden Sie sich bei uns und wir
            verwandeln Ihre Pläne in unvergessliche Erlebnisse. Los geht&apos;s!
          </p>

          <EventlocationRequestForm />
        </div>
      </section>
    </div>
  );
}
