import { NextResponse } from "next/server";
import { getRegistration } from "@/lib/event-experience";
import { generateInvitationLetterPdf } from "@/lib/event-experience-letter";
import { getLetterTemplate } from "@/lib/event-experience-letter-template";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contact = await getRegistration(id);
  if (!contact) {
    return NextResponse.json({ error: "Kontakt nicht gefunden." }, { status: 404 });
  }

  const template = await getLetterTemplate();
  const bytes = await generateInvitationLetterPdf(contact, template);
  const download = new URL(request.url).searchParams.get("dl") === "1";
  const filename = `Einladung-${contact.company.replace(/[^a-z0-9]+/gi, "-")}.pdf`;

  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
    },
  });
}
