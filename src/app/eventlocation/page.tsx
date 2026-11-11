import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import { getAllRoomImages } from "@/lib/room-images";
import RoomRows from "@/components/RoomRows";
import EventlocationRequestForm from "@/components/EventlocationRequestForm";
import FlipText from "@/components/FlipText";
import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";

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
  "Große Bühne für Ihr Programm",
  "Sonnenterrasse für Events unter freiem Himmel",
  "Professionelle Licht- und Tontechnik",
  "WLAN für Ihre Gäste",
  "Fest eingebaute Theken",
  "Pizzeria im Haus",
  "Kostenlose Parkplätze direkt am Haus",
  "Garderobe direkt im Foyer",
  "Räume einzeln oder kombiniert buchbar",
  "Ein fester Ansprechpartner für Ihr Event",
];

const EXTRAS = [
  "Foto und Video",
  "Live-Show",
  "Künstler und Acts",
  "DJ",
  "Werbung und Promotion für Ihr Event",
  "Weitere Extras auf Anfrage",
];

const FACTS = [
  { value: "2200 m²", label: "Hausfläche" },
  { value: "7", label: "Räume" },
  { value: "1", label: "Location" },
  { value: "∞", label: "Unzählige Möglichkeiten" },
];

// Einheitlicher Container: links Überschrift und Text, rechts der Inhalt.
function SplitCard({
  id,
  accent = false,
  label,
  title,
  text,
  children,
}: {
  id?: string;
  accent?: boolean;
  label: string;
  title: string;
  text?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-4 lg:py-5">
      <Reveal>
        <div
          className={`mx-auto grid max-w-[77rem] gap-8 rounded-3xl border p-8 sm:p-10 lg:grid-cols-[5fr_7fr] lg:gap-14 lg:p-14 ${
            accent
              ? "border-accent-lime/30 bg-accent-lime/[0.06]"
              : "border-foreground/10 bg-foreground/[0.03]"
          }`}
        >
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-black uppercase font-mono tracking-[0.2em] text-accent-lime">
              {label}
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-5xl">
              {title}
            </h2>
            {text && (
              <div className="mt-5 text-base leading-relaxed text-foreground/60 lg:text-lg">{text}</div>
            )}
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </Reveal>
    </section>
  );
}

function DotList({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-3 border-b border-foreground/10 py-3.5 text-foreground/80 first:pt-0 last:border-b-0"
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-accent-lime" />
          {item}
        </li>
      ))}
    </ul>
  );
}

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

        <div className="relative z-10 mx-auto max-w-[77rem] px-6 pb-12">
          <h1 className="text-3xl font-black uppercase leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            Jede Idee braucht den passenden Raum
          </h1>

          <div className="mt-8 inline-flex rounded-full bg-black/70 p-1 backdrop-blur">
            <Link
              href="/"
              className="rounded-full px-5 py-2 text-xs font-black uppercase tracking-wide text-white"
            >
              Club
            </Link>
            <span className="rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-wide text-black">
              Eventlocation
            </span>
          </div>
        </div>
      </section>

      {/* 2. Beschreibung der Location */}
      <section className="px-6 py-20 text-center lg:py-28">
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
            className="mt-8 inline-block rounded-full bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Unvergesslich werden" />
          </a>
        </div>
      </section>

      {/* 3. Eventlocation in Zahlen (ohne Raumbilder) */}
      <section className="bg-foreground/[0.02] px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-[77rem]">
          <Reveal>
            <p className="text-center text-xs font-black uppercase font-mono tracking-[0.2em] text-accent-lime">
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
      <SplitCard
        label="Ihre Vorteile"
        title="Alles, was Ihr Event braucht."
        text={
          <p>
            Das Wichtige ist schon im Haus. Sie sprechen mit einem
            Ansprechpartner und müssen keine Dienstleister einzeln
            koordinieren.
          </p>
        }
      >
        <DotList items={ADVANTAGES} />
      </SplitCard>

      {/* 5. Möglichkeiten / Anlässe */}
      <section id="anlaesse" className="bg-foreground/[0.02] px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-[77rem]">
          <Reveal>
            <p className="text-center text-xs font-black uppercase font-mono tracking-[0.2em] text-accent-lime">
              Möglichkeiten
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-5xl">
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
                    className="mt-4 text-xs font-black uppercase tracking-wide text-accent-lime"
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
      <section id="raeume" className="px-6 py-20 text-center lg:py-28">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-5xl">
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
      <section id="anfahrt" className="bg-foreground/[0.02] px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-[77rem]">
          <Reveal>
            <p className="text-center text-xs font-black uppercase font-mono tracking-[0.2em] text-accent-lime">
              Anfahrt
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-5xl">
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
      <SplitCard
        label="Häufige Fragen"
        title="Alles, was Sie wissen möchten."
        text={
          <p>
            Die wichtigsten Antworten auf einen Blick. Ihre Frage ist nicht
            dabei?{" "}
            <a href="#anfragen" className="font-bold text-accent-lime underline">
              Schreiben Sie uns.
            </a>
          </p>
        }
      >
        <Accordion items={FAQ} />
      </SplitCard>

      {/* 8b. Zubuchbar (nach der FAQ) */}
      <SplitCard
        accent
        label="Zubuchbar"
        title="Machen Sie mehr aus Ihrem Event."
        text={
          <p>
            Über unsere hauseigene Agentur buchen Sie bei Bedarf Werbung für
            Ihr Event und viele weitere Extras direkt mit dazu.
          </p>
        }
      >
        <DotList items={EXTRAS} />
      </SplitCard>

      {/* 9. Anfrage */}
      <div className="pb-24">
        <SplitCard
          id="anfragen"
          label="Ihr Event, unsere Beratung."
          title="Ganz unverbindlich anfragen."
          text={
            <p>
              Ihre Idee sind unser Antrieb. Melden Sie sich bei uns und wir
              setzen Ihre Pläne um. Los geht&apos;s!
            </p>
          }
        >
          <EventlocationRequestForm />
        </SplitCard>
      </div>
    </div>
  );
}
