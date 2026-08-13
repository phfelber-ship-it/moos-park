import Link from "next/link";
import Reveal from "@/components/Reveal";
import FlipText from "@/components/FlipText";
import Accordion from "@/components/Accordion";
import { ROOMS } from "@/lib/rooms";

export const metadata = {
  alternates: { canonical: "/eventlocation-region" },
  title:
    "Eventlocation mieten für Hochzeit, Firmenevent & Club-Feier – Region Augsburg, Ingolstadt, Regensburg | moos.park",
  description:
    "moos.park in Pöttmes: Eventlocation für Hochzeiten, Firmenevents, Club- & Disconächte, Geburtstage und Feiern jeder Art. Bis 2400 Personen, im Umkreis von rund 100 km um Aichach, Friedberg, Augsburg, Neuburg an der Donau, Ingolstadt, Regensburg, Wertingen und Dillingen mieten.",
};

const EVENT_TYPES = [
  {
    title: "Firmenevents",
    text: "Weihnachtsfeier, Kick-off, Produktlaunch, Sommerfest – professionelle Location für 80 bis 2400 Mitarbeiter und Gäste.",
    href: "/firmenevents",
    cta: "Firmenevent anfragen",
  },
  {
    title: "Hochzeiten",
    text: "Standesamtliche Trauung, Feier und Party unter einem Dach – große Terrasse, eigene Gastronomie, exklusive Buchung möglich.",
    href: "/veranstaltungsanfrage",
    cta: "Hochzeit anfragen",
  },
  {
    title: "Club- & Disconächte",
    text: "Profi-Sound, Lichtshow und Bühne für Club-Events, Tanzabende und private Partys mit DJ oder Live-Act.",
    href: "/events",
    cta: "Tanzabende ansehen",
  },
  {
    title: "Geburtstage & Feiern",
    text: "Vom 18. bis zum 80. Geburtstag – private Feiern für 50 bis 2400 Gäste, inklusive Technik, Deko-Möglichkeiten und Catering.",
    href: "/geburtstag",
    cta: "Geburtstag feiern",
  },
  {
    title: "Konzerte & Ticket-Events",
    text: "Regelmäßige Konzerte, Clubnächte und Ticket-Events – auch als Location für externe Veranstalter und Vereine mietbar.",
    href: "/tickets",
    cta: "Events & Tickets",
  },
];

const REGIONS = [
  {
    name: "Landkreis Aichach-Friedberg",
    text: "moos.park liegt direkt in Pöttmes im Landkreis Aichach-Friedberg – nur wenige Minuten von Aichach, Friedberg, Kühbach, Dasing und Schrobenhausen entfernt. Die kürzeste Anfahrt der Region, mit großem kostenlosem Parkplatz direkt vor der Tür.",
    towns: ["Aichach", "Friedberg", "Pöttmes", "Schrobenhausen", "Kühbach", "Dasing"],
  },
  {
    name: "Augsburg & Umland",
    text: "Rund 40 Minuten von Augsburg entfernt bietet moos.park das, was Stadtlocations oft fehlt: großer Parkplatz, bis zu 2400 Plätze und eigene Gastronomie. Auch aus Königsbrunn, Neusäß, Gersthofen und Stadtbergen gut erreichbar.",
    towns: ["Augsburg", "Königsbrunn", "Neusäß", "Gersthofen", "Stadtbergen"],
    link: { href: "/eventlocation-augsburg", label: "Mehr zur Eventlocation bei Augsburg" },
  },
  {
    name: "Ingolstadt & Neuburg an der Donau",
    text: "Ca. 35 Minuten von Ingolstadt und rund 25 Minuten von Neuburg an der Donau – ideal für Firmenevents aus dem Wirtschaftsraum Ingolstadt sowie Feiern aus Pfaffenhofen an der Ilm, Manching, Karlshuld und Königsmoos.",
    towns: ["Ingolstadt", "Neuburg an der Donau", "Pfaffenhofen a.d. Ilm", "Manching", "Karlshuld", "Königsmoos"],
    link: { href: "/eventlocation-ingolstadt", label: "Mehr zur Eventlocation bei Ingolstadt" },
  },
  {
    name: "Donau-Ries, Dillingen & Wertingen",
    text: "Auch aus Wertingen, Dillingen an der Donau, Donauwörth, Lauingen und Höchstädt an der Donau ist moos.park eine der größten Eventlocations der Region – mit Kapazitäten, die kleinere Säle in der Region nicht bieten.",
    towns: ["Wertingen", "Dillingen a.d. Donau", "Donauwörth", "Lauingen", "Höchstädt a.d. Donau"],
  },
  {
    name: "Regensburg & Oberpfalz",
    text: "Im Umkreis von rund 100 km erreichen uns auch viele Gäste aus Regensburg, Neustadt an der Donau, Abensberg und Kelheim – vor allem für exklusive Hochzeiten und größere Firmenfeiern, bei denen die Location für die Region den Unterschied macht.",
    towns: ["Regensburg", "Neustadt a.d. Donau", "Abensberg", "Kelheim"],
  },
];

