import { getEvents } from "@/lib/clubscale";
import QuickTicketFlow from "@/components/QuickTicketFlow";

export const metadata = {
  title: "Event-Tickets - moos.park | Eventlocation",
};

export default async function EventTicketsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-center text-4xl font-black uppercase text-foreground">
        Event-Tickets
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-foreground/60">
        Event auswählen, Ticket wählen, sichern – so einfach geht's.
      </p>

      {events.length === 0 ? (
        <p className="mt-12 text-center text-foreground/60">
          Aktuell sind keine Events verfügbar.
        </p>
      ) : (
        <div className="mt-14">
          <QuickTicketFlow events={events} />
        </div>
      )}
    </div>
  );
}
