import Link from "next/link";
import ClearCacheButton from "@/components/ClearCacheButton";
import FacebookPixelStatus from "@/components/FacebookPixelStatus";
import FormHealthCheckStatus from "@/components/FormHealthCheckStatus";
import { getInboxEntries } from "@/lib/inbox";
import { getCompaniesWithLeads } from "@/lib/companies";
import { getRegistrations } from "@/lib/event-experience";
import { getLastFormHealthCheckResult } from "@/lib/form-health-check";

// Admin-Panel gruppiert nach Themenbereichen (statt einer flachen Liste),
// je Block eine eigene Zeile fuer bessere Lesbarkeit auf allen
// Bildschirmgroessen. Reihenfolge/Gruppierung siehe SECTION_GROUPS unten.
type Section = {
  href: string;
  title: string;
  text: string;
};

type SectionGroup = {
  title: string;
  sections: Section[];
};

const SECTION_GROUPS: SectionGroup[] = [
  {
    title: "Nachrichten",
    sections: [
      {
        href: "/admin/postfach",
        title: "Postfach",
        text: "Eingehende Kontaktanfragen, Bewerbungen, Reservierungen & mehr.",
      },
    ],
  },
  {
    title: "Firmenevents",
    sections: [
      {
        href: "/admin/firmen",
        title: "Anfrage Firmenfeier über die Webseite",
        text: "Firmenanfragen von /firmenevents, Leads & Status verwalten.",
      },
      {
        href: "/admin/firmenevents",
        title: "Firmenevents",
        text: "Alle Firmenevents (inkl. THE EVENT EXPERIENCE) verwalten: Landingpage, CRM, Vorlagen & Erinnerungen.",
      },
      {
        href: "/admin/firmenkontakte",
        title: "Firmenkontakte",
        text: "Zentrale Firmenkunden-Datenbank fuer beliebige Einladungen & Aktionen.",
      },
      {
        href: "/admin/scanner",
        title: "Scanner",
        text: "QR-Code-Check-in fürs Einlasspersonal - Event auswählen, Link fürs Handy holen.",
      },
    ],
  },
  {
    title: "Webseite bearbeiten",
    sections: [
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
        href: "/admin/tanzabende",
        title: "Tanzabende",
        text: "Termine für /tanzveranstaltungen anlegen, bearbeiten, duplizieren.",
      },
    ],
  },
  {
    title: "Analytics",
    sections: [
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
        href: "/admin/anhaengerwerbung",
        title: "Anhängerwerbung",
        text: "Bannerbilder für Werbe-Anhänger verwalten & Scans/Klicks auswerten.",
      },
      {
        href: "/admin/ki-assistent",
        title: "KI-Assistent",
        text: "Tägliche KI-Analyse: Empfehlungen für mehr Tickets, Reservierungen & App-Downloads.",
      },
    ],
  },
  {
    title: "Einstellungen",
    sections: [
      {
        href: "/admin/benutzer",
        title: "Benutzer",
        text: "Weitere Admin-Zugänge anlegen oder entfernen.",
      },
      {
        href: "/admin/formular-mail",
        title: "Formular-Mail",
        text: "SMTP-Benachrichtigungen je Formular konfigurieren & Verbindung testen.",
      },
    ],
  },
];

// Cache, Pixel und Formular-Check sind keine reinen Link-Karten (Button
// bzw. Live-Status), werden aber optisch wie die anderen
// "Einstellungen"-Karten dargestellt.

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

  // Event-Experience-Anmeldungen mit Status "NEU" - noch nicht
  // gesichtet/bearbeitet. Best-effort, analog zu newCompaniesCount. Nur
  // echte Web-Anmeldungen zaehlen (source "WEB") - manuell im Adminpanel
  // angelegte Briefkontakte (source "MANUAL") starten zwar auch mit Status
  // "NEU", sind aber keine echten Interessenten und sollen die Zahl hier
  // nicht aufblaehen (siehe auch crmRegistrations-Filter in
  // app/admin/firmenevents/[eventId]/page.tsx).
  let newRegistrationsCount = 0;
  try {
    const registrations = await getRegistrations();
    newRegistrationsCount = registrations.filter(
      (r) => r.status === "NEU" && r.source !== "MANUAL"
    ).length;
  } catch {
    newRegistrationsCount = 0;
  }

  // Letztes Formular-Check-Ergebnis fuer die Status-Karte in
  // "Einstellungen" - best-effort, siehe getLastFormHealthCheckResult().
  const formHealthReport = await getLastFormHealthCheckResult();

  const badgeCounts: Record<string, number> = {
    "/admin/postfach": unreadCount,
    "/admin/firmen": newCompaniesCount,
    "/admin/firmenevents": newRegistrationsCount,
  };

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Admin
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Interne Verwaltung fuer moos.park - nicht oeffentlich verlinkt.
      </p>

      {SECTION_GROUPS.map((group) => (
        <div key={group.title} className="mt-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
            {group.title}
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {group.sections.map((s) => {
              const badge = badgeCounts[s.href] ?? 0;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="relative rounded-2xl border border-foreground/10 p-6 transition-colors hover:border-accent-lime"
                >
                  {badge > 0 && (
                    <span className="absolute right-4 top-4 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-lime px-1.5 text-xs font-black text-black">
                      {badge}
                    </span>
                  )}
                  <h3 className="text-lg font-black uppercase text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/60">{s.text}</p>
                </Link>
              );
            })}
            {group.title === "Einstellungen" && (
              <>
                <div className="rounded-2xl border border-foreground/10 p-6">
                  <h3 className="text-lg font-black uppercase text-foreground">
                    Cache
                  </h3>
                  <p className="mt-2 text-sm text-foreground/60">
                    Erzwingt eine sofortige Aktualisierung aller Seiten
                    (statt bis zu 5 Minuten zu warten).
                  </p>
                  <ClearCacheButton />
                </div>
                <div className="rounded-2xl border border-foreground/10 p-6">
                  <FacebookPixelStatus />
                </div>
                <div className="rounded-2xl border border-foreground/10 p-6">
                  <FormHealthCheckStatus initialReport={formHealthReport} />
                </div>
              </>
            )}
          </div>
        </div>
      ))}

    </div>
  );
}
