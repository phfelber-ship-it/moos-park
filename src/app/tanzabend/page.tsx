import Image from "next/image";

export const metadata = { title: "Tanzveranstaltungen - moos.park | Eventlocation" };

const TERMINE = [
  { date: "24.07.2026", dj: "DJ Willy" },
  { date: "14.08.2026", dj: "DJ Klaus" },
  { date: "28.08.2026", dj: "DJ Willy" },
  { date: "11.09.2026", dj: "DJ Klaus" },
  { date: "25.09.2026", dj: "DJ Willy" },
  { date: "09.10.2026", dj: "DJ Klaus" },
  { date: "23.10.2026", dj: "DJ Willy" },
];

export default function TanzabendPage() {
  return (
    <div>
      <section className="px-6 pb-8 pt-20 text-center">
        <h1 className="text-3xl font-black uppercase leading-tight  text-foreground sm:text-5xl">
          Tanzbare Musik, gute Stimmung
          <br />
          und echte Emotionen.
        </h1>
        <p className="mt-4 text-sm font-bold uppercase tracking-wide text-accent-lime">
          Jetzt neu: jeden 2. und 4. Freitag im Monat
        </p>
        <a
          href="/kontakt"
          className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Hier Tisch reservieren
        </a>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="relative aspect-[1024/379] w-full overflow-hidden rounded-2xl bg-black/5">
          <Image
            src="/images/tanzabend-banner.png"
            alt="Tanzen im moospark"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {TERMINE.map((termin) => (
            <div
              key={termin.date + termin.dj}
              className="rounded-2xl border border-black/8 bg-black/[0.025] p-6"
            >
              <p className="text-sm font-bold text-accent">{termin.date}</p>
              <h3 className="mt-2 text-lg font-black uppercase text-foreground">
                Tanzen im Moospark
              </h3>
              <p className="mt-1 text-black/70">
                Dein Tanzabend mit {termin.dj}
              </p>
              <p className="mt-2 text-sm text-black/50">Beginn: 20:00 Uhr</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
