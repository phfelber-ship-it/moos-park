import Link from "next/link";
import ClearCacheButton from "@/components/ClearCacheButton";
import FacebookPixelStatus from "@/components/FacebookPixelStatus";
import { getInboxEntries } from "@/lib/inbox";
import { getCompaniesWithLeads } from "@/lib/companies";

const SECTIONS = [
  {
    href: "/admin/postfach",
    title: "Postfach",
    text: "Eingehende Kontaktanfragen, Bewerbungen, Reservierungen & mehr.",
  },
  {
    href: "/admin/firmen",
    title: "Firmen",
    text: "Firmenanfragen von /firmenevents, Leads & Status verwalten.",
  },
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
  {
    href: "/admin/anhaengerwerbung",
    title: "Anhängerwerbung",
    text: "Bannerbilder für Werbe-Anhänger verwalten & Scans/Klicks auswerten.",
  },
  {
    href: "/admin/seo-tool",
    title: "SEO-Tool",
    text: "Gesamte Website auf Überschriften, Inhalte & technisches SEO prüfen.",
  },
  {
    href: "/admin/statistik",
    title: "Statistik",
    text: "Besucher, Seitenaufrufe, Absprungrate & mehr aus Google Analytics.",
  },
  {
    href: "/admin/ki-assistent",
    title: "KI-Assistent",
    text: "Tägliche KI-Analyse: Empfehlungen für mehr Tickets, Reservierungen & App-Downloads.",
  },
  {
    href: "/admin/tanzabende",
    title: "Tanzabende",
    text: "Termine für /tanzveranstaltungen anlegen, bearbeiten, duplizieren.",
  },
  {
    href: "/admin/benutzer",
    title: "Benutzer",
    text: "Weitere Admin-Zugänge anlegen oder entfernen.",
  },
];

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const inbox = await getInboxEntries();
  const unreadCount = inbox.filter((e) => !e.read).length;

  // Firmenanfragen mit Status "NEU" - noch nicht gesichtet/bearbeitet.
  // Best-effort: schlaegt Supabase evtl. mal fehl, soll aber nie das
  // gesamte Dashboard blockieren.
  let newCompaniesCount = 0;
  try {
    const companies = await getCompaniesWithLeads();
    newCompaniesCount = companies.filter((c) => c.status === "NEU").length;
  } catch {
    newCompaniesCount = 0;
  }

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
            className="relative rounded-2xl border border-foreground/10 p-6 transition-colors hover:border-accent-lime"
          >
            {s.href === "/admin/postfach" && unreadCount > 0 && (
              <span className="absolute right-4 top-4 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-lime px-1.5 text-xs font-black text-black">
                {unreadCount}
              </span>
            )}
            {s.href === "/admin/firmen" && newCompaniesCount > 0 && (
              <span className="absolute right-4 top-4 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-lime px-1.5 text-xs font-black text-black">
                {newCompaniesCount}
              </span>
            )}
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

      <FacebookPixelStatus />
    </div>
  );
}
