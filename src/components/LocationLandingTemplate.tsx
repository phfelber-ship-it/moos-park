import Image from "next/image";
import Link from "next/link";
import { ROOMS } from "@/lib/rooms";
import { getAllRoomImages } from "@/lib/room-images";
import RoomRows from "@/components/RoomRows";
import EventRequestForm from "@/components/EventRequestForm";
import FlipText from "@/components/FlipText";
import Accordion from "@/components/Accordion";
import Reveal from "@/components/Reveal";
import { SplitCard, DotList } from "@/components/SplitCard";
import {
  OCCASIONS,
  ADVANTAGES,
  EXTRAS,
  FACTS,
} from "@/lib/eventlocation-content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

// Raeume, die vorerst ausgeblendet sind - wie auf /eventlocation.
const HIDDEN_ROOM_SLUGS = ["bar"];
const VISIBLE_ROOMS = ROOMS.filter((r) => !HIDDEN_ROOM_SLUGS.includes(r.slug));

// Standort-Seite im Look von /eventlocation. Gemeinsam sind Bilder, Raeume,
// Vorteile, Anlaesse und Anfrage; pro Ort kommen Hero-Zeile, Einleitung,
// Anreise-Block, Anfahrtstext und FAQ aus den Daten.
export type LocationPageData = {
  path: string; // z. B. "/eventlocation-augsburg"
  breadcrumbName: string; // z. B. "Eventlocation Augsburg"
  heroTitle: string;
  heroPill: string; // kurze Entfernungsangabe unter dem Titel
  introHeading: string;
  introParagraphs: React.ReactNode[];
  cityBlock: { label: string; title: string; text: string; items: string[] };
  anfahrtText: string;
  faq: { q: string; a: string }[];
};

export default async function LocationLandingTemplate({
  data,
}: {
  data: LocationPageData;
}) {
  const roomImages = await getAllRoomImages();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
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
        {
          "@type": "ListItem",
          position: 3,
          name: data.breadcrumbName,
          item: `${SITE_URL}${data.path}`,
        },
      ],
    },
  ];

  return (
    <div>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ld).replace(/</g, "\\u003c"),
          }}
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
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-24 bg-gradient-to-t from-background via-background/60 to-transparent sm:h-32" />

        <div className="relative z-10 mx-auto max-w-[77rem] px-6 pb-12">
          <h1 className="text-3xl font-black uppercase leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            {data.heroTitle}
          </h1>

          <div className="mt-8 inline-flex rounded-full bg-black/70 p-1 backdrop-blur">
            <span className="rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-wide text-black">
              {data.heroPill}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Einleitung (ortsspezifisch) */}
      <section className="px-6 py-20 text-center lg:py-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-black uppercase leading-[1.05] text-foreground sm:text-4xl lg:text-5xl">
            {data.introHeading}
          </h2>
          {data.introParagraphs.map((para, i) => (
            <p
              key={i}
              className={`text-base leading-relaxed text-foreground/70 ${
                i === 0 ? "mt-6" : "mt-4"
              }`}
            >
              {para}
            </p>
          ))}

          <a
            href="#anfragen"
            className="mt-8 inline-block rounded-full bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
          >
            <FlipText text="Jetzt anfragen" />
          </a>
        </div>
      </section>

      {/* 3. Zahlen */}
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

      {/* 4. Ortsspezifischer Block (Anreise) */}
      <SplitCard
        label={data.cityBlock.label}
        title={data.cityBlock.title}
        text={<p>{data.cityBlock.text}</p>}
      >
        <DotList items={data.cityBlock.items} />
      </SplitCard>

      {/* 5. Vorteile */}
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

      {/* 6. Anlaesse */}
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

      {/* 7. Raeume */}
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
          rooms={VISIBLE_ROOMS.map((room) => ({
            ...room,
            images: roomImages[room.slug] ?? room.images,
          }))}
        />
      </section>

      {/* 8. Karte */}
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
              {data.anfahrtText}
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

      {/* 9. FAQ */}
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
        <Accordion items={data.faq} />
      </SplitCard>

      {/* 10. Zubuchbar */}
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

      {/* 11. Anfrage */}
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
          <EventRequestForm />
        </SplitCard>
      </div>
    </div>
  );
}
