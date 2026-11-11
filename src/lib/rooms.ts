export type Room = {
  slug: string;
  name: string;
  capacity: string;
  area: string;
  text: string;
  images: string[];
};

// Flächen = Nutzfläche in ganzen m². Personenzahlen = Maximalwerte (stehend)
// laut Brandschutznachweis. Bestuhlung wird je Veranstaltung individuell geplant.
export const ROOMS: Room[] = [
  {
    slug: "mainhalle",
    name: "Main-Halle mit Galerie",
    capacity: "Bis zu 750 Personen",
    area: "415 m²",
    text: "Die Main-Halle mit Galerie bietet Platz für bis zu 750 Personen. Mit fest eingebauten Theken, großer Bühne und mobilen Einrichtungen lässt sich der Raum innerhalb kurzer Zeit an viele Events anpassen.",
    images: [
      "/images/rooms/mainhalle-1.jpg",
      "/images/rooms/mainhalle-2.jpg",
      "/images/rooms/mainhalle-3.jpg",
      "/images/rooms/mainhalle-4.jpg",
      "/images/rooms/mainhalle-5.jpg",
      "/images/rooms/mainhalle-6.jpg",
      "/images/rooms/mainhalle-7.jpg",
    ],
  },
  {
    slug: "bar",
    name: "Bar",
    capacity: "Bis zu 140 Personen",
    area: "84 m²",
    text: "Die Bar ergänzt die Main-Halle als eigener Bereich im Haus.",
    images: [],
  },
  {
    slug: "terrasse",
    name: "Terrasse",
    capacity: "Bis zu 720 Personen (bestuhlt 576)",
    area: "460 m²",
    text: "Die Terrasse eignet sich nicht nur für Sommerevents, sondern auch im Winter für Weihnachtsmärkte und Foodtruck-Festivals.",
    images: [
      "/images/rooms/terrasse-1.jpg",
      "/images/rooms/terrasse-2.jpg",
      "/images/rooms/terrasse-3.jpg",
    ],
  },
  {
    slug: "lounge",
    name: "Kleine Halle (Lounge)",
    capacity: "Bis zu 300 Personen",
    area: "173 m²",
    text: "Die Kleine Halle (Lounge) ist eine voll ausgestattete Eventhalle für Events ab 50 bis maximal 300 Personen, mit Licht- und Tontechnik. Ob kleinere Feiern, Live-Auftritte oder Partys.",
    images: [
      "/images/rooms/lounge-1.jpg",
      "/images/rooms/lounge-2.jpg",
      "/images/rooms/lounge-3.jpg",
    ],
  },
  {
    slug: "chillout",
    name: "Chillout",
    capacity: "Bis zu 406 Personen",
    area: "183 m²",
    text: "Ob als separate Lounge-Area, Barbereich bei Großveranstaltungen oder als exklusiver Rückzugsort für besondere Gäste – der Chillout-Bereich lässt sich flexibel in jedes Veranstaltungskonzept integrieren.",
    images: [
      "/images/rooms/chillout-1.jpg",
      "/images/rooms/chillout-2.jpg",
      "/images/rooms/chillout-3.jpg",
    ],
  },
  {
    slug: "foyer",
    name: "Foyer",
    capacity: "Empfang und Garderobe",
    area: "82 m²",
    text: "Hier begrüßen wir unsere Gäste und Kunden mit „HERZLICH WILLKOMMEN IM MOOS.PARK“. Ausgefallenes Lichtkonzept, angepasste Farben oder einfarbige Beleuchtung. Ausgestattet mit einem Kassenraum und einer Garderobe für bis zu 680 Jacken.",
    images: ["/images/rooms/foyer-1.jpg", "/images/rooms/foyer-2.jpg"],
  },
  {
    slug: "pizzeria",
    name: "Pizzeria",
    capacity: "Bis zu 80 Personen",
    area: "53 m²",
    text: "Die Pizzeria eignet sich als Treffpunkt bei Events oder als Ausklang eines Abends in entspannter Umgebung.",
    images: ["/images/rooms/pizzeria-1.jpg"],
  },
];
