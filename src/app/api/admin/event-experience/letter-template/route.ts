import { NextResponse } from "next/server";
import {
  getLetterTemplate,
  saveLetterTemplate,
} from "@/lib/event-experience-letter-template";

export async function GET() {
  try {
    const template = await getLetterTemplate();
    return NextResponse.json({ template });
  } catch (err) {
    console.error("Briefvorlage konnte nicht geladen werden:", err);
    return NextResponse.json(
      { error: "Briefvorlage konnte nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { introText?: string; detailsText?: string; closingNoteText?: string }
    | null;
  if (!body?.introText?.trim() || !body.detailsText?.trim() || !body.closingNoteText?.trim()) {
    return NextResponse.json(
      { error: "Alle drei Textfelder sind Pflicht." },
      { status: 400 }
    );
  }

  try {
    await saveLetterTemplate({
      introText: body.introText,
      detailsText: body.detailsText,
      closingNoteText: body.closingNoteText,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Briefvorlage konnte nicht gespeichert werden:", err);
    return NextResponse.json(
      { error: "Briefvorlage konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
