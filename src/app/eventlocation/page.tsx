import Image from "next/image";

export const metadata = {
  title: "Eventlocation Pöttmes – Veranstaltungslocation Bayern | moos.park",
};

const ROOMS = [
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

export default function EventlocationPage() {
  return (
    <div>
      <section className="px-6 pb-8 pt-20 text-center">
        <h1 className="text-4xl font-black uppercase  text-foreground sm:text-5xl">
          Unvergesslich werden
        </h1>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-16">
          {ROOMS.map((room, i) => (
            <div
              key={room.name}
              className={`flex flex-col items-center gap-8 lg:flex-row ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/5 lg:w-1/2">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex flex-wrap gap-3 text-sm font-bold text-accent-lime">
                  <span>{room.capacity}</span>
                  <span>·</span>
                  <span>{room.area}</span>
                </div>
                <h2 className="mt-3 text-2xl font-black uppercase  text-foreground sm:text-3xl">
                  {room.name}
                </h2>
                <p className="mt-4 text-black/70">{room.text}</p>
                <a
                  href="#anfragen"
                  className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
                >
                  Anfragen
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="anfragen" className="px-6 pb-28">
        <div className="mx-auto max-w-3xl rounded-3xl border border-black/8 bg-black/[0.025] p-8 sm:p-12">
          <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
            Ihr Event, unsere Beratung.
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase text-foreground">
            Ganz unverbindlich anfragen.
          </h2>
          <p className="mt-4 text-black/70">
            Ihre Idee sind unser Antrieb. Melden Sie sich bei uns und wir
            verwandeln Ihre Pläne in unvergessliche Erlebnisse. Los geht's!
          </p>

          <form className="mt-8 grid gap-4 sm:grid-cols-2">
            <input
              name="firma"
              placeholder="Firma"
              className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
            />
            <select
              name="veranstaltungsort"
              defaultValue=""
              className="rounded-xl border border-black/15 bg-black/5 px-4 py-3 text-black/70 outline-none focus:border-accent"
            >
              <option value="" disabled>
                Veranstaltungsort
              </option>
              <option>Im moos.park</option>
              <option>In externer Location</option>
              <option>Auf Privat- oder Firmengrundstück</option>
              <option>Sonstige Location</option>
              <option>Ist noch offen</option>
            </select>
            <input
              name="vorname"
              placeholder="Vorname"
              className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
            />
            <input
              name="nachname"
              placeholder="Nachname"
              className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
            />
            <input
              name="telefon"
              placeholder="Telefonnummer"
              className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
            />
            <input
              name="email"
              type="email"
              placeholder="E-Mail"
              className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
            />
            <textarea
              name="nachricht"
              placeholder="Nachricht"
              rows={4}
              className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent sm:col-span-2"
            />
            <label className="flex items-start gap-2 text-xs text-black/50 sm:col-span-2">
              <input type="checkbox" className="mt-0.5" />
              Ich habe die Datenschutzbestimmungen zur Kenntnis genommen und
              akzeptiere diese.
            </label>
            <button
              type="submit"
              className="rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 sm:col-span-2 sm:w-fit"
            >
              Senden
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
