import { notFound } from "next/navigation";
import { getCompanyEvent } from "@/lib/company-events";
import { getRegistrationsForEvent } from "@/lib/event-experience";
import ScannerOverview from "@/components/ScannerOverview";

export const dynamic = "force-dynamic";

// Check-in-Uebersicht fuer ein Event: Ticketanzahl gesamt/gescannt/offen +
// Namensliste zum manuellen Einchecken, falls ein QR-Code am Einlass mal
// nicht funktioniert (verschmutzt, Akku leer beim Gast, etc.).
export default async function ScannerOverviewPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getCompanyEvent(eventId);
  if (!event) notFound();

  const registrations = await getRegistrationsForEvent(eventId);
  const tickets = registrations.flatMap((r) =>
    r.tickets.map((t) => ({
      code: t.code,
      name: `${t.salutation} ${t.firstName} ${t.lastName}`.trim(),
      company: r.company,
      checkedInAt: t.checkedInAt,
    }))
  );

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <p className="text-xs font-black uppercase tracking-wide text-accent-lime">
        Scanner / {event.name}
      </p>
      <h1 className="text-2xl font-black uppercase text-foreground">
        Check-in-Übersicht
      </h1>
      <ScannerOverview eventId={eventId} initialTickets={tickets} />
    </div>
  );
}
