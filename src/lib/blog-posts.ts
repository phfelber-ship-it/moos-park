export type BlogFaqItem = { q: string; a: string };
export type BlogSection = { heading: string; paragraphs: string[] };
export type BlogRelatedLink = { href: string; label: string };

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  publishedAt: string;
  sections: BlogSection[];
  faq?: BlogFaqItem[];
  relatedLinks: BlogRelatedLink[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "eventlocation-mieten-checkliste",
    title: "Eventlocation mieten: Die Checkliste für deine Veranstaltung",
    metaTitle:
      "Eventlocation mieten: Checkliste & Tipps für die richtige Wahl | moos.park",
    description:
      "Worauf du bei der Auswahl einer Eventlocation wirklich achten solltest: Kapazität, Technik, Gastronomie, Parkplatz und Kosten – die komplette Checkliste.",
    excerpt:
      "Worauf es bei der Wahl der richtigen Eventlocation wirklich ankommt – von Kapazität bis Kosten.",
    publishedAt: "2026-01-15",
    sections: [
      {
        heading: "Wie viele Gäste erwartest du?",
        paragraphs: [
          "Die Personenzahl ist der erste und wichtigste Filter bei der Locationsuche. Eine Halle für 2.400 Personen wirkt bei einer 50-köpfigen Feier leer und unpersönlich – umgekehrt wird es bei zu kleinen Räumen schnell eng und unangenehm.",
          "Achte darauf, ob die Location flexibel kombinierbare Räume anbietet. So lässt sich die Fläche an die tatsächliche Gästezahl anpassen, egal ob privates Fest mit 50 Personen oder Firmenfeier mit 800 Gästen.",
        ],
      },
      {
        heading: "Technik: Was ist wirklich inklusive?",
        paragraphs: [
          "Licht- und Tontechnik, Bühne, Mikrofone – frag konkret nach, was im Mietpreis enthalten ist und was extra kostet. Viele Locations vermieten nur die leere Halle, Technik muss dann separat und meist teuer dazugebucht werden.",
          "Ein guter Indikator: Kann die Location dir sofort sagen, welche Technik fest verbaut ist? Wenn die Antwort vage bleibt, wird es am Eventtag oft teuer und stressig.",
        ],
      },
      {
        heading: "Gastronomie aus einer Hand",
        paragraphs: [
          "Eigene Küche, Bar und idealerweise sogar Pizzeria vor Ort sparen dir die Suche nach externen Caterern – und damit auch zusätzliche Anfahrts- und Koordinationskosten.",
          "Frag nach, ob Buffet, Menü und Fingerfood flexibel zusammengestellt werden können, und ob Sonderwünsche (vegan, allergenfrei) möglich sind.",
        ],
      },
      {
        heading: "Parkplatz und Erreichbarkeit",
        paragraphs: [
          "Gerade außerhalb der Großstädte entscheidet ein kostenloser, ausreichend großer Parkplatz oft darüber, ob Gäste gerne kommen oder absagen. Stadtlocations punkten oft mit Lage, verlieren aber genau hier.",
        ],
      },
      {
        heading: "Exklusivität und Planungssicherheit",
        paragraphs: [
          "Kann die gesamte Location exklusiv gebucht werden, oder läuft parallel ein anderes Event? Für Hochzeiten und große Firmenfeiern ist Exklusivität meist Pflicht, damit sich Gästekreise nicht überschneiden.",
        ],
      },
    ],
    faq: [
      {
        q: "Wie weit im Voraus sollte ich eine Eventlocation buchen?",
        a: "Für beliebte Termine (Freitag/Samstag, Dezember, Sommer) empfehlen sich 2–4 Monate Vorlauf, bei Hochzeiten oft 6–12 Monate. Kurzfristige Anfragen sind bei vielen Locations trotzdem möglich – einfach anfragen.",
      },
      {
        q: "Was kostet eine Eventlocation im Schnitt?",
        a: "Das hängt stark von Raumgröße, Technik und Gastronomie ab. Viele Locations stellen den Raum kostenlos oder günstig zur Verfügung und verdienen über Getränke- und Speisenumsatz – konkret nachfragen lohnt sich immer.",
      },
    ],
    relatedLinks: [
      { href: "/eventlocation", label: "Unsere Eventlocation im Detail" },
      { href: "/eventlocation-mieten", label: "Eventlocation mieten" },
      { href: "/veranstaltungsanfrage", label: "Jetzt unverbindlich anfragen" },
    ],
  },
  {
    slug: "firmenweihnachtsfeier-planen",
    title: "Firmenweihnachtsfeier planen: Ablauf, Ideen & Checkliste",
    metaTitle:
      "Firmenweihnachtsfeier planen: Ideen, Ablauf & Checkliste | moos.park",
    description:
      "Firmenweihnachtsfeier organisieren ohne Stress: Ablaufplan, Locationwahl, Budget und Ideen, die dein Team wirklich begeistern.",
    excerpt:
      "So wird die Firmenweihnachtsfeier zum Highlight statt zur Pflichtveranstaltung.",
    publishedAt: "2026-01-20",
    sections: [
      {
        heading: "Frühzeitig planen zahlt sich aus",
        paragraphs: [
          "Der Dezember ist der gefragteste Monat des Jahres für Firmenfeiern. Gute Locations sind oft schon im Spätsommer ausgebucht. Wer im Juli oder August anfragt, hat die größte Auswahl bei Termin und Raum.",
        ],
      },
      {
        heading: "Der richtige Rahmen: Größe und Stimmung",
        paragraphs: [
          "Ob elegantes Dinner für 30 Führungskräfte oder große Party für 400 Mitarbeitende – die Location sollte zur Unternehmenskultur passen. Flexible Räume, die sich kombinieren lassen, sind hier Gold wert.",
          "Eine gute Location liefert nicht nur die Halle, sondern das komplette Paket: Technik, Deko-Möglichkeiten, Bühne für Reden oder Auszeichnungen und ein Ablaufkonzept aus einer Hand.",
        ],
      },
      {
        heading: "Programm: Reden, Aktivitäten, Party",
        paragraphs: [
          "Ein bewährter Ablauf: Begrüßung und kurze Rede der Geschäftsführung, gemeinsames Essen, danach Programmpunkt (Team-Aktivität, Auszeichnungen, Quiz) und anschließend offener Ausklang mit Musik und Bar.",
          "Zu lange Reden killen die Stimmung – 10 bis 15 Minuten reichen völlig, danach sollte der gesellige Teil im Vordergrund stehen.",
        ],
      },
      {
        heading: "Budget realistisch kalkulieren",
        paragraphs: [
          "Neben Raum, Essen und Getränken oft vergessen: Technik-Extras, Deko, ggf. externe Unterhaltung (DJ, Band) und Transport für Mitarbeitende ohne eigenes Auto. Ein Ansprechpartner, der alles koordiniert, spart hier viel internen Organisationsaufwand.",
        ],
      },
    ],
    faq: [
      {
        q: "Wie viel sollte man pro Person für eine Firmenweihnachtsfeier einplanen?",
        a: "Je nach Anspruch zwischen 40 und 120 € pro Person inklusive Essen und Getränken. Große Locations mit eigener Gastronomie sind oft günstiger als externes Catering plus separate Raummiete.",
      },
      {
        q: "Ab wie vielen Personen lohnt sich eine externe Location statt Büroräumen?",
        a: "Ab etwa 40–50 Personen wird es im Büro meist eng und unpraktisch. Externe Locations bieten dann mehr Platz, echte Bühnen-/Technik-Infrastruktur und keine Aufräumarbeit am nächsten Morgen.",
      },
    ],
    relatedLinks: [
      { href: "/firmenevents", label: "Firmenevents im moos.park" },
      { href: "/eventlocation-mieten", label: "Eventlocation mieten" },
      { href: "/veranstaltungsanfrage", label: "Jetzt Angebot anfragen" },
    ],
  },
  {
    slug: "hochzeitslocation-finden",
    title: "Hochzeitslocation finden: Die wichtigsten Fragen vor der Buchung",
    metaTitle:
      "Hochzeitslocation finden: Worauf achten? | moos.park Eventlocation",
    description:
      "Die richtige Hochzeitslocation finden: Diese Fragen solltest du vor der Buchung stellen – von Exklusivität über Catering bis Schlechtwetter-Option.",
    excerpt:
      "Diese Fragen entscheiden, ob eure Hochzeitslocation wirklich die richtige ist.",
    publishedAt: "2026-02-01",
    sections: [
      {
        heading: "Trauung, Feier und Party unter einem Dach?",
        paragraphs: [
          "Wechselt ihr zwischen mehreren Orten (Kirche, Restaurant, Partylocation), kostet das Zeit, Logistik und Nerven – und manche Gäste springen unterwegs ab. Locations, die Trauung, Feier und Party an einem Ort ermöglichen, machen den Tag für alle entspannter.",
        ],
      },
      {
        heading: "Exklusive Buchung – ja oder nein?",
        paragraphs: [
          "Fragt konkret nach: Ist die Location an eurem Tag exklusiv für euch reserviert, oder läuft parallel ein anderes Event? Für den intimen Rahmen einer Hochzeit ist Exklusivität meist unverzichtbar.",
        ],
      },
      {
        heading: "Außenbereich und Schlechtwetter-Option",
        paragraphs: [
          "Eine große Terrasse für Sektempfang und Fotos ist im Sommer Gold wert – aber nur, wenn es auch eine überdachte Alternative für Regentage gibt. Fragt aktiv nach dem Plan B.",
        ],
      },
      {
        heading: "Catering und Getränke",
        paragraphs: [
          "Eigene Gastronomie vor Ort bedeutet meist mehr Flexibilität bei Menü, Buffet und Sonderwünschen – und keine zusätzliche Anfahrtspauschale für externe Caterer. Klärt außerdem, bis wann Änderungen an der Gästezahl möglich sind.",
        ],
      },
      {
        heading: "Parkplatz für alle Gäste",
        paragraphs: [
          "Bei Hochzeiten reisen oft viele Gäste von auswärts an. Ein großer, kostenloser Parkplatz direkt vor der Location erspart Stress und Diskussionen über Anfahrt und Parkgebühren.",
        ],
      },
    ],
    faq: [
      {
        q: "Wie früh sollte man eine Hochzeitslocation buchen?",
        a: "Für beliebte Termine (Mai bis September, Samstage) empfehlen sich 9–12 Monate Vorlauf. Außerhalb der Hauptsaison sind oft auch kurzfristigere Buchungen möglich.",
      },
      {
        q: "Was ist bei einer Hochzeitslocation oft im Preis inklusive?",
        a: "Häufig: Raummiete, Grundtechnik (Licht/Ton), Tische, Stühle und Parkplatz. Nicht immer inklusive: Deko, DJ/Band, Blumenschmuck und individuelle Menüwünsche – das lohnt sich, konkret zu erfragen.",
      },
    ],
    relatedLinks: [
      { href: "/eventlocation-region", label: "Hochzeitslocation in der Region" },
      { href: "/eventlocation", label: "Räume für eure Hochzeit" },
      { href: "/veranstaltungsanfrage", label: "Jetzt Termin anfragen" },
    ],
  },
  {
    slug: "ue30-ue40-party-outfit",
    title: "Was zieht man zu einer Ü30- oder Ü40-Party an?",
    metaTitle: "Ü30/Ü40-Party Outfit: Was anziehen? | moos.park",
    description:
      "Outfit-Ideen für Ü30- und Ü40-Partys: was gepflegt und stilsicher wirkt, was du besser lässt – für Damen und Herren.",
    excerpt:
      "Stilsicher statt Studentenparty: So kleidest du dich für eine Ü30/Ü40-Nacht richtig.",
    publishedAt: "2026-02-10",
    sections: [
      {
        heading: "Der Grundsatz: Gepflegt statt overdressed",
        paragraphs: [
          "Ü30- und Ü40-Partys haben einen anderen Dresscode als klassische Studentenpartys – gepflegt, aber nicht steif. Die meisten Locations verlangen kein Anzug-Pflicht, aber Sportbekleidung, Vereinstrikots oder abgetragene Sneaker sind meist tabu.",
        ],
      },
      {
        heading: "Für Damen",
        paragraphs: [
          "Ein schickes Kleid, eine elegante Bluse mit Stoffhose oder ein gut sitzendes Business-Casual-Outfit funktionieren fast immer. Absätze sind schön, aber überlegt euch bei langen Tanznächten eine bequeme Alternative für später.",
        ],
      },
      {
        heading: "Für Herren",
        paragraphs: [
          "Ein Hemd (gerne auch ohne Krawatte, oben offen) mit Stoffhose oder dunkler Jeans liegt fast immer richtig. Ein leichtes Sakko rundet den Look ab, ist aber nicht Pflicht. Auf Sneaker mit Sportlook, Cap und Trainingsjacke besser verzichten.",
        ],
      },
      {
        heading: "Was du besser vermeidest",
        paragraphs: [
          "Sportbekleidung, Motorrad- oder Vereinskleidung, sichtbare Marken-Logos von Fußballvereinen sowie zu freizeitliche Outfits (Badelatschen, zerrissene Jeans) sorgen an vielen Einlässen für Diskussionen. Ein Blick in die konkrete Eventbeschreibung der jeweiligen Party lohnt sich immer.",
        ],
      },
    ],
    faq: [
      {
        q: "Gibt es bei Ü30/Ü40-Partys eine feste Kleiderordnung?",
        a: "Meist keine feste Vorschrift, aber die Erwartung eines gepflegten, angemessenen Erscheinungsbilds. Am besten vorab in der Eventbeschreibung nachlesen – dort stehen oft konkrete Hinweise.",
      },
      {
        q: "Werden Gäste am Einlass wegen der Kleidung abgewiesen?",
        a: "Ja, das kommt vor, vor allem bei Sportbekleidung oder Vereinskleidung. Der Einlass erfolgt grundsätzlich nach Ermessen des Sicherheitspersonals – im Zweifel lieber etwas schicker als zu leger kommen.",
      },
    ],
    relatedLinks: [
      { href: "/tanzveranstaltungen", label: "Alle Tanzabende ansehen" },
      { href: "/faq", label: "Häufige Fragen zum Einlass" },
      { href: "/app", label: "Mit der App direkt Tickets sichern" },
    ],
  },
  {
    slug: "eventlocation-augsburg-ingolstadt-regensburg",
    title:
      "Die beste Eventlocation zwischen Augsburg, Ingolstadt und Regensburg",
    metaTitle:
      "Eventlocation zwischen Augsburg, Ingolstadt & Regensburg | moos.park",
    description:
      "Eine der größten Eventlocations der Region: zentral zwischen Augsburg, Ingolstadt und Regensburg, mit Platz für bis zu 2.400 Gäste.",
    excerpt:
      "Zentral gelegen zwischen drei Großstädten – und trotzdem in wenigen Minuten erreichbar.",
    publishedAt: "2026-02-18",
    sections: [
      {
        heading: "Zentrale Lage im Landkreis Aichach-Friedberg",
        paragraphs: [
          "moos.park liegt in Pöttmes im Landkreis Aichach-Friedberg – rund 40 Minuten von Augsburg, etwa 35 Minuten von Ingolstadt und im Umkreis von rund 100 km auch von Regensburg gut erreichbar. Für viele Gäste aus der Region ist das die kürzeste Anfahrt zu einer Location dieser Größe.",
        ],
      },
      {
        heading: "Kapazität, die kleinere Stadtlocations nicht bieten",
        paragraphs: [
          "Mit fünf kombinierbaren Räumen und Platz für bis zu 2.400 Personen zählt moos.park zu den größten Eventlocations der Region – von der kleinen Feier mit 50 Personen bis zur großen Hochzeit oder Firmenfeier mit mehreren Hundert Gästen.",
        ],
      },
      {
        heading: "Was Stadtlocations oft fehlt",
        paragraphs: [
          "Große, kostenlose Parkplätze direkt vor der Tür, eigene Gastronomie mit Bar, Buffet und Pizzeria sowie vollständige Licht- und Tontechnik – Dinge, die in vielen innerstädtischen Locations entweder fehlen oder teuer extra gebucht werden müssen.",
        ],
      },
    ],
    faq: [
      {
        q: "Wie weit ist moos.park von Augsburg entfernt?",
        a: "Rund 40 Minuten über die B2/B300, mit großem kostenlosem Parkplatz direkt vor Ort.",
      },
      {
        q: "Ist moos.park auch für Gäste aus Ingolstadt und Regensburg gut erreichbar?",
        a: "Ja – etwa 35 Minuten von Ingolstadt und im Umkreis von rund 100 km auch von Regensburg, Neuburg an der Donau, Wertingen und Dillingen aus gut erreichbar.",
      },
    ],
    relatedLinks: [
      { href: "/eventlocation-augsburg", label: "Eventlocation bei Augsburg" },
      { href: "/eventlocation-ingolstadt", label: "Eventlocation bei Ingolstadt" },
      { href: "/eventlocation-region", label: "Alle Regionen im Überblick" },
    ],
  },
  {
    slug: "geburtstag-feiern-ideen-bayern",
    title: "Geburtstag feiern in Bayern: Ideen für jedes Alter",
    metaTitle: "Geburtstag feiern Bayern: Ideen für 18., 30., 40., 50. | moos.park",
    description:
      "Geburtstag feiern in Bayern – Ideen und Tipps für den 18., 30., 40. und 50. Geburtstag, von privater Feier bis große Party.",
    excerpt:
      "Vom 18. bis zum 80. Geburtstag: Ideen, die wirklich zum jeweiligen Anlass passen.",
    publishedAt: "2026-02-25",
    sections: [
      {
        heading: "18. Geburtstag: Groß feiern mit Freunden",
        paragraphs: [
          "Der 18. Geburtstag ist für viele die erste große eigene Feier. Eine Location mit Tanzfläche, Bühne und Bar-Bereich sorgt für echtes Partyfeeling, ohne dass Eltern selbst Technik und Deko organisieren müssen.",
        ],
      },
      {
        heading: "30. und 40. Geburtstag: Der Mix aus Feier und Party",
        paragraphs: [
          "Hier bewährt sich oft ein zweigeteilter Ablauf: gemeinsames Essen mit engem Kreis im reservierten Bereich, danach offener Übergang in die Partynacht für alle, die länger feiern wollen.",
        ],
      },
      {
        heading: "50. Geburtstag und aufwärts: Stilvoll und persönlich",
        paragraphs: [
          "Ab dem 50. Geburtstag wünschen sich viele einen etwas ruhigeren, persönlicheren Rahmen – exklusive Raumbuchung, gutes Essen und die Möglichkeit für Reden und Anekdoten, statt lauter Partymusik den ganzen Abend.",
        ],
      },
      {
        heading: "Was bei jeder Geburtstagsfeier zählt",
        paragraphs: [
          "Kostenlose Tischreservierung, ein Ort ohne eigenen Auf- und Abbau und idealerweise Vergünstigungen fürs Geburtstagskind selbst machen den Unterschied zwischen einer geplanten und einer wirklich entspannten Feier.",
        ],
      },
    ],
    faq: [
      {
        q: "Wie weit im Voraus sollte man eine Geburtstagsfeier anfragen?",
        a: "2–4 Wochen Vorlauf reichen in der Regel für die Planung. Kurzfristige Anfragen werden bei vielen Locations trotzdem geprüft und oft möglich gemacht.",
      },
      {
        q: "Was kostet eine Geburtstagsfeier in einer Eventlocation?",
        a: "Oft ist der Tisch selbst kostenlos, die Kosten ergeben sich aus dem Getränke- und Speisenumsatz der Gäste. Manche Locations bieten dem Geburtstagskind zusätzlich freien Eintritt oder Rabatte für Freunde.",
      },
    ],
    relatedLinks: [
      { href: "/geburtstag", label: "Geburtstag im moos.park feiern" },
      { href: "/eventlocation", label: "Unsere Räume ansehen" },
      { href: "/veranstaltungsanfrage", label: "Jetzt Geburtstag anfragen" },
    ],
  },
  {
    slug: "moos-park-app-punkte-vorteile",
    title: "moos.park App: Punkte sammeln und Vorteile sichern",
    metaTitle: "moos.park App: Punkte sammeln & Vorteile | moos.park",
    description:
      "So funktioniert die moos.park App: Tickets, Coupons, Punkte sammeln und einlösen, Fastline-Eingang und alle Infos direkt auf dem Handy.",
    excerpt:
      "Tickets, Punkte, Fastline-Eingang: Warum sich die moos.park App für jeden Besuch lohnt.",
    publishedAt: "2026-03-01",
    sections: [
      {
        heading: "Tickets immer griffbereit",
        paragraphs: [
          "Statt Drucken oder Screenshot-Suche: Dein Ticket liegt in der App direkt zum Vorzeigen am Einlass bereit. Auch Tischreservierungen findest du dort unter Events → Meine Tickets.",
        ],
      },
      {
        heading: "Bei jeder Aktion Punkte sammeln",
        paragraphs: [
          "Ticketkauf, Coupon-Einlösung, Empfehlungen an Freunde – fast jede Aktion in der App bringt dir Punkte. Diese kannst du im Shop direkt gegen Prämien und exklusive Vorteile eintauschen.",
        ],
      },
      {
        heading: "Fastline-Eingang und Coupons",
        paragraphs: [
          "Mit der App nutzt du den Fastline-Eingang und musst nicht in der regulären Warteschlange stehen. Rabatt-Codes und Aktionen lassen sich außerdem direkt in der App einlösen, ganz ohne Papierkram.",
        ],
      },
      {
        heading: "Neue Events zuerst erfahren",
        paragraphs: [
          "Neue Partys, Tanzabende und Aktionen erscheinen zuerst in der App – so bist du immer vor allen anderen informiert.",
        ],
      },
    ],
    faq: [
      {
        q: "Ist die moos.park App kostenlos?",
        a: "Ja, Download und Registrierung sind komplett kostenlos, verfügbar für iOS und Android.",
      },
      {
        q: "Wie sammle ich Punkte in der App?",
        a: "Durch Aktionen wie Ticketkauf, Coupon-Einlösung und regelmäßige Besuche. Die gesammelten Punkte kannst du direkt im App-Shop gegen Prämien einlösen.",
      },
    ],
    relatedLinks: [
      { href: "/app", label: "Alle App-Vorteile im Überblick" },
      { href: "/tickets", label: "Jetzt Tickets sichern" },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}
