import { getRegistrationsForEvent } from "@/lib/event-experience";
import { generateInvitationLettersBundle } from "@/lib/event-experience-letter";
import { getLetterTemplate } from "@/lib/event-experience-letter-template";
import { getCompanyEvent, companyEventToInfo } from "@/lib/company-events";

// Alle manuell angelegten Kontakte DIESES Events als ein gemeinsames,
// druckfertiges PDF (eine Seite pro Kontakt) - generalisierte Version von
// api/admin/event-experience/letters/export.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const registrations = await getRegistrationsForEvent(eventId);
  const contacts = registrations.filter((r) => r.source === "MANUAL");

  if (contacts.length === 0) {
    return new Response("Noch keine Kontakte angelegt.", { status: 404 });
  }

  const event = await getCompanyEvent(eventId);
  const template = await getLetterTemplate();
  const bytes = await generateInvitationLettersBundle(
    contacts,
    template,
    event ? companyEventToInfo(event) : undefined
  );
  const filename = `Einladungsbriefe-${eventId}-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
