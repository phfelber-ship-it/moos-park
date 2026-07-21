"use client";

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-black uppercase leading-tight  text-foreground sm:text-4xl">
        Wir sind immer auf der Suche nach tollen Persönlichkeiten!
      </h1>
      <p className="mt-4 text-black/70">
        Du bist motiviert, teamfähig und hast Freude an deinem Beruf? Dann
        möchten wir dich kennenlernen! Egal ob mit Erfahrung oder als
        Quereinsteiger – Hauptsache, du passt zu uns. Bewirb dich jetzt und
        werde Teil unseres Teams!
      </p>
      <p className="mt-2 text-xs text-black/40">
        Hinweis: Zur besseren Lesbarkeit verwenden wir im Text das generische
        Maskulinum. Gemeint sind stets alle Geschlechter.
      </p>

      <p className="mt-8 text-lg font-bold text-accent-lime">
        Auch im Bereich Marketing und Vertrieb sind wir ständig auf der Suche.
      </p>
      <p className="mt-2 text-black/70">Werde Teil von etwas Großem!</p>

      <form className="mt-10 grid gap-4">
        <input
          name="vorname"
          placeholder="Vorname"
          className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
        />
        <input
          name="nachname"
          placeholder="Nachname"
          className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
        />
        <input
          name="email"
          type="email"
          placeholder="E-Mail"
          className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
        />
        <input
          name="telefon"
          placeholder="Telefonnummer"
          className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
        />
        <input
          name="position"
          placeholder="Wofür bewirbst du dich?"
          className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
        />
        <textarea
          name="nachricht"
          placeholder="Deine Nachricht an uns"
          rows={4}
          className="rounded-xl border border-black/15 bg-black/5 px-4 py-3  text-foreground placeholder-black/40 outline-none focus:border-accent"
        />
        <label className="flex items-start gap-2 text-xs text-black/50">
          <input type="checkbox" className="mt-0.5" />
          Ich habe die Datenschutzbestimmungen zur Kenntnis genommen und
          akzeptiere diese.
        </label>
        <button
          type="submit"
          className="w-fit rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Bewerbung senden
        </button>
      </form>
    </div>
  );
}
