import Image from "next/image";
import Link from "next/link";

// Schlanker Footer fuer reine Landingpages (z.B. /event-experience) - nur
// Logo und die rechtlich noetigen Links, keine Navigation, die vom
// Anmeldeformular ablenkt oder von der Seite wegfuehrt.
export default function MinimalFooter() {
  return (
    <footer className="border-t border-foreground/8 bg-foreground/[0.02] px-6 py-10">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-4 text-center">
        <Image
          src="/images/logo.png"
          alt="moos.park – Dein Hotspot für Tag und Nacht"
          width={64}
          height={64}
          className="w-16"
        />
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground/70">
          <Link href="/impressum" className="hover:text-foreground">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-foreground">
            Datenschutz
          </Link>
        </div>
        <p className="text-xs text-foreground/40">
          © MOOS-PARK GASTRONOMIE GMBH {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
