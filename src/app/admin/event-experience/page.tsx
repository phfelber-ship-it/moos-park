import { getRegistrations } from "@/lib/event-experience";
import { getInvitationTemplate } from "@/lib/event-experience-template";
import { getLetterTemplate } from "@/lib/event-experience-letter-template";
import { getCompanyContacts } from "@/lib/company-contacts";
import EventExperienceManager from "@/components/EventExperienceManager";
import EventExperienceTemplateEditor from "@/components/EventExperienceTemplateEditor";
import EventExperienceContactsPanel from "@/components/EventExperienceContactsPanel";
import EventExperienceLetterTemplateEditor from "@/components/EventExperienceLetterTemplateEditor";

export const dynamic = "force-dynamic";

export default async function EventExperienceAdminPage() {
  const [registrations, template, letterTemplate, companyContacts] = await Promise.all([
    getRegistrations(),
    getInvitationTemplate(),
    getLetterTemplate(),
    getCompanyContacts(),
  ]);

  const manualContacts = registrations.filter((r) => r.source === "MANUAL");

  return (
    <div className="mx-auto max-w-7xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Event Experience
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Anmeldungen von /event-experience – als Pipeline nach Status
        sortiert. Karten per Drag & Drop in eine andere Spalte ziehen oder
        über das Dropdown den Status manuell setzen. In &bdquo;Einladen&ldquo;
        kann pro Anmeldung eine Einladung mit individuellen PDF-Tickets
        verschickt werden.
      </p>
      <EventExperienceContactsPanel
        initialContacts={manualContacts}
        companyContacts={companyContacts}
      />
      <EventExperienceLetterTemplateEditor initialTemplate={letterTemplate} />
      <EventExperienceTemplateEditor initialTemplate={template} />
      <EventExperienceManager initialRegistrations={registrations} />
    </div>
  );
}
