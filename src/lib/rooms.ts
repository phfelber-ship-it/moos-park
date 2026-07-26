export type Room = {
  name: string;
  capacity: string;
  area: string;
  text: string;
  image: string;
};

export const ROOMS: Room[] = [
  {
    name: "Main-Halle mit Galerie und Bar",
    capacity: "Bis zu 750 Personen",
    area: "475m² Eventfläche",
    text: "Die Main-Halle ist der größte Raum. Mit fest eingebauten Theken, großer Bühne und mobilen Einrichtungen kann der Raum innerhalb kurzer Zeit an fast alle Events angepasst werden.",
    image: "/images/rooms/main-halle.jpg",
  },
  {
    name: "Terrasse",
    capacity: "Bis zu 720 Personen",
    area: "460m² Eventfläche",
    text: "Die neue Terrasse ist unser Highlight. Nicht nur für Sommerevents, sondern auch im Winter für Weihnachtsmärkte und Foodtruck-Festivals.",
    image: "/images/rooms/terrasse.jpg",
  },
  {
    name: "Lounge",
    capacity: "Bis zu 300 Personen",
    area: "150m² Eventfläche",
    text: "Die Lounge ist eine voll ausgestattete Eventhalle für Events ab 50 bis maximal 300 Personen. Exclusive Licht- und Tontechnik lassen jedes Event einzigartig werden. Ob kleinere Feiern, Live-Auftritte oder Partys – genau richtig.",
    image: "/images/rooms/lounge.jpg",
  },
  {
    name: "Chillout",
    capacity: "Bis zu 406 Personen",
    area: "203m² Eventfläche",
    text: "Ob als separate Lounge-Area, Barbereich bei Großveranstaltungen oder als exklusiver Rückzugsort für besondere Gäste – der Chillout-Bereich lässt sich flexibel in jedes Veranstaltungskonzept integrieren.",
    image: "/images/rooms/chillout.jpg",
  },
  {
    name: "Foyer",
    capacity: "Bis zu 90 Personen",
    area: "62m² Gastfläche",
    text: "Hier dürfen wir unsere Gäste und Kunden begrüßen und sagen „HERZLICH WILLKOMMEN IM MOOS.PARK“. Ausgefallenes Lichtkonzept, angepasste Farben oder einfarbige Beleuchtung. Ausgestattet mit einem Kassenraum und einer Garderobe für bis zu 680 Jacken.",
    image: "/images/rooms/foyer.jpg",
  },
  {
    name: "Pizzeria",
    capacity: "Bis zu 80 Personen",
    area: "41m² Eventfläche",
    text: "Ob als kulinarisches Highlight bei Events, gemütlicher Treffpunkt oder geselliger Ausklang eines Abends – die Pizzeria bietet den perfekten Rahmen für Genussmomente in entspannter Umgebung.",
    image: "/images/rooms/pizzeria.jpg",
  },
];
