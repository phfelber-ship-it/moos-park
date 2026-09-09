import { getCompanyEvents } from "@/lib/company-events";
import CompanyEventsList from "@/components/CompanyEventsList";

export const dynamic = "force-dynamic";

export default async function FirmeneventsAdminPage() {
  const events = await getCompanyEvents();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Firmenevents
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Alle Firmenevents (wie THE EVENT EXPERIENCE) an einem Ort - jedes
        Event bekommt automatisch eine eigene Landingpage, CRM-Pipeline,
        E-Mail-/Erinnerungs-Vorlagen und Ticket-/Brief-Versand.
      </p>
      <CompanyEventsList initialEvents={events} />
    </div>
  );
}
