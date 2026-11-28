import Link from "next/link";
import Reveal from "@/components/Reveal";
import LocationLandingTemplate, {
  type LocationPageData,
} from "@/components/LocationLandingTemplate";

export const metadata = {
  alternates: { canonical: "/eventlocation-region" },
  title: "Eventlocation Region Augsburg & Ingolstadt | moos.park Pöttmes",
  description:
    "Eventlocation in Pöttmes für Hochzeiten, Firmenevents, Club-Nächte und Geburtstage. Bis 2300 Personen, Region Augsburg, Ingolstadt und Aichach-Friedberg.",
  openGraph: {
    title: "Eventlocation Region Augsburg & Ingolstadt | moos.park",
    description:
      "Bis zu 2300 Gäste, sieben kombinierbare Räume, eigene Gastronomie und Technik für die Region Augsburg, Ingolstadt und Aichach-Friedberg.",
    url: "/eventlocation-region",
    type: "website",
    locale: "de_DE",
    images: ["/images/eventlocation-hero.png"],
  },
};

const EVENT_TYPES = [
  {
    title: "Firmenevents",
    text: "Weihnachtsfeier, Kick-off, Produktlaunch, Sommerfest – professionelle Location für 80 bis 2300 Mitarbeiter und Gäste.",
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
    text: "Vom 18. bis zum 80. Geburtstag – private Feiern für 50 bis 2300 Gäste, inklusive Technik, Deko-Möglichkeiten und Catering.",
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
    text: "moos.park liegt direkt in Pöttmes im Landkreis Aichach-Friedberg – nur wenige Minuten von Aichach, Friedberg, Kühbach, Dasing und Schrobenhausen entfernt. Mit großem kostenlosem Parkplatz direkt vor der Tür.",
    towns: ["Aichach", "Friedberg", "Pöttmes", "Schrobenhausen", "Kühbach", "Dasing"],
  },
  {
    name: "Augsburg & Umland",
    text: "Rund 40 Minuten von Augsburg entfernt bietet moos.park großen Parkplatz, Platz für bis zu 2300 Gäste und eigene Gastronomie. Auch aus Königsbrunn, Neusäß, Gersthofen und Stadtbergen gut erreichbar.",
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
    text: "Auch aus Wertingen, Dillingen an der Donau, Donauwörth, Lauingen und Höchstädt an der Donau ist moos.park gut erreichbar – mit Platz für bis zu 2300 Gäste im gesamten Haus.",
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
    a: "Für Hochzeiten, Firmenevents, Club- und Disconächte, Geburtstage, private Feiern und Konzerte. Sieben kombinierbare Räume machen Events von 50 bis 2300 Personen möglich.",
  },
  {
    q: "Ist eine exklusive Buchung der gesamten Location möglich?",
    a: "Ja. moos.park kann komplett exklusiv gebucht werden – ideal für Hochzeiten und große Firmenfeiern ohne parallel stattfindende Events.",
  },
  {
    q: "Was ist bei der Miete inklusive?",
    a: "Licht- und Tontechnik, Bühne, Bar, Pinsa und Pizza aus dem Haus, großer kostenloser Parkplatz und ein persönlicher Ansprechpartner für die gesamte Planung. Weiteres Catering organisieren wir mit namhaften Caterer-Partnern.",
  },
  {
    q: "Wie schnell bekomme ich ein Angebot?",
    a: "Sie erhalten Ihr individuelles, unverbindliches Angebot in der Regel innerhalb von 24 Stunden. Die Anfrage ist kostenlos.",
  },
  {
    q: "Gibt es Catering?",
    a: "Bar, Pinsa und Pizza kommen aus dem Haus. Für weiteres Catering, zum Beispiel Menü oder Buffet, arbeiten wir mit namhaften Caterern zusammen und stimmen uns flexibel auf Ihren Anlass ab.",
  },
  {
    q: "Was, wenn ich sehr kurzfristig plane?",
    a: "Sprechen Sie uns an. Wir planen auch kurzfristig und melden uns in der Regel innerhalb von 24 Stunden mit einem Angebot. Ob Ihr Wunschtermin frei ist, klären wir direkt mit Ihnen.",
  },
];

// Regionen mit Orten und Verweisen auf die Standort-Seiten.
function RegionList() {
  return (
    <section id="regionen" className="px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-[77rem]">
        <Reveal>
          <p className="text-center text-xs font-black uppercase font-mono tracking-[0.2em] text-accent-lime">
            Einzugsgebiet
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-center text-2xl font-black uppercase leading-[1.1] text-foreground sm:text-3xl lg:text-5xl">
            Aus diesen Regionen kommen unsere Gäste.
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {REGIONS.map((region, i) => (
            <Reveal key={region.name} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-foreground/10 p-6">
                <h3 className="font-black uppercase text-foreground">
                  {region.name}
                </h3>
                <p className="mt-2 text-sm text-foreground/70">{region.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {region.towns.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-foreground/15 px-3 py-1 text-xs text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {region.link && (
                  <Link
                    href={region.link.href}
                    className="mt-4 text-xs font-black uppercase tracking-wide text-accent-lime"
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
  );
}

const data: LocationPageData = {
  path: "/eventlocation-region",
  breadcrumbName: "Eventlocation Region",
  heroTitle: "Eventlocation mieten für Hochzeit, Firmenevent & Club-Feier",
  heroPill: "Pöttmes · Region Augsburg, Ingolstadt, Aichach-Friedberg",
  introHeading: "Eine Location, alle Anlässe, ganz Bayerisch-Schwaben & Oberbayern.",
  introParagraphs: [
    <>
      <strong>moos.park in Pöttmes</strong> – bis 2300 Personen, alles
      inklusive. Im Umkreis von rund 100&nbsp;km um Aichach, Friedberg,
      Augsburg, Neuburg an der Donau, Ingolstadt, Regensburg, Wertingen und
      Dillingen die Eventlocation für Hochzeiten, Firmenevents, Clubnächte,
      Geburtstage und Feiern jeder Art mieten.
    </>,
  ],
  extra: <RegionList />,
  occasions: EVENT_TYPES,
  anfahrtText:
    "Rudolf-Diesel-Straße 23, 86554 Pöttmes. Rund 40 Minuten von Augsburg und ca. 35 Minuten von Ingolstadt.",
  faq: FAQ,
};

export default function EventlocationRegionPage() {
  return <LocationLandingTemplate data={data} />;
}
