import Link from "next/link";

const SECTIONS = [
  {
    href: "/admin/hero-bilder",
    title: "Hero-Bilder",
    text: "Hintergrund-Slideshow auf Startseite und /links verwalten.",
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
    </div>
  );
}
