"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  createReservation,
  getEventReservables,
  getReservationDrinks,
  priceToEuro,
  type ClubscaleEvent,
  type ReservationDrink,
  type ReservationDrinkCategory,
  type Reservable,
} from "@/lib/clubscale";
import HoneypotField from "@/components/HoneypotField";
import FlipText from "@/components/FlipText";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    timeZone: "Europe/Berlin",
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

type StepKind =
  | "event"
  | "reservable"
  | "people"
  | "arrival"
  | "drinks"
  | "contact"
  | "done";

export default function ReservationWizard({
  events,
  preselectedEventId,
}: {
  events: ClubscaleEvent[];
  preselectedEventId: string | null;
}) {
  const [step, setStep] = useState(preselectedEventId ? 1 : 0);
  const [eventId, setEventId] = useState<string | null>(preselectedEventId);
  const [reservables, setReservables] = useState<Reservable[]>([]);
  const [reservableId, setReservableId] = useState<string | null>(null);
  const [people, setPeople] = useState(4);
  const [arrival, setArrival] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [drinks, setDrinks] = useState<ReservationDrink[]>([]);
  const [drinkCategories, setDrinkCategories] = useState<
    ReservationDrinkCategory[]
  >([]);
  const [preorder, setPreorder] = useState(false);
  const [drinkQty, setDrinkQty] = useState<Record<string, number>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  // Bei jedem Schrittwechsel zurueck an den Seitenanfang, sonst bleibt man
  // auf dem Handy weit unten stehen.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

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

  useEffect(() => {
    // Getraenke kommen aus der Clubscale-API (optionale Vorbestellung).
    let cancelled = false;
    getReservationDrinks().then(({ categories, products }) => {
      if (cancelled) return;
      setDrinkCategories(categories);
      setDrinks(products);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const chosenDrinks = drinks
    .map((d) => ({ drink: d, qty: drinkQty[d.id] ?? 0 }))
    .filter((x) => x.qty > 0);
  const drinksTotal = chosenDrinks.reduce(
    (sum, { drink, qty }) => sum + drink.price * qty,
    0
  );
  const setQty = (id: string, delta: number) =>
    setDrinkQty((q) => ({
      ...q,
      [id]: Math.min(99, Math.max(0, (q[id] ?? 0) + delta)),
    }));
  const drinkGroups = [
    ...drinkCategories
      .slice()
      .sort((a, b) => a.sortIndex - b.sortIndex)
      .map((c) => ({
        id: c.id,
        title: c.text,
        items: drinks.filter((d) => d.categoryID === c.id),
      })),
    {
      id: "",
      title: "",
      items: drinks.filter(
        (d) => !d.categoryID || !drinkCategories.some((c) => c.id === d.categoryID)
      ),
    },
  ].filter((g) => g.items.length > 0);

  const showReservableStep = reservables.length > 1;

  const steps: { kind: StepKind; label: string }[] = [
    { kind: "event", label: "Veranstaltung" },
    ...(showReservableStep
      ? ([{ kind: "reservable", label: "Bereich" }] as const)
      : []),
    { kind: "people", label: "Personen" },
    { kind: "arrival", label: "Ankunft" },
    ...(drinks.length > 0
      ? ([{ kind: "drinks", label: "Getränke" }] as const)
      : []),
    { kind: "contact", label: "Kontakt" },
    { kind: "done", label: "Fertig" },
  ];
  const current = steps[step].kind;

  const canNext: Record<StepKind, boolean> = {
    event: true,
    reservable: reservableId !== null,
    people: true,
    arrival: arrival !== null,
    drinks: true,
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
      (chosenDrinks.length
        ? `Getränke: ${chosenDrinks
            .map(({ drink, qty }) => `${qty}x ${drink.text}`)
            .join(", ")}\n`
        : "") +
      (message ? `Nachricht: ${message}\n` : "")
  );

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (status === "sending") return;
    if (honeypot) {
      setStatus("sent");
      return;
    }
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
        subOrders: chosenDrinks.map(({ drink, qty }) => ({
          productID: drink.id,
          quantity: qty,
        })),
      });
      // Reservierungen laufen bewusst NICHT (mehr) durchs Postfach - App-
      // und Website-Reservierungen landen sonst nur zur Haelfte dort (App-
      // Reservierungen gehen direkt an Clubscale). Clubscale-Adminpanel ist
      // hier die einzige, vollstaendige Quelle fuer beide Kanaele.
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      <HoneypotField value={honeypot} onChange={setHoneypot} />
      <div className="mx-auto max-w-xl">
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

      <div
        className={`mx-auto mt-10 ${
          current === "reservable" || current === "event"
            ? "max-w-7xl"
            : "max-w-xl"
        }`}
      >
        {current === "event" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                setEventId(null);
                setStep(1);
              }}
              className={`flex flex-col justify-center rounded-2xl border p-6 text-left transition-colors ${
                eventId === null
                  ? "border-accent-lime bg-accent-lime/10"
                  : "border-foreground/10 hover:border-foreground/25"
              }`}
            >
              <p className="text-lg font-black uppercase leading-tight text-foreground">
                Ohne bestimmte Veranstaltung
              </p>
              <p className="mt-1 text-sm text-foreground/60">
                Wir reservieren dir einen Platz an einem Tag deiner Wahl.
              </p>
            </button>

            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  setEventId(event.id);
                  setStep(1);
                }}
                className={`overflow-hidden rounded-2xl border text-left transition-colors ${
                  eventId === event.id
                    ? "border-accent-lime bg-accent-lime/10"
                    : "border-foreground/10 hover:border-foreground/25"
                }`}
              >
                <div className="relative aspect-video w-full bg-foreground/5">
                  {event.thumbnail?.presignedURL && (
                    <Image
                      src={event.thumbnail.presignedURL}
                      alt={event.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-lg font-black uppercase leading-tight text-foreground">
                    {event.name}
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    {formatDate(event.start)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {current === "reservable" && (
          <div>
            <p className="mb-6 text-center text-xl font-black uppercase text-foreground">
              Welchen Bereich möchtest du reservieren?
            </p>
            <div className="grid gap-5 sm:grid-flow-col sm:auto-cols-fr">
              {reservables.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReservableId(r.id)}
                  className={`overflow-hidden rounded-2xl border text-left transition-colors ${
                    reservableId === r.id
                      ? "border-accent-lime bg-accent-lime/10"
                      : "border-foreground/10 hover:border-foreground/25"
                  }`}
                >
                  <div className="relative aspect-[4/3] w-full bg-foreground/5">
                    {r.image?.presignedURL && (
                      <Image
                        src={r.image.presignedURL}
                        alt={r.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 640px) 33vw, 100vw"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-lg font-black uppercase leading-tight text-foreground">
                      {r.name}
                    </p>
                    <p className="mt-1 text-sm text-foreground/60">
                      {r.minPersonCount}–{r.maxPersonCount} Personen
                      {r.minConsumption > 0
                        ? ` · Mindestverzehr ${priceToEuro(r.minConsumption)} €`
                        : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
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

        {current === "drinks" && (
          <div>
            <p className="text-center font-black uppercase text-foreground">
              Getränke
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setPreorder(false);
                  setDrinkQty({});
                  setStep((st) => Math.min(st + 1, steps.length - 1));
                }}
                className="rounded-2xl border border-foreground/10 p-5 text-left transition-colors hover:border-foreground/25"
              >
                <p className="font-black uppercase text-foreground">
                  Getränkeauswahl im Club
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  Ihr bestellt vor Ort. Weiter ohne Vorbestellung.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setPreorder(true)}
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  preorder
                    ? "border-accent-lime bg-accent-lime/10"
                    : "border-foreground/10 hover:border-foreground/25"
                }`}
              >
                <p className="font-black uppercase text-foreground">
                  Getränke vorbestellen
                </p>
                <p className="mt-1 text-sm text-foreground/60">
                  Optional – wähle schon jetzt, was bei eurer Ankunft
                  bereitstehen soll.
                </p>
              </button>
            </div>
            {preorder && (
            <div className="mt-6 flex flex-col gap-6">
              {drinkGroups.map((g) => (
                <div key={g.id || "ohne"}>
                  {g.title && (
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-accent-lime">
                      {g.title}
                    </p>
                  )}
                  <div className="divide-y divide-foreground/10 rounded-xl border border-foreground/10">
                    {g.items.map((d) => {
                      const qty = drinkQty[d.id] ?? 0;
                      return (
                        <div
                          key={d.id}
                          className="flex items-center justify-between gap-4 p-4"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-foreground">{d.text}</p>
                            {d.subtext && (
                              <p className="text-xs text-foreground/50">
                                {d.subtext}
                              </p>
                            )}
                            <p className="mt-0.5 text-sm text-foreground/70">
                              {priceToEuro(d.price)} €
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setQty(d.id, -1)}
                              disabled={qty === 0}
                              aria-label={`${d.text} weniger`}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 text-foreground disabled:opacity-30"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-bold text-foreground">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(d.id, 1)}
                              aria-label={`${d.text} mehr`}
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 text-foreground"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            )}
            {preorder && drinksTotal > 0 && (
              <p className="mt-4 text-right text-sm font-bold text-foreground">
                Summe Getränke: {priceToEuro(drinksTotal)} €
              </p>
            )}
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
              {chosenDrinks.length > 0 && (
                <>
                  <dt className="text-foreground/50">Getränke</dt>
                  <dd className="font-bold text-foreground">
                    {chosenDrinks.map(({ drink, qty }) => (
                      <span key={drink.id} className="block">
                        {qty}x {drink.text}
                      </span>
                    ))}
                    <span className="mt-1 block text-foreground/60">
                      {priceToEuro(drinksTotal)} €
                    </span>
                  </dd>
                </>
              )}
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
                  <FlipText
                    text={
                      status === "sending"
                        ? "Wird gesendet..."
                        : "Reservierungsanfrage senden"
                    }
                  />
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
              <FlipText text="Zurück" />
            </button>
          ) : (
            <span />
          )}

          {current !== "done" && current !== "event" && (
            <button
              onClick={next}
              disabled={!canNext[current]}
              className="rounded-lg bg-foreground px-6 py-2.5 text-xs font-black uppercase tracking-wide text-background transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <FlipText text="Weiter" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
