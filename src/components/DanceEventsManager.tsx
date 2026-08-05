"use client";

import { useMemo, useState } from "react";
import {
  type DanceEvent,
  sortByStartDesc,
  isPastEvent,
  isComplete,
} from "@/lib/dance-events";
import FlipText from "@/components/FlipText";

const EMPTY_FORM = { title: "", description: "", start: "", end: "", published: true };

type Tab = "bevorstehend" | "vergangen" | "geplant" | "entwuerfe" | "alle";

const TABS: { key: Tab; label: string }[] = [
  { key: "bevorstehend", label: "Bevorstehende" },
  { key: "vergangen", label: "Vergangen" },
  { key: "geplant", label: "Geplant" },
  { key: "entwuerfe", label: "Entwürfe" },
  { key: "alle", label: "Alle" },
];

function matchesTab(event: DanceEvent, tab: Tab): boolean {
  switch (tab) {
    case "bevorstehend":
      return event.published && !isPastEvent(event);
    case "vergangen":
      return event.published && isPastEvent(event);
    case "geplant":
      return !event.published && isComplete(event);
    case "entwuerfe":
      return !event.published && !isComplete(event);
    case "alle":
      return true;
  }
}

export default function DanceEventsManager({
  initialEvents,
}: {
  initialEvents: DanceEvent[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [tab, setTab] = useState<Tab>("bevorstehend");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = {
      bevorstehend: 0,
      vergangen: 0,
      geplant: 0,
      entwuerfe: 0,
      alle: events.length,
    };
    for (const e of events) {
      if (matchesTab(e, "bevorstehend")) c.bevorstehend++;
      if (matchesTab(e, "vergangen")) c.vergangen++;
      if (matchesTab(e, "geplant")) c.geplant++;
      if (matchesTab(e, "entwuerfe")) c.entwuerfe++;
    }
    return c;
  }, [events]);

  const visible = useMemo(
    () => sortByStartDesc(events.filter((e) => matchesTab(e, tab))),
    [events, tab]
  );

  const startNew = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const startEdit = (event: DanceEvent) => {
    setEditingId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      start: event.start,
      end: event.end,
      published: event.published,
    });
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.start) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/dance-events", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Speichern fehlgeschlagen.");

      if (editingId) {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === editingId ? data.event : ev))
        );
      } else {
        setEvents((prev) => [...prev, data.event]);
      }
      startNew();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Speichern fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/dance-events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Löschen fehlgeschlagen.");
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      if (editingId === id) startNew();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Löschen fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  };

  const duplicate = async (event: DanceEvent) => {
    setBusyId(event.id);
    setError(null);
    try {
      const res = await fetch("/api/admin/dance-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: event.title,
          description: event.description,
          start: event.start,
          end: event.end,
          published: event.published,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Duplizieren fehlgeschlagen.");
      setEvents((prev) => [...prev, data.event]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Duplizieren fehlgeschlagen.");
    } finally {
      setBusyId(null);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2 border-b border-foreground/10 pb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-colors ${
              tab === t.key
                ? "bg-accent-lime text-black"
                : "border border-foreground/20 text-foreground/60 hover:border-accent-lime"
            }`}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {visible.length === 0 && (
          <p className="text-sm text-foreground/50">
            Keine Termine in dieser Ansicht.
          </p>
        )}
        {visible.map((ev) => (
          <li
            key={ev.id}
            className="rounded-xl border border-foreground/10 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black uppercase text-foreground">
                    {ev.title}
                  </p>
                  {!ev.published && (
                    <span className="rounded bg-foreground/10 px-2 py-0.5 text-[10px] font-bold uppercase text-foreground/50">
                      {isComplete(ev) ? "Geplant" : "Entwurf"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-foreground/60">
                  {ev.description}
                </p>
                <p className="mt-2 text-xs text-foreground/50">
                  Beginn: {formatDate(ev.start)}
                  {ev.end ? ` · Ende: ${formatDate(ev.end)}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-bold uppercase">
                <button
                  type="button"
                  onClick={() => startEdit(ev)}
                  className="rounded-lg border border-foreground/20 px-3 py-1.5 text-foreground/70 hover:border-accent-lime"
                >
                  <FlipText text="Bearbeiten" />
                </button>
                <button
                  type="button"
                  onClick={() => duplicate(ev)}
                  disabled={busyId === ev.id}
                  className="rounded-lg border border-foreground/20 px-3 py-1.5 text-foreground/70 hover:border-accent-lime disabled:opacity-40"
                >
                  {busyId === ev.id ? "..." : <FlipText text="Duplizieren" />}
                </button>
                <button
                  type="button"
                  onClick={() => remove(ev.id)}
                  disabled={busyId === ev.id}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-red-500 disabled:opacity-40"
                >
                  {busyId === ev.id ? "..." : <FlipText text="Löschen" />}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <form
        onSubmit={submit}
        className="mt-8 grid gap-3 rounded-xl border border-foreground/10 p-4 sm:grid-cols-2"
      >
        <p className="text-sm font-black uppercase text-foreground sm:col-span-2">
          {editingId ? "Termin bearbeiten" : "Neuer Termin"}
        </p>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Titel (z.B. TANZEN IM MOOSPARK)"
          className="rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime sm:col-span-2"
        />
        <input
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Beschreibung (z.B. Dein Tanzabend mit DJ Willy)"
          className="rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime sm:col-span-2"
        />
        <label className="text-xs font-bold uppercase text-foreground/50">
          Beginn
          <input
            value={form.start}
            onChange={(e) =>
              setForm((f) => ({ ...f, start: e.target.value }))
            }
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
        </label>
        <label className="text-xs font-bold uppercase text-foreground/50">
          Ende
          <input
            value={form.end}
            onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
          />
        </label>

        <label className="flex items-center gap-2 text-xs font-bold uppercase text-foreground/50 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) =>
              setForm((f) => ({ ...f, published: e.target.checked }))
            }
          />
          Veröffentlicht (sonst nur Entwurf/geplant, nicht öffentlich sichtbar)
        </label>

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={loading || !form.title.trim() || !form.start}
            className="rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black disabled:pointer-events-none disabled:opacity-40"
          >
            {loading ? "..." : <FlipText text={editingId ? "Speichern" : "Anlegen"} />}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={startNew}
              className="rounded-lg border border-foreground/20 px-6 py-2.5 text-xs font-black uppercase tracking-wide text-foreground/70"
            >
              <FlipText text="Abbrechen" />
            </button>
          )}
        </div>
      </form>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
