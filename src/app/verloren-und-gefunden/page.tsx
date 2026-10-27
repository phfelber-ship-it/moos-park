import LostAndFoundForm from "@/components/LostAndFoundForm";

export const metadata = {
  alternates: { canonical: "/verloren-und-gefunden" },
  title: "Verloren & Gefunden - moos.park | Eventlocation",
  description:
    "Etwas im moos.park verloren oder gefunden? Melde dich bei uns – wir bewahren Fundsachen auf und helfen dir, sie zurückzubekommen.",
};

const STEPS = [
  {
    title: "Verlust melden",
    text: "Beschreibe uns, was du verloren hast, wann und in welchem Bereich. Je genauer, desto schneller finden wir es.",
  },
  {
    title: "Wir gleichen ab",
    text: "Unser Team schaut in den Fundsachen nach und meldet sich bei dir, sobald etwas passt.",
  },
  {
    title: "Abholen",
    text: "Dein Fundstück holst du nach Absprache im moos.park ab. Bitte bring einen Ausweis mit.",
  },
];

export default function VerlorenUndGefundenPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
        Service
      </p>
      <h1 className="mt-3 text-center text-4xl font-black uppercase text-foreground sm:text-5xl">
        Verloren &amp; Gefunden
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-foreground/60">
        Handy, Jacke, Schlüssel oder Geldbeutel im moos.park liegen geblieben?
        Oder hast du bei uns etwas gefunden? Schreib uns, wir kümmern uns.
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="rounded-2xl border border-foreground/10 bg-foreground/[0.025] p-6"
          >
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
              Schritt {i + 1}
            </p>
            <h2 className="mt-3 text-lg font-black uppercase text-foreground">
              {s.title}
            </h2>
            <p className="mt-2 text-sm text-foreground/70">{s.text}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-2xl">
        <LostAndFoundForm />
        <p className="mt-6 text-xs text-foreground/40">
          Fundsachen bewahren wir für begrenzte Zeit auf. Wertsachen wie
          Ausweise oder Handys geben wir nur gegen Nachweis der Eigentümer­schaft
          heraus.
        </p>
      </div>
    </div>
  );
}
