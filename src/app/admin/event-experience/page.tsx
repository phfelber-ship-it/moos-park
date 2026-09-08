import { getRegistrations } from "@/lib/event-experience";
import EventExperienceManager from "@/components/EventExperienceManager";

export const dynamic = "force-dynamic";

export default async function EventExperienceAdminPage() {
  const registrations = await getRegistrations();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Event Experience
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Anmeldungen von /event-experience – als Pipeline nach Status
        sortiert. Karten per Drag & Drop in eine andere Spalte ziehen oder
        über das Dropdown den Status manuell setzen.
      </p>
      <EventExperienceManager initialRegistrations={registrations} />
    </div>
  );
}
