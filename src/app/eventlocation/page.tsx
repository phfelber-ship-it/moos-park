import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import { getAllRoomImages } from "@/lib/room-images";
import RoomRows from "@/components/RoomRows";
import EventlocationRequestForm from "@/components/EventlocationRequestForm";
import FlipText from "@/components/FlipText";
import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import ForceLightTheme from "@/components/ForceLightTheme";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

export const metadata = {
  alternates: { canonical: "/eventlocation" },
  title: "Eventlocation Pöttmes – Veranstaltungslocation Bayern | moos.park",
  description:
    "Eventlocation in Pöttmes für bis zu 2300 Gäste – sieben kombinierbare Räume für Konzerte, Firmenfeiern, Hochzeiten und private Feiern.",
  openGraph: {
    title: "Eventlocation Pöttmes | moos.park",
    description:
      "Bis zu 2300 Gäste, sieben kombinierbare Räume, eigene Gastronomie und Technik. Eventlocation zwischen Augsburg und Ingolstadt.",
    url: "/eventlocation",
    type: "website",
    locale: "de_DE",
    images: ["/images/eventlocation-hero.png"],
  },
};

const FAQ = [
  {
    q: "Wie viele Gäste passen in die Location?",
    a: "Bis zu 2300 Gäste im gesamten Haus, inklusive Terrasse. Einzelne Räume fassen je nach Raum 80 bis 750 Personen (stehend), mehrere Räume sind kombinierbar. Die Bestuhlung planen wir individuell nach Ihrem Wunsch.",
  },
  {
    q: "Für welche Anlässe kann ich die Location mieten?",
    a: "Für Geburtstage und Privatfeiern, Firmenevents, Sommerfeste und Weihnachtsfeiern, Seminare, Coaching, Teamevents, Konzerte und Messen.",
  },
  {
    q: "Ist eine exklusive Buchung der gesamten Location möglich?",
    a: "Ja. moos.park kann komplett exklusiv gebucht werden, ohne parallel stattfindende Events.",
  },
  {
    q: "Was ist bei der Miete inklusive?",
    a: "Licht- und Tontechnik, Bühne, eigene Gastronomie (Bar, Buffet, Pizzeria), großer kostenloser Parkplatz und ein persönlicher Ansprechpartner für die gesamte Planung.",
  },
  {
    q: "Wie finde ich zum moos.park?",
    a: "Der moos.park liegt in Pöttmes im Landkreis Aichach-Friedberg, rund 40 Minuten von Augsburg und ca. 35 Minuten von Ingolstadt entfernt.",
  },
  {
    q: "Wie schnell bekomme ich ein Angebot?",
    a: "Wir bearbeiten Anfragen schnell und melden uns mit einem individuellen, unverbindlichen Angebot. Die Anfrage ist kostenlos.",
  },
];

const OCCASIONS = [
  {
    title: "Geburtstage & Privatfeiern",
    text: "Vom runden Geburtstag bis zur privaten Feier: Räume, Technik und Gastronomie an einem Ort.",
    href: "#anfragen",
    cta: "Jetzt anfragen",
  },
  {
    title: "Firmenevents, Sommerfest und Weihnachtsfeiern",
    text: "Betriebsfeier, Kick-off oder Weihnachtsfeier: Planung, Technik und Gastronomie aus einer Hand.",
    href: "#anfragen",
    cta: "Jetzt anfragen",
  },
  {
    title: "Seminar, Coaching, Teamevents & Teambuilding",
    text: "Räume für Gruppen, Workshops und Teamtage, mit eigener Gastronomie vor Ort.",
    href: "#anfragen",
    cta: "Jetzt anfragen",
  },
  {
    title: "Konzerte & Messen",
    text: "Konzerte, Messen und größere Veranstaltungen: Bühne, Licht- und Tontechnik sind vorhanden.",
    href: "#anfragen",
    cta: "Jetzt anfragen",
  },
];

const ADVANTAGES = [
  "Eigene Gastronomie: Menü, Buffet, Bar und Pizzeria",
  "Bühne, Licht- und Tontechnik sind vorhanden",
  "Großer kostenloser Parkplatz",
  "Räume einzeln oder kombiniert mietbar",
  "Exklusivbuchung der gesamten Location möglich",
  "Ein Ansprechpartner von der Planung bis zum Abschluss",
  "Schnelle Angebotsbearbeitung, kostenlos und unverbindlich",
];

const FACTS = [
  { value: "2200 m²", label: "Hausfläche" },
  { value: "7", label: "Räume" },
  { value: "1", label: "Location" },
  { value: "∞", label: "Unzählige Möglichkeiten" },
];

