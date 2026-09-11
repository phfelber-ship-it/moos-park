import { NextResponse } from "next/server";
import { setMatchDecision, removeMatchDecision } from "@/lib/company-event-matches";

function parseBody(body: unknown): { invitedKey: string; registeredKey: string } | null {
  if (!body || typeof body !== "object") return null;
  const invitedKey = String((body as Record<string, unknown>).invitedKey ?? "").trim();
  const registeredKey = String((body as Record<string, unknown>).registeredKey ?? "").trim();
  if (!invitedKey || !registeredKey) return null;
  return { invitedKey, registeredKey };
}

// Bestaetigt oder lehnt einen Match-Vorschlag im Anmeldungen-Abgleich ab
// (siehe EventExperienceMatchPanel) - status "confirmed" | "rejected".
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const raw = await request.json().catch(() => null);
  const parsed = parseBody(raw);
  const status = raw?.status === "rejected" ? "rejected" : "confirmed";
  if (!parsed) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  await setMatchDecision(eventId, parsed.invitedKey, parsed.registeredKey, status);
  return NextResponse.json({ ok: true });
}

// "Trennen" - macht eine Bestaetigung/Ablehnung wieder rueckgaengig, das
// Paar erscheint danach wieder als offener Vorschlag.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const raw = await request.json().catch(() => null);
  const parsed = parseBody(raw);
  if (!parsed) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  await removeMatchDecision(eventId, parsed.invitedKey, parsed.registeredKey);
  return NextResponse.json({ ok: true });
}
