import { getEvents } from "@/lib/clubscale";
import ReservationWizard from "@/components/ReservationWizard";

export const metadata = { title: "Reservierung - moos.park | Eventlocation" };

export default async function ReservierungPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event: eventId } = await searchParams;
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
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
