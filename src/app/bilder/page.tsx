import Image from "next/image";

export const metadata = { title: "Bilder - moos.park | Eventlocation" };

const GALLERIES = [
  {
    title: "Ü30 Party Open Air Summer Edition + Aftershowparty",
    date: "18. Juli 2026",
    image: "/images/gallery-2.jpg",
  },
  {
    title: "Summer Break Party 2026 – Next Date: Summer Open Juli 2026",
    date: "09. Mai 2026",
    image: "/images/gallery-1.jpg",
  },
  { title: "2016er Party | April 2026", date: "25. April 2026" },
  { title: "80er - 90er Party | April 2026", date: "18. April 2026" },
  { title: "Die Ü30 Party | Auf 2 Areas", date: "11. April 2026" },
  { title: "Mega Mallorca Party | Frenzy Live", date: "05. April 2026" },
  { title: "2010er Party | April 2026", date: "04. April 2026" },
  {
    title: "5 DJ - 2 Areas - 1 Nacht | Du entscheidest.",
    date: "28. März 2026",
  },
  { title: "Zeitreise - Raus aus dem Alltag!", date: "21. März 2026" },
];

export default function BilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black uppercase text-white">Bilder</h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GALLERIES.map((g) => (
          <div
            key={g.title}
            className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03]"
          >
            <div className="relative aspect-[4/3] w-full bg-white/5">
              {g.image && (
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              )}
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-accent">{g.date}</p>
              <h3 className="mt-1 font-black uppercase text-white">
                {g.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
