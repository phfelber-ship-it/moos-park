import { NextResponse } from "next/server";
import { getInboxEntries, markInboxRead, deleteInboxEntry } from "@/lib/inbox";

// GET wird nach jedem "Als gelesen"-Klick sofort erneut abgerufen (siehe
// InboxManager.tsx), um immer den tatsaechlich gespeicherten Stand zu
// zeigen - darf deshalb nie statisch/gecacht ausgeliefert werden.
export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getInboxEntries();
  return NextResponse.json({ entries });
}

export async function PATCH(request: Request) {
  const { id, read } = (await request.json()) as { id?: string; read?: boolean };
  if (!id) {
    return NextResponse.json({ error: "Keine ID angegeben." }, { status: 400 });
  }
  await markInboxRead(id, read ?? true);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Keine ID angegeben." }, { status: 400 });
  }
  await deleteInboxEntry(id);
  return NextResponse.json({ ok: true });
}
