"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  createReservation,
  getEventReservables,
  type ClubscaleEvent,
  type Reservable,
} from "@/lib/clubscale";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });
}

function arrivalSlots(event: ClubscaleEvent | null): string[] {
  const base = event ? new Date(event.start) : new Date(0, 0, 0, 20, 0);
  const startHour = event ? base.getHours() : 20;
  const startMinute = event ? base.getMinutes() : 0;
  const slots: string[] = [];
  for (let i = 0; i < 6; i++) {
    const totalMinutes = startHour * 60 + startMinute + i * 30;
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
  return slots;
}

// Die Clubscale-API erwartet fuer arrivalTime einen vollen ISO-Zeitstempel,
// keine reine "HH:MM"-Uhrzeit (sonst BINDFAIL_JSON) - Datum kommt vom Event,
// ohne Event wird auf heute gestuetzt (gleiche lokale Basis wie arrivalSlots).
function arrivalToISO(event: ClubscaleEvent | null, arrival: string): string {
  const base = event ? new Date(event.start) : new Date();
  const [h, m] = arrival.split(":").map(Number);
  return new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    h,
    m,
    0,
    0
  ).toISOString();
}

type StepKind = "event" | "reservable" | "people" | "arrival" | "contact" | "done";

export default function ReservationWizard({
  events,
  preselectedEventId,
}: {
  events: ClubscaleEvent[];
  preselectedEventId: string | null;
}) {
  const [step, setStep] = useState(0);
  const [eventId, setEventId] = useState<string | null>(preselectedEventId);
  const [reservables, setReservables] = useState<Reservable[]>([]);
  const [reservableId, setReservableId] = useState<string | null>(null);
  const [people, setPeople] = useState(4);
  const [arrival, setArrival] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === eventId) ?? null,
    [events, eventId]
  );
  const slots = useMemo(() => arrivalSlots(selectedEvent), [selectedEvent]);
  const selectedReservable = useMemo(
    () => reservables.find((r) => r.id === reservableId) ?? null,
    [reservables, reservableId]
  );

  useEffect(() => {
    // Reservables sind an ein externes System (Clubscale-API) gebunden und
    // haengen vom gewaehlten Event ab - Neuladen bei Event-Wechsel ist
    // bewusst hier und nicht waehrend des Renders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReservables([]);
    setReservableId(null);
    if (!eventId) return;
    let cancelled = false;
    getEventReservables(eventId).then((list) => {
      if (cancelled) return;
      setReservables(list);
      if (list.length === 1) setReservableId(list[0].id);
    });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const showReservableStep = reservables.length > 1;

  const steps: { kind: StepKind; label: string }[] = [
    { kind: "event", label: "Veranstaltung" },
    ...(showReservableStep
      ? ([{ kind: "reservable", label: "Bereich" }] as const)
      : []),
    { kind: "people", label: "Personen" },
    { kind: "arrival", label: "Ankunft" },
    { kind: "contact", label: "Kontakt" },
    { kind: "done", label: "Fertig" },
  ];
  const current = steps[step].kind;

  const canNext: Record<StepKind, boolean> = {
    event: true,
    reservable: reservableId !== null,
    people: true,
    arrival: arrival !== null,
    contact: name.trim() !== "" && phone.trim() !== "",
    done: true,
  };

  const mailBody = encodeURIComponent(
    `Veranstaltung: ${selectedEvent?.name ?? "Ohne bestimmte Veranstaltung"}\n` +
      (selectedReservable ? `Bereich: ${selectedReservable.name}\n` : "") +
      `Personen: ${people}\n` +
      `Ankunft: ${arrival} Uhr\n` +
      `Name: ${name}\n` +
      `Telefon: ${phone}\n` +
      `E-Mail: ${email}\n` +
      (message ? `Nachricht: ${message}\n` : "")
  );

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (status === "sending") return;
    setStatus("sending");
    try {
      await createReservation({
        eventId,
        reservableId: reservableId ?? "",
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phone.trim(),
        amountOfPersons: people,
        arrivalTime: arrival ? arrivalToISO(selectedEvent, arrival) : "",
        additionalInformation: message.trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-md">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div
            className="h-full rounded-full bg-accent-lime transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-wide text-foreground/50">
          {steps.map((s, i) => (
            <span key={s.kind} className={i <= step ? "text-foreground" : ""}>
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-xl">
        {current === "event" && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setEventId(null)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                eventId === null
                  ? "border-accent-lime bg-accent-lime/10"
                  : "border-foreground/10 hover:border-foreground/25"
              }`}
            >
              <p className="font-black uppercase text-foreground">
                Ohne bestimmte Veranstaltung
              </p>
              <p className="mt-0.5 text-sm text-foreground/60">
                Wir reservieren dir einen Platz an einem Tag deiner Wahl.
              </p>
            </button>

            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => setEventId(event.id)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  eventId === event.id
                    ? "border-accent-lime bg-accent-lime/10"
                    : "border-foreground/10 hover:border-foreground/25"
                }`}
              >
                <div className="relative aspect-square h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-foreground/5">
                  {event.thumbnail?.presignedURL && (
                    <Image
                      src={event.thumbnail.presignedURL}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-black uppercase leading-tight text-foreground">
                    {event.name}
                  </p>
                  <p className="mt-0.5 text-sm text-foreground/60">
                    {formatDate(event.start)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {current === "reservable" && (
          <div className="flex flex-col gap-3">
            <p className="text-center font-black uppercase text-foreground">
              Welchen Bereich möchtest du reservieren?
            </p>
            {reservables.map((r) => (
              <button
                key={r.id}
                onClick={() => setReservableId(r.id)}
                className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  reservableId === r.id
                    ? "border-accent-lime bg-accent-lime/10"
                    : "border-foreground/10 hover:border-foreground/25"
                }`}
              >
                {r.image?.presignedURL && (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-foreground/5">
                    <Image
                      src={r.image.presignedURL}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div>
                  <p className="font-black uppercase text-foreground">{r.name}</p>
                  <p className="mt-0.5 text-sm text-foreground/60">
                    {r.minPersonCount}–{r.maxPersonCount} Personen
                    {r.minConsumption > 0
                      ? ` · Mindestverzehr ${(r.minConsumption / 100).toLocaleString(
                          "de-DE",
                          { minimumFractionDigits: 2 }
                        )} €`
                      : ""}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {current === "people" && (
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-foreground/10 p-8 text-center">
            <p className="font-black uppercase text-foreground">
              Wie viele Personen?
            </p>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setPeople((p) => Math.max(1, p - 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 text-xl font-black text-foreground"
              >
                −
              </button>
              <span className="w-12 text-4xl font-black text-foreground">
                {people}
              </span>
              <button
                onClick={() => setPeople((p) => Math.min(30, p + 1))}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 text-xl font-black text-foreground"
              >
                +
              </button>
            </div>
            <p className="text-sm text-foreground/50">
              Größere Gruppe? Schreib uns die genaue Zahl im nächsten Schritt.
            </p>
          </div>
        )}

        {current === "arrival" && (
          <div>
            <p className="text-center font-black uppercase text-foreground">
              Wann kommt ihr an?
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setArrival(slot)}
                  className={`rounded-lg border px-4 py-3 text-sm font-bold transition-colors ${
                    arrival === slot
                      ? "border-accent-lime bg-accent-lime text-black"
                      : "border-foreground/15 text-foreground hover:border-foreground/40"
                  }`}
                >
                  {slot} Uhr
                </button>
              ))}
            </div>
          </div>
        )}

        {current === "contact" && (
          <div className="grid gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefonnummer"
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="E-Mail"
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nachricht (optional)"
              rows={3}
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-3 text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
          </div>
        )}

        {current === "done" && (
          <div className="rounded-2xl border border-foreground/10 p-6">
            <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
              Zusammenfassung
            </p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-foreground/50">Veranstaltung</dt>
              <dd className="font-bold text-foreground">
                {selectedEvent?.name ?? "Ohne bestimmte Veranstaltung"}
              </dd>
              {selectedReservable && (
                <>
                  <dt className="text-foreground/50">Bereich</dt>
                  <dd className="font-bold text-foreground">
                    {selectedReservable.name}
                  </dd>
                </>
              )}
              <dt className="text-foreground/50">Personen</dt>
              <dd className="font-bold text-foreground">{people}</dd>
              <dt className="text-foreground/50">Ankunft</dt>
              <dd className="font-bold text-foreground">{arrival} Uhr</dd>
              <dt className="text-foreground/50">Name</dt>
              <dd className="font-bold text-foreground">{name}</dd>
              <dt className="text-foreground/50">Telefon</dt>
              <dd className="font-bold text-foreground">{phone}</dd>
            </dl>

            {status === "sent" ? (
              <p className="mt-6 font-bold text-foreground">
                Danke! Deine Reservierungsanfrage ist bei uns eingegangen. Wir
                melden uns schnellstmöglich zurück.
              </p>
            ) : (
              <>
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "sending"}
                  className="mt-6 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
                >
                  {status === "sending"
                    ? "Wird gesendet..."
                    : "Reservierungsanfrage senden"}
                </button>
                {status === "error" && (
                  <p className="mt-4 text-sm text-red-500">
                    Da ist leider etwas schiefgelaufen. Schreib uns stattdessen
                    gerne direkt per{" "}
                    <a
                      href={`mailto:kontakt@moos-park.de?subject=${encodeURIComponent(
                        "Reservierungsanfrage"
                      )}&body=${mailBody}`}
                      className="underline"
                    >
                      E-Mail
                    </a>{" "}
                    oder ruf uns an.
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 0 && status !== "sent" ? (
            <button
              onClick={back}
              className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground"
            >
              Zurück
            </button>
          ) : (
            <span />
          )}

          {current !== "done" && (
            <button
              onClick={next}
              disabled={!canNext[current]}
              className="rounded-lg bg-foreground px-6 py-2.5 text-xs font-black uppercase tracking-wide text-background transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              Weiter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
