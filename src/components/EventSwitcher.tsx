"use client";

import { useRouter } from "next/navigation";

type EventOption = { id: string; name: string };

// Dropdown oben auf der Firmenevent-Adminseite, um schnell zu einem
// anderen Event zu wechseln, ohne erst zurueck zu /admin/firmenevents zu
// navigieren. Optisch ein Button (Lime, schwarze Schrift), technisch ein
// natives <select> - am zuverlaessigsten auf allen Geraeten (Touch,
// Tastatur), kein eigenes Dropdown-Overlay noetig.
export default function EventSwitcher({
  events,
  currentEventId,
}: {
  events: EventOption[];
  currentEventId: string;
}) {
  const router = useRouter();

  return (
    <select
      value={currentEventId}
      onChange={(e) => router.push(`/admin/firmenevents/${e.target.value}`)}
      className="appearance-none rounded-lg bg-accent-lime px-4 py-2 pr-9 text-xs font-black uppercase tracking-wide text-black outline-none transition-transform hover:scale-105"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='black'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.18l3.71-3.95a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.5rem center",
        backgroundSize: "1rem",
      }}
    >
      {events.map((ev) => (
        <option key={ev.id} value={ev.id}>
          {ev.name}
        </option>
      ))}
    </select>
  );
}
