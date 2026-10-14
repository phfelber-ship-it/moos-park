import Image from "next/image";
import Link from "next/link";
import FlipText from "@/components/FlipText";

// Wird anstelle der Event-Landingpage gezeigt, wenn ein Firmenevent im
// Adminpanel offline genommen wurde (z.B. am Eventtag, wenn sich kurzfristig
// etwas aendert). Die URL bleibt gleich, damit gedruckte Briefe/QR-Codes
// nicht ins Leere laufen.
export default function CompanyEventOfflinePage({ eventName }: { eventName: string }) {
  return (
    <section className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-32 text-center">
      <Image
        src="/images/logo.png"
        alt="moos.park"
        width={64}
        height={64}
        className="w-14 sm:w-16"
      />
      <p className="mt-8 text-sm font-black uppercase tracking-[0.15em] text-accent-lime">
        {eventName}
      </p>
      <h1 className="mt-5 max-w-3xl px-2 text-4xl font-black uppercase leading-[0.95] tracking-tight text-foreground sm:text-7xl">
        Hier hat sich kurzfristig etwas geändert.
      </h1>
      <p className="mx-auto mt-8 max-w-xl text-lg text-foreground/70">
        Diese Veranstaltung ist aktuell nicht mehr online. Gerade am Eventtag
        kann sich manchmal etwas ändern – wir halten Sie gern auf dem Laufenden.
        Für alle Informationen melden Sie sich einfach direkt bei uns, wir
        helfen Ihnen persönlich weiter.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href={`mailto:s.geisler@moos-park.de?subject=${encodeURIComponent(`Anfrage ${eventName}`)}`}
          className="inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          <FlipText text="Kontakt aufnehmen" />
        </a>
        <Link
          href="/"
          className="inline-block rounded-lg border border-foreground/20 px-8 py-3 text-sm font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime"
        >
          <FlipText text="Zur Startseite" />
        </Link>
      </div>
    </section>
  );
}
