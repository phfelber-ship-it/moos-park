"use client";

import { useState } from "react";
import FlipText from "@/components/FlipText";

const ANREDEN = ["Herr", "Frau", "Divers"];

type Contact = {
  id: string;
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  street: string;
  zip: string;
  city: string;
  createdAt: string;
};

const emptyForm = {
  company: "",
  salutation: ANREDEN[0],
  lastName: "",
  firstName: "",
  street: "",
  zip: "",
  city: "",
  email: "",
  phone: "",
};

export default function EventExperienceContactsPanel({
  initialContacts,
}: {
  initialContacts: Contact[];
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<typeof form>) =>
    setForm((cur) => ({ ...cur, ...patch }));

  // Alle Felder sind optional - was ausgefuellt wird, wird uebernommen.
  // Nur komplett leer darf das Formular nicht abgeschickt werden.
  const canSave = Object.values(form).some((v) => v.trim() !== "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || status === "saving") return;
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/event-experience/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Kontakt konnte nicht angelegt werden.");
      setContacts((cur) => [data.contact, ...cur]);
      setSelectedId(data.contact.id);
      setForm(emptyForm);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Kontakt konnte nicht angelegt werden.");
    }
  };

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="mt-8 rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-foreground">
            Kontakte & Einladungsbriefe
          </p>
          <p className="mt-1 text-xs text-foreground/50">
            Firma manuell anlegen und automatisch einen postalischen
            Einladungsbrief mit QR-Code erzeugen.
          </p>
        </div>
        <a
          href="/api/admin/event-experience/letters/export"
          className="rounded-lg border border-foreground/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime"
        >
          Alle Briefe als PDF exportieren
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Formular + Liste */}
        <div>
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
            <input
              value={form.company}
              onChange={(e) => set({ company: e.target.value })}
              placeholder="Firma (optional)"
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime sm:col-span-2"
            />
            <select
              value={form.salutation}
              onChange={(e) => set({ salutation: e.target.value })}
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
            >
              {ANREDEN.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <input
              value={form.lastName}
              onChange={(e) => set({ lastName: e.target.value })}
              placeholder="Name (optional)"
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
            <input
              value={form.firstName}
              onChange={(e) => set({ firstName: e.target.value })}
              placeholder="Vorname (optional)"
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
            <input
              value={form.street}
              onChange={(e) => set({ street: e.target.value })}
              placeholder="Straße + Hausnummer (optional)"
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <input
                value={form.zip}
                onChange={(e) => set({ zip: e.target.value })}
                placeholder="PLZ (optional)"
                className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
              />
              <input
                value={form.city}
                onChange={(e) => set({ city: e.target.value })}
                placeholder="Ort (optional)"
                className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
              />
            </div>
            <input
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
              placeholder="E-Mail (optional)"
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />
            <input
              value={form.phone}
              onChange={(e) => set({ phone: e.target.value })}
              placeholder="Telefon (optional)"
              className="rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
            />

            {error && (
              <p className="text-xs text-red-500 sm:col-span-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={!canSave || status === "saving"}
              className="w-fit rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40 sm:col-span-2"
            >
              <FlipText
                text={status === "saving" ? "Wird angelegt..." : "Kontakt anlegen + Brief erzeugen"}
              />
            </button>
          </form>

          {contacts.length > 0 && (
            <div className="mt-6 grid gap-1.5">
              <p className="text-xs font-bold uppercase text-foreground/50">
                Angelegte Kontakte ({contacts.length})
              </p>
              {contacts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                    selectedId === c.id
                      ? "border-accent-lime bg-accent-lime/10"
                      : "border-foreground/10 hover:border-foreground/25"
                  }`}
                >
                  <span className="font-bold text-foreground">
                    {c.company || c.lastName || "Ohne Namen"}
                  </span>
                  <span className="text-foreground/40">
                    {[c.lastName, c.city].filter(Boolean).join(", ")}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rechtes Fenster: PDF-Aktionen */}
        <div className="rounded-xl border border-foreground/10 bg-background p-5">
          <p className="text-xs font-black uppercase tracking-wide text-foreground/50">
            Einladungsbrief
          </p>
          {!selected ? (
            <p className="mt-3 text-xs text-foreground/40">
              Legen Sie einen Kontakt an oder wählen Sie einen aus der Liste,
              um den Brief zu öffnen.
            </p>
          ) : (
            <div className="mt-3 grid gap-3">
              <div>
                <p className="text-sm font-bold text-foreground">
                  {selected.company || selected.lastName || "Ohne Namen"}
                </p>
                <p className="text-xs text-foreground/50">
                  {[selected.salutation, selected.firstName, selected.lastName]
                    .filter(Boolean)
                    .join(" ")}
                </p>
                <p className="text-xs text-foreground/40">
                  {[selected.street, [selected.zip, selected.city].filter(Boolean).join(" ")]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              <div className="aspect-[210/297] w-full overflow-hidden rounded-lg border border-foreground/10">
                <iframe
                  title="Brief-Vorschau"
                  src={`/api/admin/event-experience/${selected.id}/letter`}
                  className="h-full w-full"
                />
              </div>

              <a
                href={`/api/admin/event-experience/${selected.id}/letter`}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-lg bg-accent-lime px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
              >
                <FlipText text="PDF öffnen / drucken" />
              </a>
              <a
                href={`/api/admin/event-experience/${selected.id}/letter?dl=1`}
                className="w-full rounded-lg border border-foreground/15 px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime"
              >
                PDF herunterladen
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
