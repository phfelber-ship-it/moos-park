"use client";

import { useState } from "react";
import type { CompanyContact } from "@/lib/company-contacts";
import FlipText from "@/components/FlipText";

const ANREDEN = ["", "Herr", "Frau", "Divers"];

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
  notes: "",
};

type FormState = typeof emptyForm;

function ContactFields({
  form,
  set,
}: {
  form: FormState;
  set: (patch: Partial<FormState>) => void;
}) {
  const inputClass =
    "rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime";
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <input
        value={form.company}
        onChange={(e) => set({ company: e.target.value })}
        placeholder="Firma (optional)"
        className={`${inputClass} sm:col-span-2`}
      />
      <select
        value={form.salutation}
        onChange={(e) => set({ salutation: e.target.value })}
        className={inputClass}
      >
        {ANREDEN.map((a) => (
          <option key={a} value={a}>
            {a || "Anrede (optional)"}
          </option>
        ))}
      </select>
      <input
        value={form.lastName}
        onChange={(e) => set({ lastName: e.target.value })}
        placeholder="Name (optional)"
        className={inputClass}
      />
      <input
        value={form.firstName}
        onChange={(e) => set({ firstName: e.target.value })}
        placeholder="Vorname (optional)"
        className={inputClass}
      />
      <input
        value={form.street}
        onChange={(e) => set({ street: e.target.value })}
        placeholder="Straße + Hausnummer (optional)"
        className={inputClass}
      />
      <div className="grid grid-cols-[100px_1fr] gap-3">
        <input
          value={form.zip}
          onChange={(e) => set({ zip: e.target.value })}
          placeholder="PLZ"
          className={inputClass}
        />
        <input
          value={form.city}
          onChange={(e) => set({ city: e.target.value })}
          placeholder="Ort"
          className={inputClass}
        />
      </div>
      <input
        value={form.email}
        onChange={(e) => set({ email: e.target.value })}
        placeholder="E-Mail (optional)"
        className={inputClass}
      />
      <input
        value={form.phone}
        onChange={(e) => set({ phone: e.target.value })}
        placeholder="Telefon (optional)"
        className={inputClass}
      />
      <textarea
        value={form.notes}
        onChange={(e) => set({ notes: e.target.value })}
        placeholder="Notizen (optional)"
        rows={2}
        className={`${inputClass} sm:col-span-2`}
      />
    </div>
  );
}

