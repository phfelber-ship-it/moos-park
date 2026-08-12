import Link from "next/link";
import Reveal from "@/components/Reveal";
import FlipText from "@/components/FlipText";

export const metadata = {
  title: "moos.park erleben – Events, Ü30-Partys & Tanzabende | moos.park",
  description:
    "Events, Ü30-Partys und Tanzabende im moos.park Pöttmes – finde in einem Klick, was zu dir passt.",
};

const CATEGORIES = [
  {
    title: "Events",
    href: "/events",
    items: ["Partys", "Konzerte", "Open Air", "Bühne", "Familienfeiern"],
    cta: "Zu den Events",
  },
  {
    title: "Ü30 Partys",
    href: "/events",
    items: ["Auf 2 Areas", "Einlass ab 25 Jahren"],
    cta: "Tickets sichern",
  },
  {
    title: "Tanzabende",
    href: "/tanzveranstaltungen",
    items: ["Discofox", "Schlager", "Boogie", "Discohits", "Einzelrunden"],
    cta: "Zum Tanzabend",
  },
];

export default function QrCodeWerbungV1Page() {
  return (
    <div>
      <section className="px-6 pb-12 pt-32 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          moos.park erleben
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          Wähl dir dein Lieblingsevent.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Finde in einem Klick, was zu dir passt – Events, Ü30-Partys oder
          Tanzabende im moos.park.
        </p>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.1}>
              <Link
                href={cat.href}
                className="group flex h-full flex-col items-center rounded-2xl border border-foreground/10 p-8 text-center transition-colors hover:border-accent-lime"
              >
                <h2 className="text-2xl font-black uppercase text-foreground">
                  {cat.title}
                </h2>
                <ul className="mt-6 flex flex-1 flex-col items-center gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg bg-foreground/[0.04] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-block rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform group-hover:scale-105">
                  <FlipText text={cat.cta} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
