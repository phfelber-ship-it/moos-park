import { NextResponse } from "next/server";
import {
  getInvitationTemplate,
  saveInvitationTemplate,
} from "@/lib/event-experience-template";

export async function GET() {
  try {
    const template = await getInvitationTemplate();
    return NextResponse.json({ template });
  } catch (err) {
    console.error("Vorlage konnte nicht geladen werden:", err);
    return NextResponse.json(
      { error: "Vorlage konnte nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { subject?: string; body?: string }
    | null;
  if (!body?.subject?.trim() || !body.body?.trim()) {
    return NextResponse.json(
      { error: "Betreff und Text sind Pflichtfelder." },
      { status: 400 }
    );
  }

  try {
    await saveInvitationTemplate({
      subject: body.subject.trim(),
      body: body.body,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Vorlage konnte nicht gespeichert werden:", err);
    return NextResponse.json(
      { error: "Vorlage konnte nicht gespeichert werden." },
      { status: 500 }
    );
  }
}
