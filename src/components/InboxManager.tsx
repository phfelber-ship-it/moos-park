"use client";

import { useMemo, useState } from "react";
import type { InboxEntry, InboxType } from "@/lib/inbox";
import FlipText from "@/components/FlipText";

const TYPE_LABELS: Record<InboxType, string> = {
  kontakt: "Kontakt",
  eventlocation: "Eventlocation",
  veranstaltung: "Veranstaltung",
  promoter: "Promoter",
  bewerbung: "Bewerbung",
  reservierung: "Reservierung",
  eventexperience: "Event Experience",
};

const TYPE_COLORS: Record<InboxType, string> = {
  kontakt: "bg-blue-500/15 text-blue-400",
  eventlocation: "bg-purple-500/15 text-purple-400",
  veranstaltung: "bg-pink-500/15 text-pink-400",
  promoter: "bg-orange-500/15 text-orange-400",
  bewerbung: "bg-accent-lime/15 text-accent-lime",
  reservierung: "bg-cyan-500/15 text-cyan-400",
  eventexperience: "bg-emerald-500/15 text-emerald-400",
};

type Filter = "alle" | InboxType;

type ReplySettings = { fromName: string; signature: string };

export default function InboxManager({
  initialEntries,
  initialReplySettings,
}: {
  initialEntries: InboxEntry[];
  initialReplySettings: ReplySettings;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [filter, setFilter] = useState<Filter>("alle");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [sendingReply, setSendingReply] = useState(false);

  // Einmal hinterlegter Absendername + Signatur (siehe /api/admin/inbox/
  // reply-settings) - wird bei jeder Antwort automatisch vorausgefuellt,
  // statt bei jeder Mail neu eingetippt werden zu muessen. Eigener kleiner
  // Einstellungsbereich zum Bearbeiten (einmal einrichten, danach nie
  // wieder anfassen).
  const [replySettings, setReplySettingsState] = useState(initialReplySettings);
  const [showReplySettings, setShowReplySettings] = useState(false);
  const [settingsFromName, setSettingsFromName] = useState(initialReplySettings.fromName);
  const [settingsSignature, setSettingsSignature] = useState(initialReplySettings.signature);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const saveReplySettings = async () => {
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      await fetch("/api/admin/inbox/reply-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromName: settingsFromName, signature: settingsSignature }),
      });
      setReplySettingsState({ fromName: settingsFromName.trim() || "moos.park Team", signature: settingsSignature });
      setSettingsSaved(true);
    } finally {
      setSavingSettings(false);
    }
  };

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      alle: entries.length,
      kontakt: 0,
      eventlocation: 0,
      veranstaltung: 0,
      promoter: 0,
      bewerbung: 0,
      reservierung: 0,
      eventexperience: 0,
    };
    for (const e of entries) c[e.type]++;
    return c;
  }, [entries]);

  const visible =
    filter === "alle" ? entries : entries.filter((e) => e.type === filter);

  const toggleRead = async (entry: InboxEntry) => {
    setBusyId(entry.id);
    try {
      await fetch("/api/admin/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, read: !entry.read }),
      });
      setEntries((prev) =>
        prev.map((e) => (e.id === entry.id ? { ...e, read: !e.read } : e))
      );
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await fetch("/api/admin/inbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setBusyId(null);
    }
  };

  const startReply = (entry: InboxEntry) => {
    setReplyingId(entry.id);
    setReplySubject(
      `Re: Ihre Anfrage bei moos.park${entry.summary ? ` – ${entry.summary}` : ""}`
    );
    setReplyText(replySettings.signature ? `\n\n${replySettings.signature}` : "");
    setReplyError(null);
  };

  const sendReply = async (entry: InboxEntry) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    setReplyError(null);
    try {
      const res = await fetch(`/api/admin/inbox/${entry.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyText.trim(),
          subject: replySubject.trim(),
          fromName: replySettings.fromName,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Antwort konnte nicht gesendet werden.");
      setEntries((prev) =>
        prev.map((e) =>
          e.id === entry.id
            ? { ...e, read: true, repliedAt: new Date().toISOString(), replyText: replyText.trim() }
            : e
        )
      );
      setReplyingId(null);
      setReplyText("");
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Antwort konnte nicht gesendet werden.");
    } finally {
      setSendingReply(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Oeffnet ein neues Fenster mit nur dieser einen Anfrage, sauber
  // formatiert, und stoSSt sofort den Druckdialog an - damit man nicht
  // die ganze Postfach-Seite mit allen anderen Eintraegen mitdruckt.
  const printEntry = (entry: InboxEntry) => {
    const escapeHtml = (s: string) =>
      s.replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          })[c] as string
      );

    const rows = [
      ["Typ", TYPE_LABELS[entry.type]],
      ["Datum", formatDate(entry.createdAt)],
      ["Name", entry.name || "-"],
      ["E-Mail", entry.email || "-"],
      ["Telefon", entry.phone || "-"],
      ...(entry.summary ? [["Details", entry.summary]] : []),
    ];

    const win = window.open("", "_blank", "width=700,height=900");
    if (!win) return;
    win.document.write(`<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(TYPE_LABELS[entry.type])} - ${escapeHtml(entry.name || "Anfrage")}</title>
<style>
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 40px; color: #111; }
  h1 { font-size: 20px; text-transform: uppercase; margin-bottom: 4px; }
  .type { display: inline-block; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; background: #eee; padding: 3px 8px; border-radius: 4px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 24px; }
  td { padding: 6px 0; border-bottom: 1px solid #eee; vertical-align: top; }
  td:first-child { font-weight: bold; width: 140px; color: #555; }
  .message-label { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #555; margin-bottom: 6px; }
  .message { white-space: pre-line; border: 1px solid #eee; border-radius: 8px; padding: 16px; }
</style>
</head>
<body>
  <span class="type">${escapeHtml(TYPE_LABELS[entry.type])}</span>
  <h1>${escapeHtml(entry.name || "Ohne Namen")}</h1>
  <table>
    ${rows.map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join("")}
  </table>
  ${
    entry.message
      ? `<div class="message-label">Nachricht</div><div class="message">${escapeHtml(entry.message)}</div>`
      : ""
  }
</body>
</html>`);
    win.document.close();
    win.focus();
    win.onload = () => win.print();
  };

  return (
    <div className="mt-8">
      <div className="rounded-2xl border border-foreground/10 p-4">
        <button
          type="button"
          onClick={() => setShowReplySettings((o) => !o)}
          className="flex w-full items-center justify-between text-left text-xs font-black uppercase tracking-wide text-foreground/70"
        >
          Absendername &amp; Signatur für Antworten
          <span className="text-foreground/40">{showReplySettings ? "▲" : "▼"}</span>
        </button>
        {!showReplySettings && (
          <p className="mt-1 text-xs text-foreground/40">
            Aktuell: {replySettings.fromName} — einmal einrichten, wird
            danach bei jeder Antwort automatisch verwendet.
          </p>
        )}
        {showReplySettings && (
          <div className="mt-3">
            <label className="mb-1 block text-[11px] font-bold uppercase text-foreground/50">
              Absendername
            </label>
            <input
              value={settingsFromName}
              onChange={(e) => setSettingsFromName(e.target.value)}
              placeholder="z.B. Sarah Geisler"
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
            />
            <label className="mb-1 mt-3 block text-[11px] font-bold uppercase text-foreground/50">
              Signatur (z.B. aus eurer Mac-Mail per Copy-Paste)
            </label>
            <textarea
              value={settingsSignature}
              onChange={(e) => setSettingsSignature(e.target.value)}
              rows={6}
              className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={saveReplySettings}
                disabled={savingSettings}
                className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-50"
              >
                <FlipText text={savingSettings ? "Speichert…" : "Speichern"} />
              </button>
              {settingsSaved && (
                <span className="text-xs font-bold text-accent-lime">Gespeichert.</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-foreground/10 pb-4">
        {/* "bewerbung"/"reservierung" bewusst kein eigener Tab mehr - siehe
            HIDDEN_TYPES in lib/inbox.ts, laufen ausschliesslich ueber
            Clubscale. */}
        {(
          [
            "alle",
            "kontakt",
            "eventlocation",
            "veranstaltung",
            "promoter",
            "eventexperience",
          ] as Filter[]
        ).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-colors ${
              filter === f
                ? "bg-accent-lime text-black"
                : "border border-foreground/20 text-foreground/60 hover:border-accent-lime"
            }`}
          >
            {f === "alle" ? "Alle" : TYPE_LABELS[f]} ({counts[f]})
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {visible.length === 0 && (
          <p className="text-sm text-foreground/50">
            Keine Einträge in dieser Ansicht.
          </p>
        )}
        {visible.map((entry) => (
          <li
            key={entry.id}
            className={`rounded-xl border p-4 ${
              entry.read
                ? "border-foreground/10"
                : "border-accent-lime/40 bg-accent-lime/[0.03]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${TYPE_COLORS[entry.type]}`}
                  >
                    {TYPE_LABELS[entry.type]}
                  </span>
                  {!entry.read && (
                    <span className="rounded bg-accent-lime px-2 py-0.5 text-[10px] font-black uppercase text-black">
                      Neu
                    </span>
                  )}
                  <span className="text-xs text-foreground/40">
                    {formatDate(entry.createdAt)}
                  </span>
                </div>
                <p className="mt-2 font-black uppercase text-foreground">
                  {entry.name || "Ohne Namen"}
                </p>
                <p className="mt-0.5 text-sm text-foreground/60">
                  {[entry.email, entry.phone].filter(Boolean).join(" · ")}
                </p>
                {entry.summary && (
                  <p className="mt-1 text-sm font-bold text-accent">
                    {entry.summary}
                  </p>
                )}
                {entry.message && (
                  <p className="mt-2 whitespace-pre-line text-sm text-foreground/70">
                    {entry.message}
                  </p>
                )}
                {entry.repliedAt && (
                  <div className="mt-3 rounded-lg border border-accent-lime/30 bg-accent-lime/5 p-3">
                    <p className="text-[10px] font-black uppercase tracking-wide text-accent-lime">
                      Beantwortet am {formatDate(entry.repliedAt)}
                    </p>
                    {entry.replyText && (
                      <p className="mt-1 whitespace-pre-line text-xs text-foreground/60">
                        {entry.replyText}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 flex-col gap-2 text-xs font-bold uppercase">
                {entry.email && (
                  <button
                    type="button"
                    onClick={() =>
                      replyingId === entry.id ? setReplyingId(null) : startReply(entry)
                    }
                    className="rounded-lg bg-accent-lime px-3 py-1.5 text-black"
                  >
                    <FlipText text={replyingId === entry.id ? "Abbrechen" : "Antworten"} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => printEntry(entry)}
                  className="rounded-lg border border-foreground/20 px-3 py-1.5 text-foreground/70 hover:border-accent-lime"
                >
                  <FlipText text="Drucken" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleRead(entry)}
                  disabled={busyId === entry.id}
                  className="rounded-lg border border-foreground/20 px-3 py-1.5 text-foreground/70 hover:border-accent-lime disabled:opacity-40"
                >
                  <FlipText text={entry.read ? "Als ungelesen" : "Als gelesen"} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(entry.id)}
                  disabled={busyId === entry.id}
                  className="rounded-lg border border-red-500/30 px-3 py-1.5 text-red-500 disabled:opacity-40"
                >
                  <FlipText text="Löschen" />
                </button>
              </div>
            </div>

            {replyingId === entry.id && (
              <div className="mt-4 border-t border-foreground/10 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-foreground/50">
                  Antwort an {entry.email} · Von: {replySettings.fromName}
                </p>
                <input
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  placeholder="Betreff"
                  className="mt-2 w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
                />
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={8}
                  placeholder="Ihre Antwort…"
                  className="mt-2 w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground outline-none focus:border-accent-lime"
                />
                {replyError && <p className="mt-2 text-xs text-red-500">{replyError}</p>}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => sendReply(entry)}
                    disabled={sendingReply || !replyText.trim()}
                    className="rounded-lg bg-accent-lime px-5 py-2 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    <FlipText text={sendingReply ? "Wird gesendet…" : "Antwort senden"} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
