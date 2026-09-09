import { NextResponse } from "next/server";
import {
  addCompanyEvent,
  getCompanyEvents,
  isSlugReserved,
  isValidSlug,
  type CompanyEventInput,
} from "@/lib/company-events";
import { existingTopLevelRouteSegments } from "@/lib/company-events-routes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await getCompanyEvents();
    return NextResponse.json({ events });
  } catch (err) {
    console.error("Firmenevents konnten nicht geladen werden:", err);
    return NextResponse.json(
      { error: "Firmenevents konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | (Partial<CompanyEventInput> & Record<string, unknown>)
    | null;
  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const slug = String(body.slug ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const dateLabel = String(body.dateLabel ?? "").trim();
  const timeLabel = String(body.timeLabel ?? "").trim();
  const eventDateTime = body.eventDateTime ? String(body.eventDateTime) : null;
  const locationName = String(body.locationName ?? "").trim();
  const address = String(body.address ?? "").trim();
  const heroTitle = String(body.heroTitle ?? name).trim();
  const heroSubtitle = String(body.heroSubtitle ?? "").trim();
  const maxCompanions = Number(body.maxCompanions ?? 4) || 4;
  const timetable = Array.isArray(body.timetable)
    ? body.timetable
        .map((t) => {
          if (!t || typeof t !== "object") return null;
          const time = String((t as Record<string, unknown>).time ?? "").trim();
          const label = String((t as Record<string, unknown>).label ?? "").trim();
          if (!time || !label) return null;
          return { time, label };
        })
        .filter((t): t is { time: string; label: string } => t !== null)
    : [];

  if (!slug || !name || !dateLabel || !timeLabel || !locationName || !address) {
    return NextResponse.json(
      { error: "Slug, Name, Datum, Uhrzeit, Ort und Adresse sind Pflichtfelder." },
      { status: 400 }
    );
  }

  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: "Slug darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten." },
      { status: 400 }
    );
  }

  if (isSlugReserved(slug, existingTopLevelRouteSegments)) {
    return NextResponse.json(
      { error: `Der Slug "${slug}" ist bereits als Seite/Route belegt.` },
      { status: 400 }
    );
  }

  const events = await getCompanyEvents();
  if (events.some((e) => e.slug === slug)) {
    return NextResponse.json(
      { error: `Der Slug "${slug}" wird bereits von einem anderen Event verwendet.` },
      { status: 400 }
    );
  }

  try {
    const event = await addCompanyEvent({
      slug,
      name,
      dateLabel,
      timeLabel,
      eventDateTime,
      locationName,
      address,
      timetable,
      maxCompanions,
      heroTitle,
      heroSubtitle,
    });
    return NextResponse.json({ ok: true, event });
  } catch (err) {
    console.error("Firmenevent konnte nicht angelegt werden:", err);
    return NextResponse.json(
      { error: "Firmenevent konnte nicht angelegt werden." },
      { status: 500 }
    );
  }
}
