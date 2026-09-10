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
  // Manuell angelegte Kontakte (nur fuer den Einladungsbrief-Versand
  // gedacht, siehe EventExperienceContactsPanel) tauchen bewusst NICHT im
  // CRM-Kanban-Board auf - dort soll nur erscheinen, wer sich tatsaechlich
  // ueber die Website angemeldet hat. Sobald sich so ein Kontakt spaeter
  // selbst ueber das Formular anmeldet, entsteht dafuer eine eigene,
  // separate WEB-Registrierung, die dann ganz normal im CRM auftaucht.
  const crmRegistrations = registrations.filter((r) => r.source !== "MANUAL");
  const apiBase = `/api/admin/company-events/${eventId}`;

  // Kleines Dashboard oben auf der Seite: schneller Ueberblick ueber
  // Einladungen/Tickets, ohne erst ins CRM-Board oder die
  // Scanner-Uebersicht wechseln zu muessen. Gleiche CRM-Filterung wie oben.
  const invitationsSent = crmRegistrations.filter((r) => r.invitationSentAt).length;
  const allTickets = crmRegistrations.flatMap((r) => r.tickets);
  const ticketsTotal = allTickets.length;
  const ticketsScanned = allTickets.filter((t) => t.checkedInAt).length;
  const ticketsOpen = ticketsTotal - ticketsScanned;

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
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
        </div>
        <a
          href={`/${event.slug}`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-foreground/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime"
        >
          Zur Webseitenvorschau
        </a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-foreground/10 p-4 text-center">
          <p className="text-2xl font-black text-foreground">{invitationsSent}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
            Einladungen verschickt
          </p>
        </div>
        <div className="rounded-2xl border border-foreground/10 p-4 text-center">
          <p className="text-2xl font-black text-foreground">{ticketsTotal}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
            Tickets gesamt
          </p>
        </div>
        <div className="rounded-2xl border border-accent-lime/30 bg-accent-lime/10 p-4 text-center">
          <p className="text-2xl font-black text-accent-lime">{ticketsScanned}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
            Bereits gescannt
          </p>
        </div>
        <div className="rounded-2xl border border-foreground/10 p-4 text-center">
          <p className="text-2xl font-black text-foreground">{ticketsOpen}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-foreground/50">
            Noch offen
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-black uppercase tracking-wide text-accent-lime">
          CRM
        </h2>
        <EventExperienceManager
          initialRegistrations={crmRegistrations}
          apiBase={`${apiBase}/registrations`}
          exportUrl={`${apiBase}/export`}
          eventId={eventId}
        />
      </section>

      <EventExperienceContactsPanel
        initialContacts={manualContacts}
        companyContacts={companyContacts}
        contactsApiUrl={`${apiBase}/contacts`}
        lettersExportUrl={`${apiBase}/letters/export`}
        letterBaseUrl={`${apiBase}/registrations`}
      />

      <details className="group mt-12">
        <summary className="flex cursor-pointer list-none items-center gap-2">
          <h2 className="text-lg font-black uppercase tracking-wide text-accent-lime">
            E-Mail-Vorlagen
          </h2>
          <span className="text-foreground/30 transition-transform group-open:rotate-180">
            ▼
          </span>
        </summary>
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
      </details>
    </div>
  );
}
