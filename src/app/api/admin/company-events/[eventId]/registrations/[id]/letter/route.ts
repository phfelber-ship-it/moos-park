import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";
import { generateInvitationLetterPdf } from "@/lib/event-experience-letter";
import { getLetterTemplate } from "@/lib/event-experience-letter-template";
import { getCompanyEvent, companyEventToInfo } from "@/lib/company-events";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string; id: string }> }
) {
  const { eventId, id } = await params;
  const contact = await getRegistration(id);
  if (!contact) {
    return NextResponse.json({ error: "Kontakt nicht gefunden." }, { status: 404 });
  }

  const event = await getCompanyEvent(eventId);
  const template = await getLetterTemplate();
  const bytes = await generateInvitationLetterPdf(
    contact,
    template,
    event ? companyEventToInfo(event) : undefined
  );
  const download = new URL(request.url).searchParams.get("dl") === "1";
  const filename = `Einladung-${contact.company.replace(/[^a-z0-9]+/gi, "-")}.pdf`;

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
    },
  });
}
