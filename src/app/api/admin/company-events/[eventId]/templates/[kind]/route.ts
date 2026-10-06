import { NextResponse } from "next/server";
import { getEventTemplate, saveEventTemplate, type TemplateKind } from "@/lib/event-experience-template";

function isValidKind(kind: string): kind is TemplateKind {
  return kind === "BESTAETIGUNG" || kind === "ERINNERUNG";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string; kind: string }> }
) {
  const { eventId, kind } = await params;
  if (!isValidKind(kind)) {
    return NextResponse.json({ error: "Unbekannte Vorlagenart." }, { status: 400 });
  }
  const template = await getEventTemplate(eventId, kind);
  return NextResponse.json({ template });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ eventId: string; kind: string }> }
) {
  const { eventId, kind } = await params;
  if (!isValidKind(kind)) {
    return NextResponse.json({ error: "Unbekannte Vorlagenart." }, { status: 400 });
  }
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
    await saveEventTemplate(eventId, kind, { subject: body.subject.trim(), body: body.body });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Vorlage konnte nicht gespeichert werden:", err);
    return NextResponse.json({ error: "Vorlage konnte nicht gespeichert werden." }, { status: 500 });
  }
}
