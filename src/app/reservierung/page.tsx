import { getEvents } from "@/lib/clubscale";
import ReservationWizard from "@/components/ReservationWizard";

// Canonical bewusst fest auf /reservierung ohne Query - die ?event=...-
// Variante (aus EventCard "Tisch reservieren"-Links) preselected nur den
// Wizard, ist inhaltlich sonst identisch. Ohne canonical hat Google jede
// Event-Variante als eigenstaendiges Duplikat gewertet ("Duplikat - vom
// Nutzer nicht als kanonisch festgelegt").
export const metadata = {
  title: "Reservierung - moos.park | Eventlocation",
  description:
    "Tisch im moos.park Pöttmes reservieren – wähl dein Event, deine Wunschzeit und sichere dir bequem online deinen Platz.",
  alternates: { canonical: "/reservierung" },
};

export default async function ReservierungPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event: eventId } = await searchParams;
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-32">
      <h1 className="text-center text-4xl font-black uppercase text-foreground">
        Reservierung
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-foreground/60">
        Sichere dir deinen Platz: Veranstaltung wählen, Personenzahl und
        Ankunftszeit angeben – in wenigen Schritten fertig.
      </p>

      <div className="mt-14">
        <ReservationWizard
          events={events}
          preselectedEventId={eventId ?? null}
        />
      </div>
    </div>
  );
}
