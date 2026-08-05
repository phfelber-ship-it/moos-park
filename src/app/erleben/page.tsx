import Link from "next/link";
import Reveal from "@/components/Reveal";
import FlipText from "@/components/FlipText";

export const metadata = {
  title: "moos.park erleben – Tanzen, Events & Exklusivfeiern | moos.park",
  description:
    "Events, Tanzabende und Exklusivfeiern im moos.park Pöttmes – finde in einem Klick, was zu dir passt.",
};

const CATEGORIES = [
  {
    title: "Events",
    href: "/events",
    items: ["Partys", "Konzerte", "Open Air"],
    cta: "Zu den Events",
  },
  {
    title: "Tanzabend",
    href: "/tanzveranstaltungen",
    items: ["Ü40", "Ü50", "Tanzen"],
    cta: "Zum Tanzabend",
  },
  {
    title: "Exklusivfeiern",
    href: "/eventlocation-region",
    items: ["Hochzeiten", "Firmenevents", "Mietlocation"],
    cta: "Location entdecken",
  },
];

export default function ErlebenPage() {
  return (
    <div>
      <section className="px-6 pb-12 pt-32 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          moos.park erleben
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          Tanzen.
          <br />
          Exklusiv feiern.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Finde in einem Klick, was zu dir passt – Events, Tanzabende oder
          deine eigene Feier im moos.park.
        </p>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <Reveal key={cat.title} delay={i * 0.1}>
              <Link
                href={cat.href}
                className="group flex h-full flex-col rounded-2xl border border-foreground/10 p-8 transition-colors hover:border-accent-lime"
              >
                <h2 className="text-2xl font-black uppercase text-foreground">
                  {cat.title}
                </h2>
                <ul className="mt-6 flex flex-1 flex-col gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg bg-foreground/[0.04] px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="mt-8 inline-block text-xs font-black uppercase tracking-wide text-accent-lime">
                  <FlipText text={`${cat.cta} →`} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
