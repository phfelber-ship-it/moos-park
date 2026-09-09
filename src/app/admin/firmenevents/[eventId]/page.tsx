import { notFound } from "next/navigation";
import { getCompanyEvent } from "@/lib/company-events";
import { getRegistrationsForEvent } from "@/lib/event-experience";
import { getEventTemplate } from "@/lib/event-experience-template";
import { getLetterTemplate } from "@/lib/event-experience-letter-template";
import { getCompanyContacts } from "@/lib/company-contacts";
import EventExperienceManager from "@/components/EventExperienceManager";
import EventExperienceContactsPanel from "@/components/EventExperienceContactsPanel";
import EventExperienceLetterTemplateEditor from "@/components/EventExperienceLetterTemplateEditor";
import CompanyEventTemplateEditor from "@/components/CompanyEventTemplateEditor";
import CompanyEventReminderEditor from "@/components/CompanyEventReminderEditor";

export const dynamic = "force-dynamic";

export default async function CompanyEventAdminPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = await getCompanyEvent(eventId);
  if (!event) notFound();

  const [registrations, bestaetigungTemplate, erinnerungTemplate, letterTemplate, companyContacts] =
    await Promise.all([
      getRegistrationsForEvent(eventId),
      getEventTemplate(eventId, "BESTAETIGUNG"),
      getEventTemplate(eventId, "ERINNERUNG"),
      getLetterTemplate(),
      getCompanyContacts(),
    ]);

  const manualContacts = registrations.filter((r) => r.source === "MANUAL");
  const apiBase = `/api/admin/company-events/${eventId}`;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <p className="text-xs font-black uppercase tracking-wide text-accent-lime">
        Firmenevents / {event.name}
      </p>
      <h1 className="text-2xl font-black uppercase text-foreground">
        {event.name}
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Öffentliche Seite: <code>/{event.slug}</code> · {event.dateLabel} ·{" "}
        {event.locationName}
      </p>

      <CompanyEventReminderEditor
        eventId={eventId}
        initial={event.reminderWorkflow}
        hasEventDateTime={Boolean(event.eventDateTime)}
      />

      <EventExperienceContactsPanel
        initialContacts={manualContacts}
        companyContacts={companyContacts}
        contactsApiUrl={`${apiBase}/contacts`}
        lettersExportUrl={`${apiBase}/letters/export`}
        letterBaseUrl={`${apiBase}/registrations`}
      />
      <EventExperienceLetterTemplateEditor initialTemplate={letterTemplate} />
      <CompanyEventTemplateEditor
        eventId={eventId}
        kind="BESTAETIGUNG"
        title="Bestätigungs-/Einladungs-E-Mail-Vorlage"
        initialTemplate={bestaetigungTemplate}
      />
      <CompanyEventTemplateEditor
        eventId={eventId}
        kind="ERINNERUNG"
        title="Erinnerungs-E-Mail-Vorlage"
        initialTemplate={erinnerungTemplate}
      />
      <EventExperienceManager
        initialRegistrations={registrations}
        apiBase={`${apiBase}/registrations`}
        exportUrl={`${apiBase}/export`}
        eventId={eventId}
      />
    </div>
  );
}
