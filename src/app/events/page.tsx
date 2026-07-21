import { getEvents } from "@/lib/clubscale";
import EventCard from "@/components/EventCard";

export const metadata = {
  title: "Events - moos.park | Eventlocation",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-4xl font-black uppercase text-white">Events</h1>
      <p className="mt-3 max-w-xl text-white/60">
        Alle kommenden Veranstaltungen im moos.park – von Open Airs über
        Konzerte bis zu Clubnächten.
      </p>

      {events.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-white/60">
          Aktuell sind keine Events verfügbar.
        </p>
      )}
    </div>
  );
}
