import { getRegistrationsForEvent } from "@/lib/event-experience";

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

const STATUS_LABELS: Record<string, string> = {
  NEU: "Neu",
  BESTAETIGT: "Einladen",
  EMAIL_VERSCHICKT: "E-Mail verschickt",
  ANGERUFEN: "Angerufen",
  TEILNAHME_BESTAETIGT: "Bestätigt",
  NACHFRAGE: "Nachfrage",
  ABGELEHNT: "Abgelehnt",
  ABGESAGT: "Abgesagt",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const registrations = await getRegistrationsForEvent(eventId);

  const header = [
    "Status",
    "Unternehmen",
    "Anrede",
    "Name",
    "Vorname",
    "E-Mail",
    "Telefon",
    "Begleitpersonen",
    "Begleitpersonen-Namen",
    "Nachricht",
    "Einladung verschickt am",
    "Angemeldet am",
  ];

  const rows = registrations.map((r) => [
    STATUS_LABELS[r.status] ?? r.status,
    r.company,
    r.salutation,
    r.lastName,
    r.firstName,
    r.email,
    r.phone,
    String(r.companions.length),
    r.companions.map((c) => `${c.salutation} ${c.firstName} ${c.lastName}`).join(", "),
    r.message,
    r.invitationSentAt ? new Date(r.invitationSentAt).toLocaleString("de-DE") : "",
    new Date(r.createdAt).toLocaleString("de-DE"),
  ]);

  const csv =
    "﻿" +
    [header, ...rows].map((row) => row.map((cell) => csvEscape(String(cell))).join(";")).join("\r\n");

  const filename = `${eventId}-anmeldungen-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