const FAQ = [
  {
    q: "In welchem Umkreis liegt moos.park für Gäste aus Augsburg, Ingolstadt und Regensburg?",
    a: "moos.park liegt zentral in Pöttmes im Landkreis Aichach-Friedberg – rund 40 Minuten von Augsburg, ca. 35 Minuten von Ingolstadt und im Umkreis von rund 100 km auch gut von Regensburg, Neuburg an der Donau, Wertingen und Dillingen aus erreichbar.",
  },
  {
    q: "Für welche Anlässe kann ich die Location mieten?",
    a: "Für Hochzeiten, Firmenevents, Club- und Disconächte, Geburtstage, private Feiern und Konzerte. Fünf kombinierbare Räume machen Events von 50 bis 2400 Personen möglich.",
  },
  {
    q: "Ist eine exklusive Buchung der gesamten Location möglich?",
    a: "Ja. moos.park kann komplett exklusiv gebucht werden – ideal für Hochzeiten und große Firmenfeiern ohne parallel stattfindende Events.",
  },
  {
    q: "Was ist bei der Miete inklusive?",
    a: "Licht- und Tontechnik, Bühne, eigene Gastronomie (Bar, Buffet, Pizzeria), großer kostenloser Parkplatz und ein persönlicher Ansprechpartner für die gesamte Planung.",
  },
  {
    q: "Wie schnell bekomme ich ein Angebot?",
    a: "Nach deiner Anfrage über das Kontaktformular meldet sich unser Team in der Regel innerhalb von 24 Stunden mit einem individuellen, unverbindlichen Angebot.",
  },
];

export default function EventlocationRegionPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="px-6 pb-16 pt-32 text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
            Eine Location, alle Anlässe, ganz Bayerisch-Schwaben &amp; Oberbayern.
          </p>
          <h1 className="mx-auto mt-4 max-w-4xl text-3xl font-black uppercase leading-tight text-foreground sm:text-5xl">
            Eventlocation mieten für Hochzeit, Firmenevent &amp; Club-Feier
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-foreground/70">
            moos.park in Pöttmes – bis 2400 Personen, alles inklusive. Im Umkreis
            von rund 100&nbsp;km um Aichach, Friedberg, Augsburg, Neuburg an der
            Donau, Ingolstadt, Regensburg, Wertingen und Dillingen die
            Eventlocation für Hochzeiten, Firmenevents, Clubnächte, Geburtstage
            und Feiern jeder Art mieten.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/veranstaltungsanfrage"
              className="inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              <FlipText text="Jetzt anfragen" />
            </Link>
            <a
              href="tel:082537576"
              className="inline-block rounded-lg border border-foreground/20 px-8 py-3 text-sm font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground/50"
            >
              Uns anrufen
            </a>
          </div>
        </Reveal>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Für jeden Anlass
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Eine Location für alle deine Events.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_TYPES.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-foreground/10 p-6">
                  <h3 className="font-black uppercase text-foreground">{e.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-foreground/60">{e.text}</p>
                  <Link
                    href={e.href}
                    className="mt-4 text-xs font-bold uppercase tracking-wide text-accent-lime hover:underline"
                  >
                    {e.cta} →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              5 Räume, ein Anbieter
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Von 50 bis 2400 Gästen – flexibel kombinierbar.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ROOMS.map((room, i) => (
              <Reveal key={room.name} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-foreground/10 p-6">
                  <h3 className="font-black uppercase text-foreground">{room.name}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-accent-lime">
                    {room.capacity} · {room.area}
                  </p>
                  <p className="mt-3 text-sm text-foreground/60">{room.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Im Umkreis von rund 100 km
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Eventlocation für die ganze Region.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-foreground/70">
              Ob Aichach, Friedberg, Augsburg, Neuburg an der Donau, Ingolstadt,
              Regensburg, Wertingen oder Dillingen – moos.park ist eine der
              größten Eventlocations zwischen Augsburg und Ingolstadt.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {REGIONS.map((region, i) => (
              <Reveal key={region.name} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-foreground/10 p-6">
                  <h3 className="font-black uppercase text-foreground">{region.name}</h3>
                  <p className="mt-2 text-sm text-foreground/60">{region.text}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {region.towns.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-foreground/10 px-3 py-1 text-xs font-semibold text-foreground/70"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  {region.link && (
                    <Link
                      href={region.link.href}
                      className="mt-4 inline-block text-xs font-bold uppercase tracking-wide text-accent-lime hover:underline"
                    >
                      {region.link.label} →
                    </Link>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Häufige Fragen
            </p>
            <h2 className="mx-auto mt-3 max-w-xl text-center text-2xl font-black uppercase leading-tight text-foreground sm:text-3xl">
              Alles was du wissen möchtest.
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <Accordion items={FAQ} />
          </Reveal>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-24 text-center">
        <Reveal direction="scale">
          <h2 className="mx-auto max-w-2xl text-2xl font-black uppercase leading-tight text-foreground sm:text-4xl">
            Deine Eventlocation für die ganze Region – jetzt anfragen.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-foreground/70">
            Wir erstellen dir innerhalb von 24 Stunden ein persönliches
            Angebot. Kostenlos, unverbindlich, konkret.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/veranstaltungsanfrage"
              className="inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              <FlipText text="Jetzt anfragen" />
            </Link>
            <a
              href="tel:082537576"
              className="inline-block rounded-lg border border-foreground/20 px-8 py-3 text-sm font-black uppercase tracking-wide text-foreground transition-colors hover:border-foreground/50"
            >
              Uns anrufen
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
