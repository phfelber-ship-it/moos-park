import Link from "next/link";
import ClearCacheButton from "@/components/ClearCacheButton";

const SECTIONS = [
  {
    href: "/admin/hero-bilder",
    title: "Hero-Bilder",
    text: "Hintergrund-Slideshow auf Startseite und /links verwalten.",
  },
  {
    href: "/admin/raeume",
    title: "Räume",
    text: "Bilder je Raum (Main-Halle, Terrasse, Lounge, ...) verwalten.",
  },
  {
    href: "/admin/favicon",
    title: "Favicon",
    text: "Das kleine Icon im Browser-Tab austauschen.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Admin
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Interne Verwaltung fuer moos.park - nicht oeffentlich verlinkt.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-2xl border border-foreground/10 p-6 transition-colors hover:border-accent-lime"
          >
            <h2 className="text-lg font-black uppercase text-foreground">
              {s.title}
            </h2>
            <p className="mt-2 text-sm text-foreground/60">{s.text}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Cache
        </h2>
        <p className="mt-2 text-sm text-foreground/60">
          Erzwingt eine sofortige Aktualisierung aller Seiten (statt bis zu
          5 Minuten zu warten).
        </p>
        <ClearCacheButton />
      </div>
    </div>
  );
}
