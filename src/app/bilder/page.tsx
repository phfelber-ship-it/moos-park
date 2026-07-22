import Image from "next/image";
import Link from "next/link";
import { photosFor } from "@/lib/galleryPhotos";

export const metadata = { title: "Bilder - moos.park | Eventlocation" };

export const GALLERIES = [
  {
    slug: "ue30-party-open-air-summer-edition",
    title: "Ü30 Party Open Air Summer Edition + Aftershowparty",
    date: "18. Juli 2026",
  },
  {
    slug: "summer-break-party-2026",
    title: "Summer Break Party 2026 – Next Date: Summer Open Juli 2026",
    date: "09. Mai 2026",
  },
  {
    slug: "2016er-party-april-2026",
    title: "2016er Party | April 2026",
    date: "25. April 2026",
  },
  {
    slug: "80er-90er-party-april-2026",
    title: "80er - 90er Party | April 2026",
    date: "18. April 2026",
  },
  {
    slug: "ue30-party-2-areas",
    title: "Die Ü30 Party | Auf 2 Areas",
    date: "11. April 2026",
  },
  {
    slug: "mega-mallorca-party-frenzy-live",
    title: "Mega Mallorca Party | Frenzy Live",
    date: "05. April 2026",
  },
  {
    slug: "2010er-party-april-2026",
    title: "2010er Party | April 2026",
    date: "04. April 2026",
  },
  {
    slug: "5-dj-2-areas-1-nacht",
    title: "5 DJ - 2 Areas - 1 Nacht | Du entscheidest.",
    date: "28. März 2026",
  },
  {
    slug: "zeitreise-raus-aus-dem-alltag",
    title: "Zeitreise - Raus aus dem Alltag!",
    date: "21. März 2026",
  },
];

export default function BilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black uppercase text-foreground">Bilder</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERIES.map((g, i) => (
          <Link
            key={g.slug}
            href={`/bilder/${g.slug}`}
            className="group overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.025] transition-colors hover:border-accent/40"
          >
            <div className="relative aspect-[4/3] w-full bg-foreground/5">
              <Image
                src={photosFor(i, 1)[0]}
                alt={g.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-accent">{g.date}</p>
              <h3 className="mt-1 font-black uppercase text-foreground">
                {g.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
