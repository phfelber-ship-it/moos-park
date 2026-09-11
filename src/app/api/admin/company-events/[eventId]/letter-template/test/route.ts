import { NextResponse } from "next/server";
import { generateInvitationLetterPdf } from "@/lib/event-experience-letter";
import type { LetterTemplate } from "@/lib/event-experience-letter-template";
import { getCompanyEvent, companyEventToInfo } from "@/lib/company-events";
import type { EventExperienceRegistration } from "@/lib/event-experience";

// Erzeugt den Einladungsbrief mit dem aktuell im Editor stehenden (auch
// ungespeicherten) Vorlagentext + Beispieldaten - analog zum
// Testmail-Versand fuer die E-Mail-Vorlagen, nur ohne Versand, da der
// Brief ohnehin direkt als PDF angezeigt wird.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const body = (await request.json().catch(() => null)) as
    | { introText?: string; detailsText?: string; closingNoteText?: string }
    | null;
  if (!body?.introText?.trim() || !body.detailsText?.trim() || !body.closingNoteText?.trim()) {
    return NextResponse.json(
      { error: "Alle drei Textabschnitte sind Pflichtfelder." },
      { status: 400 }
    );
  }

  const event = await getCompanyEvent(eventId);
  const template: LetterTemplate = {
    introText: body.introText,
    detailsText: body.detailsText,
    closingNoteText: body.closingNoteText,
  };

  const sampleContact = {
    id: "test",
    eventId,
    company: "Musterfirma GmbH",
    salutation: "Herr",
    lastName: "Mustermann",
    firstName: "Max",
    street: "Musterstraße 1",
    zip: "86554",
    city: "Pöttmes",
    email: "",
    phone: "",
    message: "",
    companions: [],
    status: "NEU",
    createdAt: new Date().toISOString(),
    invitationSentAt: null,
    tickets: [],
    cancelledAt: null,
    cancelledAttendees: null,
    source: "MANUAL",
    reminderSentAt: null,
  } as unknown as EventExperienceRegistration;

  const bytes = await generateInvitationLetterPdf(
    sampleContact,
    template,
    event ? companyEventToInfo(event) : undefined
  );

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Testbrief.pdf"`,
    },
  });
}
