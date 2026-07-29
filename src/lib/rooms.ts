export type Room = {
  slug: string;
  name: string;
  capacity: string;
  area: string;
  text: string;
  images: string[];
};

export const ROOMS: Room[] = [
  {
    slug: "mainhalle",
    name: "Main-Halle mit Galerie und Bar",
    capacity: "Bis zu 750 Personen",
    area: "475m² Eventfläche",
    text: "Die Main-Halle ist der größte Raum. Mit fest eingebauten Theken, großer Bühne und mobilen Einrichtungen kann der Raum innerhalb kurzer Zeit an fast alle Events angepasst werden.",
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
    slug: "terrasse",
    name: "Terrasse",
    capacity: "Bis zu 720 Personen",
    area: "460m² Eventfläche",
    text: "Die neue Terrasse ist unser Highlight. Nicht nur für Sommerevents, sondern auch im Winter für Weihnachtsmärkte und Foodtruck-Festivals.",
    images: [
      "/images/rooms/terrasse-1.jpg",
      "/images/rooms/terrasse-2.jpg",
      "/images/rooms/terrasse-3.jpg",
    ],
  },
  {
    slug: "lounge",
    name: "Lounge",
    capacity: "Bis zu 300 Personen",
    area: "150m² Eventfläche",
    text: "Die Lounge ist eine voll ausgestattete Eventhalle für Events ab 50 bis maximal 300 Personen. Exclusive Licht- und Tontechnik lassen jedes Event einzigartig werden. Ob kleinere Feiern, Live-Auftritte oder Partys – genau richtig.",
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
    area: "203m² Eventfläche",
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
    capacity: "Bis zu 90 Personen",
    area: "62m² Gastfläche",
    text: "Hier dürfen wir unsere Gäste und Kunden begrüßen und sagen „HERZLICH WILLKOMMEN IM MOOS.PARK“. Ausgefallenes Lichtkonzept, angepasste Farben oder einfarbige Beleuchtung. Ausgestattet mit einem Kassenraum und einer Garderobe für bis zu 680 Jacken.",
    images: ["/images/rooms/foyer-1.jpg", "/images/rooms/foyer-2.jpg"],
  },
  {
    slug: "pizzeria",
    name: "Pizzeria",
    capacity: "Bis zu 80 Personen",
    area: "41m² Eventfläche",
    text: "Ob als kulinarisches Highlight bei Events, gemütlicher Treffpunkt oder geselliger Ausklang eines Abends – die Pizzeria bietet den perfekten Rahmen für Genussmomente in entspannter Umgebung.",
    images: ["/images/rooms/pizzeria-1.jpg"],
  },
];
