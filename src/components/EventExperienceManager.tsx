"use client";

import { useState } from "react";
import type {
  EventExperienceRegistration,
  RegistrationStatus,
} from "@/lib/event-experience";
import EventExperienceInviteDialog from "@/components/EventExperienceInviteDialog";

const STATUSES: { key: RegistrationStatus; label: string }[] = [
  { key: "NEU", label: "Neu" },
  { key: "BESTAETIGT", label: "Einladen" },
  { key: "EMAIL_VERSCHICKT", label: "E-Mail verschickt" },
  { key: "ANGERUFEN", label: "Angerufen" },
  { key: "TEILNAHME_BESTAETIGT", label: "Bestätigt" },
  { key: "NACHFRAGE", label: "Nachfrage" },
  { key: "ABGELEHNT", label: "Abgelehnt" },
  { key: "ABGESAGT", label: "Abgesagt" },
];

const REMINDER_AFTER_MS = 24 * 60 * 60 * 1000;

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
  const [inviteDialogId, setInviteDialogId] = useState<string | null>(null);

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

  const markInvitationSent = (id: string, invitationSentAt: string) => {
    setRegistrations((cur) =>
      cur.map((r) =>
        r.id === id
          ? { ...r, invitationSentAt, status: "EMAIL_VERSCHICKT" }
          : r
      )
    );
  };

  const deleteEntry = async (id: string, company: string) => {
    if (!confirm(`Anmeldung von "${company}" wirklich unwiderruflich löschen?`)) {
      return;
    }
    const prev = registrations;
    setRegistrations((cur) => cur.filter((r) => r.id !== id));
    try {
      const res = await fetch(`/api/admin/event-experience?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("failed");
    } catch {
      setRegistrations(prev);
      alert("Löschen fehlgeschlagen. Bitte erneut versuchen.");
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
                          {r.company || r.lastName || "Ohne Namen"}
                        </p>
                        <div className="mt-1.5 grid gap-0.5 text-[11px] text-foreground/60">
                          <p>
                            <span className="text-foreground/40">Name: </span>
                            {r.lastName} {r.firstName}
                          </p>
                          <p>
                            <span className="text-foreground/40">
                              Anrede:{" "}
                            </span>
                            {r.salutation}
                          </p>
                          <p>
                            <span className="text-foreground/40">
                              E-Mail:{" "}
                            </span>
                            {r.email}
                          </p>
                          {r.phone && (
                            <p>
                              <span className="text-foreground/40">
                                Telefon:{" "}
                              </span>
                              {r.phone}
                            </p>
                          )}
                          {r.companions.length > 0 && (
                            <p>
                              <span className="text-foreground/40">
                                Begleitpersonen:{" "}
                              </span>
                              {r.companions.length}
                            </p>
                          )}
                        </div>
                        {r.message && (
                          <p className="mt-2 text-xs text-foreground/70">
                            {r.message}
                          </p>
                        )}

                        {r.cancelledAttendees && r.cancelledAttendees.length > 0 && (
                          <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/5 p-2">
                            <p className="text-[10px] font-bold uppercase text-red-400">
                              Können nicht teilnehmen:
                            </p>
                            <ul className="mt-1 text-[11px] text-foreground/70">
                              {r.cancelledAttendees.map((a, i) => (
                                <li key={i}>
                                  {a.salutation} {a.firstName} {a.lastName}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {key === "BESTAETIGT" && (
                          <button
                            type="button"
                            onClick={() => setInviteDialogId(r.id)}
                            className="mt-2 w-full rounded-lg bg-accent-lime px-3 py-2 text-[11px] font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
                          >
                            {r.invitationSentAt
                              ? "Einladung erneut verschicken"
                              : "Einladung verschicken"}
                          </button>
                        )}
                        {r.invitationSentAt && (
                          <p className="mt-1.5 text-[10px] text-accent-lime">
                            Verschickt am{" "}
                            {new Date(r.invitationSentAt).toLocaleString("de-DE")}
                          </p>
                        )}

                        {key === "EMAIL_VERSCHICKT" &&
                          r.invitationSentAt &&
                          Date.now() - new Date(r.invitationSentAt).getTime() >
                            REMINDER_AFTER_MS && (
                            <p className="mt-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2 py-1.5 text-[10px] font-bold text-orange-400">
                              ⚠ Nachfrage: Ist die E-Mail angekommen?
                            </p>
                          )}
                        {key === "EMAIL_VERSCHICKT" && (
                          <button
                            type="button"
                            onClick={() => changeStatus(r.id, "ANGERUFEN")}
                            className="mt-2 w-full rounded-lg border border-foreground/15 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime"
                          >
                            Als angerufen markieren
                          </button>
                        )}
                        {key === "ANGERUFEN" && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => changeStatus(r.id, "TEILNAHME_BESTAETIGT")}
                              className="rounded-lg bg-accent-lime px-2 py-2 text-[10px] font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
                            >
                              Teilnahme bestätigt
                            </button>
                            <button
                              type="button"
                              onClick={() => changeStatus(r.id, "ABGESAGT")}
                              className="rounded-lg border border-red-500/30 px-2 py-2 text-[10px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-500/10"
                            >
                              Abgesagt
                            </button>
                          </div>
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

                        <button
                          type="button"
                          onClick={() => deleteEntry(r.id, r.company)}
                          className="mt-2 w-full rounded-lg border border-red-500/30 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-red-400 transition-colors hover:bg-red-500/10"
                        >
                          Anfrage löschen
                        </button>
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

      {inviteDialogId && (
        <EventExperienceInviteDialog
          registrationId={inviteDialogId}
          onClose={() => setInviteDialogId(null)}
          onSent={(invitationSentAt) =>
            markInvitationSent(inviteDialogId, invitationSentAt)
          }
        />
      )}
    </div>
  );
}