export default async function EventlocationPage() {
  const roomImages = await getAllRoomImages();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const venueJsonLd = {
    "@context": "https://schema.org",
    "@type": ["EventVenue", "LocalBusiness"],
    "@id": `${SITE_URL}/eventlocation#venue`,
    name: "moos.park Eventlocation",
    description:
      "Eventlocation in Pöttmes mit sieben kombinierbaren Räumen, eigener Gastronomie und Veranstaltungstechnik für Firmenevents, Feiern, Konzerte und Messen.",
    url: `${SITE_URL}/eventlocation`,
    image: `${SITE_URL}/images/eventlocation-hero.png`,
    maximumAttendeeCapacity: 2300,
    telephone: "+49 8253 7576",
    email: "kontakt@moos-park.de",
    sameAs: [
      "https://www.facebook.com/mp.poettmes",
      "https://www.instagram.com/moos.park/",
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: 48.586268,
      longitude: 11.10787,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rudolf-Diesel-Straße 23",
      postalCode: "86554",
      addressLocality: "Pöttmes",
      addressRegion: "Bayern",
      addressCountry: "DE",
    },
    amenityFeature: [
      "Bühne",
      "Licht- und Tontechnik",
      "Eigene Gastronomie",
      "Kostenloser Parkplatz",
      "Garderobe",
    ].map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    containsPlace: ROOMS.map((room) => ({
      "@type": "Room",
      name: room.name,
      description: room.text,
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Eventlocation",
        item: `${SITE_URL}/eventlocation`,
      },
    ],
  };

  return (
    <div>
      <ForceLightTheme />
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.setAttribute('data-theme','light')",
        }}
      />
      {[faqJsonLd, venueJsonLd, breadcrumbJsonLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}

      {/* 1. Hero mit Hintergrundbild */}
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

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-12">
          <h1 className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Jede Idee braucht den passenden Raum
          </h1>

          <div className="mt-8 inline-flex rounded-lg bg-black/70 p-1 backdrop-blur">
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

      {/* 2. Beschreibung der Location */}
      <section className="px-6 py-20 text-center lg:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black uppercase leading-[1.05] text-foreground sm:text-4xl lg:text-5xl">
            Die Eventlocation für einzigartige Momente.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70">
            Der <strong>moos.park in Pöttmes</strong> – wo Erlebnis auf
            Atmosphäre trifft. Mit seinem modernen Industrieflair und einer
            Ausstattung für unterschiedlichste Anlässe bietet der moos.park den
            Rahmen für{" "}
            <strong>
              Firmenveranstaltungen, Präsentationen, Hochzeiten oder private
              Events
            </strong>
            .
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Dank <strong>variabler Raumkonzepte</strong>, neuester
            Eventtechnik und einem engagierten Team wird jedes Event zu einem
            individuellen Erlebnis. Von der ersten Idee bis zur letzten Minute
            begleiten wir Sie mit Leidenschaft und Präzision –{" "}
            <strong>alles aus einer Hand.</strong>
          </p>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Ob stilvoll, außergewöhnlich oder ganz nach Ihren Vorstellungen –
            im <strong>moos.park Pöttmes</strong> entstehen Momente, die
            bleiben.
          </p>

          <a
            href="#anfragen"
            className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Unvergesslich werden" />
          </a>
        </div>
      </section>

      {/* 3. Eventlocation in Zahlen (ohne Raumbilder) */}
      <section className="bg-foreground/[0.02] px-6 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#5f7a50]">
              Eventlocation
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {FACTS.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.06}>
                <p className="whitespace-nowrap text-4xl font-black text-foreground sm:text-5xl">
                  {fact.value}
                </p>
                <p className="mt-2 text-sm font-bold uppercase tracking-wide text-foreground/60">
                  {fact.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vorteile */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#5f7a50]">
              Ihre Vorteile
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-4xl">
              Alles an einem Ort.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
              {ADVANTAGES.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 text-sm text-foreground/80"
                >
                  <span className="mt-0.5 text-[#5f7a50]">✔</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* 5. Möglichkeiten / Anlässe */}
      <section id="anlaesse" className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#5f7a50]">
              Möglichkeiten
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-4xl">
              Für jeden Anlass die passende Veranstaltung.
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4">
            {OCCASIONS.map((o, i) => (
              <Reveal key={o.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-foreground/10 p-6">
                  <h3 className="font-black uppercase text-foreground">
                    {o.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-foreground/70">
                    {o.text}
                  </p>
                  <Link
                    href={o.href}
                    className="mt-4 text-xs font-black uppercase tracking-wide text-[#5f7a50]"
                  >
                    {o.cta} →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Unsere Bereiche */}
      <section id="raeume" className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-4xl">
            Unsere Bereiche
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Ob einzelne Bereiche, flexible Kombinationen oder die gesamte
            Anlage.
          </p>
        </div>

        <RoomRows
          rooms={ROOMS.map((room) => ({
            ...room,
            images: roomImages[room.slug] ?? room.images,
          }))}
        />
      </section>

      {/* 7. Karte */}
      <section id="anfahrt" className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#5f7a50]">
              Anfahrt
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-4xl">
              So finden Sie uns.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
              Rudolf-Diesel-Straße 23, 86554 Pöttmes. Rund 40 Minuten von
              Augsburg und ca. 35 Minuten von Ingolstadt.
            </p>
          </Reveal>
          <div className="mt-8 overflow-hidden rounded-2xl border border-foreground/10">
            <iframe
              title="Karte: moos.park, Rudolf-Diesel-Straße 23, 86554 Pöttmes"
              src="https://www.google.com/maps?q=Rudolf-Diesel-Stra%C3%9Fe+23,+86554+P%C3%B6ttmes&output=embed"
              className="h-[380px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="px-6 py-20 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-[#5f7a50]">
              Häufige Fragen
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-center text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-4xl">
              Alles, was Sie wissen möchten.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8">
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </section>

      {/* 9. Anfrage */}
      <section id="anfragen" className="px-6 pb-28">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-12">
          <p className="text-sm font-bold uppercase tracking-wide text-[#5f7a50]">
            Ihr Event, unsere Beratung.
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-4xl">
            Ganz unverbindlich anfragen.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/70">
            Ihre Idee sind unser Antrieb. Melden Sie sich bei uns und wir
            setzen Ihre Pläne um. Los geht&apos;s!
          </p>

          <EventlocationRequestForm />
        </div>
      </section>
    </div>
  );
}
