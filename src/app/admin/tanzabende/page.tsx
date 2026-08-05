import { getDanceEvents } from "@/lib/dance-events";
import DanceEventsManager from "@/components/DanceEventsManager";

export const dynamic = "force-dynamic";

export default async function TanzabendeAdminPage() {
  const events = await getDanceEvents();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Tanzabende verwalten
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Termine für /tanzveranstaltungen. Änderungen erscheinen sofort auf
        der Seite.
      </p>
      <DanceEventsManager initialEvents={events} />
    </div>
  );
}
