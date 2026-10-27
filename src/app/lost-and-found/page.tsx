import Link from "next/link";
import FlipText from "@/components/FlipText";

export const metadata = {
  alternates: { canonical: "/lost-and-found" },
  title: "Lost and Found - moos.park | Eventlocation",
  description:
    "Etwas im moos.park verloren oder gefunden? Melde es direkt in der moos.park App – wir bewahren Fundsachen auf und helfen dir, sie zurückzubekommen.",
};

const STEPS = [
  {
    title: "Meldung in der App",
    text: "Öffne die moos.park App und sende deine Lost-and-Found-Meldung. Beschreibe, was du verloren hast, und wann und wo.",
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

export default function LostAndFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <p className="text-center text-xs font-black uppercase tracking-[0.3em] text-accent-lime">
        Service
      </p>
      <h1 className="mt-3 text-center text-4xl font-black uppercase text-foreground sm:text-5xl">
        Lost and Found
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-center text-foreground/60">
        Handy, Jacke, Schlüssel oder Geldbeutel im moos.park liegen geblieben?
        Oder hast du bei uns etwas gefunden? Melde es direkt in unserer App.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
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

      <div className="mt-12 rounded-2xl bg-accent-lime p-8 text-center sm:p-10">
        <h2 className="text-2xl font-black uppercase text-black">
          Meldung nur über die App
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-black/70">
          Verloren- und Fundmeldungen nehmen wir ausschließlich über die
          moos.park App entgegen. Lade sie kostenlos herunter und sende deine
          Meldung direkt dort.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="https://apps.apple.com/de/app/moos-park/id6739537470"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-black px-8 py-3 text-sm font-black uppercase tracking-wide text-white transition-transform hover:scale-105"
          >
            <FlipText text="App Store" />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=de.moospark.clubscale&pcampaignid=web_share"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-black px-8 py-3 text-sm font-black uppercase tracking-wide text-white transition-transform hover:scale-105"
          >
            <FlipText text="Google Play" />
          </a>
        </div>
        <p className="mt-5 text-xs text-black/60">
          Mehr zur App findest du auf der Seite{" "}
          <Link href="/app" className="underline">
            Unsere App
          </Link>
          .
        </p>
      </div>

      <p className="mt-6 text-xs text-foreground/40">
        Fundsachen bewahren wir für begrenzte Zeit auf. Wertsachen wie Ausweise
        oder Handys geben wir nur gegen Nachweis der Eigentümerschaft heraus.
      </p>
    </div>
  );
}
