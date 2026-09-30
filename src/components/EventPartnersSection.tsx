import Reveal from "@/components/Reveal";
import type { EventPartner } from "@/lib/company-events";

// Abschnitt "Partner" der oeffentlichen Event-Seiten (vor den FAQ). Logos
// liegen auf hellen Kacheln, damit auch dunkle Logos auf dem dunklen
// Seitenhintergrund lesbar bleiben. Ohne Partner wird nichts gerendert.
export default function EventPartnersSection({
  partners,
  number,
}: {
  partners: EventPartner[];
  number: string;
}) {
  if (partners.length === 0) return null;
  return (
    <Reveal>
      <section className="rounded-3xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-14">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-accent-lime">
            {number} · Partner
          </p>
          <h2 className="mt-3 text-4xl font-black uppercase text-foreground sm:text-5xl">
            Unsere Partner
          </h2>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {partners.map((p) => (
            <div
              key={p.id}
              className="flex h-24 w-40 items-center justify-center rounded-2xl bg-white p-4 sm:h-28 sm:w-52"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logoUrl}
                alt={p.name || "Partner-Logo"}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