export default function CompanyContactsManager({
  initialContacts,
}: {
  initialContacts: CompanyContact[];
}) {
  const [contacts, setContacts] = useState(initialContacts);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);
  const [query, setQuery] = useState("");

  const canSave = Object.values(form).some((v) => v.trim() !== "");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave || status === "saving") return;
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/admin/company-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Kontakt konnte nicht angelegt werden.");
      setContacts((cur) => [data.contact, ...cur]);
      setForm(emptyForm);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Kontakt konnte nicht angelegt werden.");
    }
  };

  const startEdit = (c: CompanyContact) => {
    setEditingId(c.id);
    setEditForm({
      company: c.company,
      salutation: c.salutation,
      lastName: c.lastName,
      firstName: c.firstName,
      street: c.street,
      zip: c.zip,
      city: c.city,
      email: c.email,
      phone: c.phone,
      notes: c.notes,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const id = editingId;
    try {
      const res = await fetch(`/api/admin/company-contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error();
      setContacts((cur) => cur.map((c) => (c.id === id ? data.contact : c)));
      setEditingId(null);
    } catch {
      alert("Speichern fehlgeschlagen. Bitte erneut versuchen.");
    }
  };

  const deleteContact = async (id: string, label: string) => {
    if (!confirm(`Kontakt "${label}" wirklich unwiderruflich löschen?`)) return;
    const prev = contacts;
    setContacts((cur) => cur.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/admin/company-contacts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setContacts(prev);
      alert("Löschen fehlgeschlagen. Bitte erneut versuchen.");
    }
  };

  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);
  const setUnsubscribed = async (id: string, unsubscribed: boolean) => {
    setUnsubscribingId(id);
    try {
      const res = await fetch(`/api/admin/company-contacts/${id}/unsubscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unsubscribed }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error();
      setContacts((cur) => cur.map((c) => (c.id === id ? data.contact : c)));
    } catch {
      alert("Änderung fehlgeschlagen. Bitte erneut versuchen.");
    } finally {
      setUnsubscribingId(null);
    }
  };

  const matchesQuery = (c: CompanyContact) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [c.company, c.lastName, c.firstName, c.city, c.email]
      .join(" ")
      .toLowerCase()
      .includes(q);
  };
  const filtered = contacts.filter((c) => !c.unsubscribed && matchesQuery(c));
  const unsubscribedContacts = contacts.filter((c) => c.unsubscribed && matchesQuery(c));

  return (
    <div>
      <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.015] p-5 sm:p-6">
        <p className="text-sm font-black uppercase tracking-wide text-foreground">
          Neuen Kontakt anlegen
        </p>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <ContactFields form={form} set={(p) => setForm((c) => ({ ...c, ...p }))} />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={!canSave || status === "saving"}
            className="w-fit rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
          >
            <FlipText text={status === "saving" ? "Wird angelegt..." : "Kontakt anlegen"} />
          </button>
        </form>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <p className="text-sm text-foreground/60">
          {contacts.length} Kontakt{contacts.length === 1 ? "" : "e"} insgesamt.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchen..."
          className="w-full max-w-xs rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm text-foreground placeholder-foreground/40 outline-none focus:border-accent-lime"
        />
      </div>

      <div className="mt-4 grid gap-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-xl border border-foreground/10 bg-background p-4">
            {editingId === c.id ? (
              <div className="grid gap-3">
                <ContactFields form={editForm} set={(p) => setEditForm((c2) => ({ ...c2, ...p }))} />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
                  >
                    Speichern
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-foreground/15 px-5 py-2 text-xs font-bold uppercase text-foreground/70"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-foreground">
                    {c.company || c.lastName || "Ohne Namen"}
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/60">
                    {[c.salutation, c.firstName, c.lastName].filter(Boolean).join(" ")}
                  </p>
                  <p className="text-xs text-foreground/40">
                    {[c.street, [c.zip, c.city].filter(Boolean).join(" ")]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  {(c.email || c.phone) && (
                    <p className="mt-1 text-xs text-foreground/50">
                      {[c.email, c.phone].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {c.notes && (
                    <p className="mt-2 text-xs text-foreground/70">{c.notes}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    className="rounded-lg border border-foreground/15 px-3 py-1.5 text-[11px] font-bold uppercase text-foreground/70 transition-colors hover:border-accent-lime"
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnsubscribed(c.id, true)}
                    disabled={unsubscribingId === c.id}
                    title="In 'Abgemeldete Firmen' verschieben"
                    className="rounded-lg border border-foreground/15 px-3 py-1.5 text-[11px] font-bold uppercase text-foreground/70 transition-colors hover:border-yellow-500 hover:text-yellow-500 disabled:opacity-40"
                  >
                    Abmelden
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteContact(c.id, c.company || c.lastName || "Kontakt")}
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-[11px] font-bold uppercase text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-foreground/40">
            {contacts.length === 0 ? "Noch keine Kontakte angelegt." : "Keine Treffer."}
          </p>
        )}
      </div>

      <details className="group mt-10">
        <summary className="flex cursor-pointer list-none items-center gap-2">
          <p className="text-sm font-black uppercase tracking-wide text-foreground/60">
            Abgemeldete Firmen ({unsubscribedContacts.length})
          </p>
          <span className="text-foreground/30 transition-transform group-open:rotate-180">
            ▼
          </span>
        </summary>
        <p className="mt-1 text-xs text-foreground/40">
          Firmen, die sich über den Abmelden-Link in einer E-Mail
          ausgetragen haben oder manuell hierher verschoben wurden - bekommen
          keine weiteren Einladungen mehr.
        </p>
        <div className="mt-4 grid gap-3">
          {unsubscribedContacts.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-foreground/10 bg-background p-4"
            >
              <div>
                <p className="font-bold text-foreground">
                  {c.company || c.lastName || "Ohne Namen"}
                </p>
                {c.email && <p className="text-xs text-foreground/50">{c.email}</p>}
              </div>
              <button
                type="button"
                onClick={() => setUnsubscribed(c.id, false)}
                disabled={unsubscribingId === c.id}
                className="rounded-lg bg-accent-lime px-4 py-1.5 text-[11px] font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-40"
              >
                Wieder anmelden
              </button>
            </div>
          ))}
          {unsubscribedContacts.length === 0 && (
            <p className="py-4 text-center text-sm text-foreground/40">
              Keine abgemeldeten Firmen.
            </p>
          )}
        </div>
      </details>
    </div>
  );
}
