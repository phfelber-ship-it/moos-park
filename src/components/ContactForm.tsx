"use client";

export default function ContactForm() {
  return (
    <form className="grid gap-4">
      <input
        name="vorname"
        placeholder="Vorname"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-accent"
      />
      <input
        name="nachname"
        placeholder="Nachname"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-accent"
      />
      <input
        name="telefon"
        placeholder="Telefonnummer"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-accent"
      />
      <input
        name="email"
        type="email"
        placeholder="E-Mail"
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-accent"
      />
      <textarea
        name="nachricht"
        placeholder="Nachricht"
        rows={4}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none focus:border-accent"
      />
      <label className="flex items-start gap-2 text-xs text-white/50">
        <input type="checkbox" className="mt-0.5" />
        Ich habe die Datenschutzbestimmungen zur Kenntnis genommen und
        akzeptiere diese.
      </label>
      <button
        type="submit"
        className="w-fit rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
      >
        Senden
      </button>
    </form>
  );
}
