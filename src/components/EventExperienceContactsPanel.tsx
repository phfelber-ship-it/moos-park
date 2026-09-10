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
  salutation: "",
  lastName: "",
  firstName: "",
  street: "",
  zip: "",
  city: "",
  email: "",
  phone: "",
};

type CompanyContact = {
  id: string;
  company: string;
  salutation: string;
  lastName: string;
  firstName: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
};

export default function EventExperienceContactsPanel({
  initialContacts,
  companyContacts = [],
  contactsApiUrl = "/api/admin/event-experience/contacts",
  lettersExportUrl = "/api/admin/event-experience/letters/export",
  letterBaseUrl = "/api/admin/event-experience",
}: {
  initialContacts: Contact[];
  companyContacts?: CompanyContact[];
  // Firmenevents uebergeben ihre eigenen, event-spezifischen Routen (siehe
  // app/admin/firmenevents/[eventId]/page.tsx); Default bleibt das
  // Legacy-Event.
  contactsApiUrl?: string;
  lettersExportUrl?: string;
  letterBaseUrl?: string;
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [importId, setImportId] = useState("");
  const [saveToDatabase, setSaveToDatabase] = useState(false);

  // Mehrfachauswahl aus den Firmenkontakten: statt jede Firma einzeln
  // durchzuklicken, mehrere auswaehlen und in einem Rutsch als Kontakte
  // anlegen (jeweils eigener Einladungsbrief pro Kontakt entsteht dabei
  // automatisch, siehe rechtes Vorschau-Fenster pro einzelnem Kontakt).
  const [bulkSelectedIds, setBulkSelectedIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<"idle" | "running" | "error">("idle");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);

  const toggleBulkSelected = (id: string) => {
    setBulkSelectedIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };

  const createSelectedFromDatabase = async () => {
    if (bulkSelectedIds.length === 0) return;
    setBulkStatus("running");
    setBulkError(null);
    setBulkProgress({ done: 0, total: bulkSelectedIds.length });
    const created: Contact[] = [];
    const failed: string[] = [];

    // Bewusst nacheinander statt Promise.all - vermeidet, dass viele
    // gleichzeitige Schreibvorgaenge auf denselben Blob-Store sich
    // gegenseitig ueberschreiben (siehe mutate-Muster in
    // lib/event-experience.ts).
    for (const id of bulkSelectedIds) {
      const c = companyContacts.find((cc) => cc.id === id);
      if (!c) continue;
      try {
        const res = await fetch(contactsApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: c.company,
            salutation: c.salutation,
            lastName: c.lastName,
            firstName: c.firstName,
            street: c.street,
            zip: c.zip,
            city: c.city,
            email: c.email,
            phone: c.phone,
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error);
        created.push(data.contact);
      } catch {
        failed.push(c.company || c.lastName || id);
      }
      setBulkProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }

    if (created.length > 0) {
      setContacts((cur) => [...created, ...cur]);
    }
    if (failed.length > 0) {
      setBulkStatus("error");
      setBulkError(`Fehlgeschlagen bei: ${failed.join(", ")}`);
    } else {
      setBulkStatus("idle");
      setBulkSelectedIds([]);
    }
  };

  const set = (patch: Partial<typeof form>) =>
    setForm((cur) => ({ ...cur, ...patch }));

  const importFromDatabase = (id: string) => {
    setImportId(id);
    const c = companyContacts.find((c) => c.id === id);
    if (!c) return;
    setForm({
      company: c.company,
      salutation: c.salutation,
      lastName: c.lastName,
      firstName: c.firstName,
      street: c.street,
      zip: c.zip,
      city: c.city,
      email: c.email,
      phone: c.phone,
    });
  };

  // Alle Felder sind optional - was ausgefuellt wird, wird uebernommen.
  // Nur komplett leer darf das Formular nicht abgeschickt werden.
  const canSave = Object.values(form).some((v) => v.trim() !== "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || status === "saving") return;
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch(contactsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Kontakt konnte nicht angelegt werden.");
      setContacts((cur) => [data.contact, ...cur]);
      setSelectedId(data.contact.id);

      // Best-effort, zusaetzlich zur Event-Experience-Anmeldung auch in
      // der wiederverwendbaren Firmenkontakte-Datenbank speichern - darf
      // das eigentliche Anlegen (oben) nicht blockieren/verhindern.
      if (saveToDatabase) {
        fetch("/api/admin/company-contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, notes: "" }),
        }).catch(() => {});
      }

      setForm(emptyForm);
      setImportId("");
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
          href={lettersExportUrl}
          className="rounded-lg border border-foreground/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-foreground transition-colors hover:border-accent-lime"
        >
          Alle Briefe als PDF exportieren
        </a>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Formular + Liste */}
        <div>
          {companyContacts.length > 0 && (
            <div className="mb-5 rounded-xl border border-foreground/10 bg-background p-4">
              <p className="text-xs font-bold uppercase text-foreground/50">
                Mehrere Firmen auf einmal anlegen
              </p>
              <p className="mt-1 text-xs text-foreground/40">
                Firmen auswählen – für jede wird automatisch ein Kontakt +
                Einladungsbrief für dieses Event erzeugt.
              </p>
              <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-foreground/10">
                {companyContacts.map((c) => (
                  <label
                    key={c.id}
                    className="flex cursor-pointer items-center gap-2 border-b border-foreground/5 px-3 py-2 text-xs last:border-b-0 hover:bg-foreground/[0.03]"
                  >
                    <input
                      type="checkbox"
                      checked={bulkSelectedIds.includes(c.id)}
                      onChange={() => toggleBulkSelected(c.id)}
                    />
                    <span className="font-bold text-foreground">
                      {c.company || c.lastName || "Ohne Namen"}
                    </span>
                    {c.city && <span className="text-foreground/40">· {c.city}</span>}
                  </label>
                ))}
              </div>
              {bulkStatus === "running" && bulkProgress && (
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-accent-lime transition-all"
                    style={{
                      width: `${Math.round((bulkProgress.done / bulkProgress.total) * 100)}%`,
                    }}
                  />
                </div>
              )}
              {bulkError && <p className="mt-2 text-xs text-red-500">{bulkError}</p>}
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={createSelectedFromDatabase}
                  disabled={bulkSelectedIds.length === 0 || bulkStatus === "running"}
                  className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
                >
                  <FlipText
                    text={
                      bulkStatus === "running" && bulkProgress
                        ? `Lege an… (${bulkProgress.done}/${bulkProgress.total})`
                        : `${bulkSelectedIds.length || ""} Firma${bulkSelectedIds.length === 1 ? "" : "en"} anlegen`.trim()
                    }
                  />
                </button>
              </div>
            </div>
          )}

          {companyContacts.length > 0 && (
            <div className="mb-3">
              <label className="mb-1 block text-xs font-bold uppercase text-foreground/50">
                Oder einzeln übernehmen (zum Anpassen vor dem Anlegen)
              </label>
              <select
                value={importId}
                onChange={(e) => importFromDatabase(e.target.value)}
                className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
              >
                <option value="">– Kontakt auswählen –</option>
                {companyContacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company || c.lastName || "Ohne Namen"}
                    {c.city ? ` · ${c.city}` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
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
              <option value="">Anrede (optional)</option>
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

            <label className="flex items-center gap-2 text-xs text-foreground/60 sm:col-span-2">
              <input
                type="checkbox"
                checked={saveToDatabase}
                onChange={(e) => setSaveToDatabase(e.target.checked)}
              />
              Auch dauerhaft in der Firmenkontakte-Datenbank speichern
              (wiederverwendbar für andere Einladungen)
            </label>

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
                  src={`${letterBaseUrl}/${selected.id}/letter`}
                  className="h-full w-full"
                />
              </div>

              <a
                href={`${letterBaseUrl}/${selected.id}/letter`}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-lg bg-accent-lime px-4 py-2.5 text-center text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
              >
                <FlipText text="PDF öffnen / drucken" />
              </a>
              <a
                href={`${letterBaseUrl}/${selected.id}/letter?dl=1`}
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
