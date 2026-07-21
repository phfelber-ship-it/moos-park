import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/8 bg-black/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-lg font-black text-foreground">
              moos<span className="text-accent">.</span>park
            </p>
            <p className="mt-3 max-w-xs text-sm text-black/60">
              Eventlocation in Pöttmes bei Aichach-Friedberg – Konzerte,
              Clubnächte, Firmenfeiern und mehr.
            </p>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-foreground">
              Navigation
            </p>
            <ul className="mt-3 space-y-2 text-sm text-black/60">
              <li><Link href="/events" className="hover:text-black">Events</Link></li>
              <li><Link href="/eventlocation" className="hover:text-black">Eventlocation</Link></li>
              <li><Link href="/jobs" className="hover:text-black">Jobs</Link></li>
              <li><Link href="/kontakt" className="hover:text-black">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-foreground">
              Kontakt
            </p>
            <ul className="mt-3 space-y-2 text-sm text-black/60">
              <li>Rudolf-Diesel-Straße 23, 86554 Pöttmes</li>
              <li>
                <a
                  href="https://wa.me/"
                  className="hover:text-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/place/moos.park"
                  className="hover:text-black"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Maps
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-black/8 pt-6 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} moos.park</p>
          <div className="flex gap-4">
            <Link href="/datenschutz" className="hover:text-black/70">
              Datenschutz
            </Link>
            <Link href="/impressum" className="hover:text-black/70">
              Impressum
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
