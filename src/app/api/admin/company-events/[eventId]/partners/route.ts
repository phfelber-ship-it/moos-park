import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { addEventPartner, getCompanyEvent, removeEventPartner } from "@/lib/company-events";

export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024;

// Partner-Logo hochladen (multipart: file, name).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await getCompanyEvent(eventId);
  if (!event) return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });

  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Kein Logo erhalten." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Bitte eine Bilddatei hochladen." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Logo ist zu groß (max. 4 MB)." }, { status: 400 });
  }

  const partner = await addEventPartner(eventId, name, file);
  if (!partner) return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
  revalidatePath(`/${event.slug}`);
  return NextResponse.json({ partner });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const event = await getCompanyEvent(eventId);
  if (!event) return NextResponse.json({ error: "Event nicht gefunden." }, { status: 404 });
  const { partnerId } = (await request.json().catch(() => ({}))) as { partnerId?: string };
  if (!partnerId) return NextResponse.json({ error: "Keine ID angegeben." }, { status: 400 });
  const ok = await removeEventPartner(eventId, partnerId);
  if (!ok) return NextResponse.json({ error: "Partner nicht gefunden." }, { status: 404 });
  revalidatePath(`/${event.slug}`);
  return NextResponse.json({ ok: true });
}
