import { getRegistrations } from "@/lib/event-experience";
import { generateInvitationLettersBundle } from "@/lib/event-experience-letter";
import { getLetterTemplate } from "@/lib/event-experience-letter-template";

// Alle manuell angelegten Kontakte als ein gemeinsames, druckfertiges PDF
// (eine Seite pro Kontakt).
export async function GET() {
  const registrations = await getRegistrations();
  const contacts = registrations.filter((r) => r.source === "MANUAL");

  if (contacts.length === 0) {
    return new Response("Noch keine Kontakte angelegt.", { status: 404 });
  }

  const template = await getLetterTemplate();
  const bytes = await generateInvitationLettersBundle(contacts, template);
  const filename = `Einladungsbriefe-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
