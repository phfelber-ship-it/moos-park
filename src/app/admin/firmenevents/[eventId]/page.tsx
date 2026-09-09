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

      <section className="mt-10">
        <h2 className="text-lg font-black uppercase tracking-wide text-accent-lime">
          CRM
        </h2>
        <EventExperienceManager
          initialRegistrations={registrations}
          apiBase={`${apiBase}/registrations`}
          exportUrl={`${apiBase}/export`}
          eventId={eventId}
        />
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-black uppercase tracking-wide text-accent-lime">
          Kontakte
        </h2>
        <p className="mt-1 text-xs text-foreground/50">
          Kontakte &amp; Einladungsbriefe
        </p>
        <EventExperienceContactsPanel
          initialContacts={manualContacts}
          companyContacts={companyContacts}
          contactsApiUrl={`${apiBase}/contacts`}
          lettersExportUrl={`${apiBase}/letters/export`}
          letterBaseUrl={`${apiBase}/registrations`}
        />
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-black uppercase tracking-wide text-accent-lime">
          E-Mail-Vorlagen
        </h2>
        <p className="mt-1 text-xs text-foreground/50">
          Einladungsbrief, Bestätigungs- und Erinnerungsvorlage
        </p>
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
        <CompanyEventReminderEditor
          eventId={eventId}
          initial={event.reminderWorkflow}
          initialEventDateTime={event.eventDateTime}
        />
      </section>
    </div>
  );
}
