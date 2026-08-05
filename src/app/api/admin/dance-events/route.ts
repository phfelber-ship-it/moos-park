import { NextResponse } from "next/server";
import {
  getDanceEvents,
  saveDanceEvents,
  newEventId,
  type DanceEvent,
} from "@/lib/dance-events";

export async function GET() {
  const events = await getDanceEvents();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<DanceEvent>;
  const title = body.title?.trim();
  const start = body.start?.trim();
  if (!title || !start) {
    return NextResponse.json(
      { error: "Titel und Beginn sind Pflichtfelder." },
      { status: 400 }
    );
  }

  const event: DanceEvent = {
    id: newEventId(),
    title,
    description: body.description?.trim() ?? "",
    start,
    end: body.end?.trim() ?? "",
  };

  const events = await getDanceEvents();
  events.push(event);
  await saveDanceEvents(events);

  return NextResponse.json({ event });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<DanceEvent> & { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Keine ID angegeben." }, { status: 400 });
  }
  const title = body.title?.trim();
  const start = body.start?.trim();
  if (!title || !start) {
    return NextResponse.json(
      { error: "Titel und Beginn sind Pflichtfelder." },
      { status: 400 }
    );
  }

  const events = await getDanceEvents();
  const idx = events.findIndex((e) => e.id === body.id);
  if (idx === -1) {
    return NextResponse.json(
      { error: "Termin nicht gefunden." },
      { status: 404 }
    );
  }

  events[idx] = {
    id: body.id,
    title,
    description: body.description?.trim() ?? "",
    start,
    end: body.end?.trim() ?? "",
  };
  await saveDanceEvents(events);

  return NextResponse.json({ event: events[idx] });
}

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "Keine ID angegeben." }, { status: 400 });
  }

  const events = await getDanceEvents();
  await saveDanceEvents(events.filter((e) => e.id !== id));

  return NextResponse.json({ ok: true });
}
