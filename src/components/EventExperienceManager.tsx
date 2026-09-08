"use client";

import { useState } from "react";
import type {
  EventExperienceRegistration,
  RegistrationStatus,
} from "@/lib/event-experience";

const STATUSES: { key: RegistrationStatus; label: string }[] = [
  { key: "NEU", label: "Neu" },
  { key: "BESTAETIGT", label: "Bestätigt" },
  { key: "NACHFRAGE", label: "Nachfrage" },
];

export default function EventExperienceManager({
  initialRegistrations,
}: {
  initialRegistrations: EventExperienceRegistration[];
}) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<RegistrationStatus | null>(
    null
  );

  const changeStatus = async (id: string, status: RegistrationStatus) => {
    const prev = registrations;
    setRegistrations((cur) =>
      cur.map((r) => (r.id === id ? { ...r, status } : r))
    );
    try {
      const res = await fetch("/api/admin/event-experience", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      // Fehlschlag: alten Stand wiederherstellen, statt stillschweigend
      // einen Status zu zeigen, der serverseitig nicht gespeichert wurde.
      setRegistrations(prev);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {registrations.length} Anmeldung
          {registrations.length === 1 ? "" : "en"} insgesamt.
        </p>
        <a
          href="/api/admin/event-experience/export"
          className="rounded-lg bg-accent-lime px-5 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Excel-Export (CSV)
        </a>
      </div>

      {registrations.length === 0 ? (
        <p className="mt-10 text-sm text-foreground/50">
          Noch keine Anmeldungen eingegangen.
        </p>
      ) : (
        <div className="mt-6 -mx-6 overflow-x-auto px-6 pb-4">
          <div className="flex min-w-max gap-4">
            {STATUSES.map(({ key, label }) => {
              const inColumn = registrations.filter((r) => r.status === key);
              const isDragOver = dragOverStatus === key;
              return (
                <div
                  key={key}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverStatus(key);
                  }}
                  onDragLeave={() =>
                    setDragOverStatus((s) => (s === key ? null : s))
                  }
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverStatus(null);
                    if (draggingId) changeStatus(draggingId, key);
                    setDraggingId(null);
                  }}
                  className={`w-80 shrink-0 rounded-2xl border p-3 transition-colors ${
                    isDragOver
                      ? "border-accent-lime bg-accent-lime/5"
                      : "border-foreground/10 bg-foreground/[0.015]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <p className="text-xs font-black uppercase tracking-wide text-foreground">
                      {label}
                    </p>
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-bold text-foreground/60">
                      {inColumn.length}
                    </span>
                  </div>

                  <div className="grid gap-2">
                    {inColumn.map((r) => (
                      <div
                        key={r.id}
                        draggable
                        onDragStart={() => setDraggingId(r.id)}
                        onDragEnd={() => setDraggingId(null)}
                        className={`cursor-grab rounded-xl border border-foreground/10 bg-background p-3 active:cursor-grabbing ${
                          draggingId === r.id ? "opacity-40" : ""
                        }`}
                      >
                        <p className="text-sm font-black uppercase text-foreground">
                          {r.company}
                        </p>
                        <p className="mt-0.5 text-[11px] text-foreground/50">
                          {r.salutation} {r.firstName} {r.lastName}
                        </p>
                        <p className="mt-0.5 text-[11px] text-foreground/50">
                          {r.email}
                          {r.phone ? ` · ${r.phone}` : ""}
                        </p>
                        {r.message && (
                          <p className="mt-2 text-xs text-foreground/70">
                            {r.message}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="text-[10px] text-foreground/30">
                            {new Date(r.createdAt).toLocaleString("de-DE")}
                          </p>
                          <select
                            value={r.status}
                            onChange={(e) =>
                              changeStatus(
                                r.id,
                                e.target.value as RegistrationStatus
                              )
                            }
                            className="rounded-lg border border-foreground/15 bg-foreground/5 px-2 py-1 text-[10px] font-bold uppercase text-foreground outline-none"
                          >
                            {STATUSES.map((s) => (
                              <option key={s.key} value={s.key}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                    {inColumn.length === 0 && (
                      <p className="px-1 py-4 text-center text-[11px] text-foreground/30">
                        Leer
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
