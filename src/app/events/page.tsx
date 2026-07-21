import { getEvents } from "@/lib/clubscale";
import EventsExplorer from "@/components/EventsExplorer";

export const metadata = {
  title: "Events - moos.park | Eventlocation",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <h1 className="text-center text-4xl font-black uppercase text-foreground sm:text-5xl">
        Kommende Events
      </h1>

      <div className="mt-12">
        <EventsExplorer events={events} />
      </div>
    </div>
  );
}
