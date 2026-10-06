import { NextResponse } from "next/server";
import { getInboxReplySettings, setInboxReplySettings } from "@/lib/inbox-reply-settings";

export async function GET() {
  const settings = await getInboxReplySettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { fromName?: string; signature?: string }
    | null;
  if (!body || typeof body.fromName !== "string" || typeof body.signature !== "string") {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }
  await setInboxReplySettings({
    fromName: body.fromName.trim() || "moos.park Team",
    signature: body.signature,
  });
  return NextResponse.json({ ok: true });
}
