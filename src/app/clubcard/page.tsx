import FlipText from "@/components/FlipText";
import MemberCardsHero from "@/components/MemberCardsHero";

export const metadata = {
  alternates: { canonical: "/clubcard" },
  title: "MOOS.PARK CLUBCARD 26/27 – Saisonkarte mit Eintrittsvorteilen | moos.park",
  description:
    "Sichere dir die MOOS.PARK Clubcard 26/27 zum Early-Bird-Preis – günstigerer Eintritt oder eintrittsfrei bei regulären Events bis Mai 2027, digital in der App.",
};

const TIERS = [
  {
    emoji: "🥉",
    name: "Bronze",
    earlyBird: 29,
    regular: 49,
    headline: "Nur 7 € Eintritt statt 9 €",
    text: "Mit Bronze sparst du bei jedem regulären Besuch 2 €.",
    audience:
      "Für alle, die regelmäßig feiern und bei jedem Besuch sparen möchten.",
    highlight: false,
  },
  {
    emoji: "🥈",
    name: "Silber",
    earlyBird: 59,
    regular: 79,
    headline: "Nur 5 € Eintritt statt 9 €",
    text: "Mit Silber sparst du bei jedem regulären Besuch 4 €.",
    audience:
      "Für alle, die regelmäßig im MOOS.PARK sind und deutlich weniger Eintritt zahlen möchten.",
    highlight: false,
  },
  {
    emoji: "🥇",
    name: "Gold",
    earlyBird: 99,
    regular: 129,
    headline: "Reguläre Events eintrittsfrei",
    text: "Einmal zahlen und bei allen regulären MOOS.PARK Events bis Mai 2027 keinen Eintritt mehr bezahlen.",
    audience:
      "Für echte MOOS.PARK Fans: reguläre Events die komplette Saison ohne Eintritt.",
    highlight: false,
  },
  {
    emoji: "💎",
    name: "Premium",
    earlyBird: 129,
    regular: 149,
    headline: "Alle Events inklusive – auch Sonderevents",
    text: "Mit Premium bist du bei jedem MOOS.PARK Event dabei, auch bei Sonderevents, ohne zusätzlichen Eintritt.",
    audience:
      "Für alle, die keine einzige Party verpassen wollen – inklusive Sonderevents.",
    highlight: true,
  },
];

const CTA_HREF = "/kontakt";

export default function ClubcardPage() {
  return (
    <div>
      <section className="px-6 pb-12 pt-28 text-center sm:pt-32">
        <MemberCardsHero />
        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-foreground/50">
          Jetzt verfügbar
        </p>
        <p className="mt-2 text-sm font-bold uppercase tracking-wide text-accent-lime">
          🎟️ MOOS.PARK CLUBCARD 26/27
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          Deine Saison. Deine Vorteile.
          <br />
          Dein moos.park.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Mach dich bereit für die neue MOOS.PARK Saison und sichere dir
          deine Clubcard 26/27. Mit deiner Clubcard profitierst du vom
          Reopening bis Mai 2027 bei unseren Veranstaltungen.
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm font-bold text-accent-lime">
          Nur bis zum Reopening am 12.09. zum vergünstigten Early-Bird-Preis
          – danach wird&apos;s teurer. Jetzt zuschlagen!
        </p>
        <a
          href={CTA_HREF}
          className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          <FlipText text="Jetzt Early Bird sichern" />
        </a>
        <p className="mx-auto mt-6 max-w-md text-xs text-foreground/50">
          📱 Deine Clubcard wird digital in der moos.park App hinterlegt –
          kein Papier, kein Verlust, beim Einlass einfach vorzeigen.
        </p>
      </section>

      {/* Preis-Karten */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border p-8 text-center ${
                  tier.highlight
                    ? "border-accent-lime bg-accent-lime/[0.06]"
                    : "border-foreground/8 bg-foreground/[0.025]"
                }`}
              >
                {tier.highlight && (
                  <span className="mx-auto -mt-4 mb-3 w-fit rounded-full bg-accent-lime px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                    Alles inklusive
                  </span>
                )}
                <span className="text-4xl">{tier.emoji}</span>
                <h2 className="mt-3 text-2xl font-black uppercase text-foreground">
                  {tier.name}
                </h2>
                <div className="mt-4">
                  <span className="text-4xl font-black text-foreground">
                    {tier.earlyBird} €
                  </span>
                  <p className="mt-1 text-xs font-black uppercase tracking-wide text-accent-lime">
                    Early Bird
                  </p>
                  <p className="mt-1 text-xs text-foreground/40 line-through">
                    regulär {tier.regular} €
                  </p>
                </div>
                <p className="mt-5 text-base font-bold uppercase text-foreground">
                  {tier.headline}
                </p>
                <p className="mt-2 flex-1 text-sm text-foreground/60">
                  {tier.text}
                </p>
                <a
                  href={CTA_HREF}
                  className="mt-6 inline-block rounded-lg bg-accent-lime px-6 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
                >
                  <FlipText text="Jetzt sichern" />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-foreground/40">
            Die Bronze-, Silber- und Gold-Vorteile gelten bei unseren
            regulären Veranstaltungen, Sonderevents sind ausgenommen – nur
            mit Premium bist du auch bei Sonderevents ohne Eintritt dabei.
          </p>
        </div>
      </section>

      {/* Early Bird Erklärung */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl rounded-2xl bg-accent-lime p-8 text-center sm:p-12">
          <p className="text-sm font-black uppercase tracking-wide text-black/70">
            🔥 Jetzt Early Bird sichern
          </p>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight text-black sm:text-4xl">
            Die günstigen Early-Bird-Preise gibt es nur bis zum Reopening am
            12.09. online.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-bold text-black/80">
            Ab dem Reopening sind die Clubcards weiterhin im MOOS.PARK
            erhältlich – allerdings zum teureren regulären Preis: Bronze
            49 € · Silber 79 € · Gold 129 € · Premium 149 €.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-black/80">
            <span className="font-black uppercase">Dein Vorteil:</span> Du
            sicherst dir deine Clubcard jetzt zum günstigsten Preis, bevor
            sie ab dem 12.09. teurer wird – und kannst sie bereits beim
            Reopening nutzen. Also: jetzt zuschlagen!
          </p>
          <a
            href={CTA_HREF}
            className="mt-8 inline-block rounded-lg bg-black px-8 py-3 text-sm font-black uppercase tracking-wide text-accent-lime transition-transform hover:scale-105"
          >
            <FlipText text="Jetzt Early Bird sichern" />
          </a>
        </div>
      </section>

      {/* Welche Card passt */}
      <section className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Welche Clubcard passt zu dir?
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Einmal sichern. Die ganze Saison profitieren.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-xl border border-foreground/8 bg-foreground/[0.025] p-8 text-center"
              >
                <span className="text-3xl">{tier.emoji}</span>
                <h3 className="mt-3 text-lg font-black uppercase text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-3 text-sm text-foreground/60">
                  {tier.audience}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abschluss-Banner */}
      <section className="px-6 pb-28 text-center">
        <p className="text-sm font-black uppercase tracking-wide text-accent-lime">
          MOOS.PARK CLUBCARD 26/27
        </p>
        <h2 className="mx-auto mt-3 max-w-xl text-2xl font-black uppercase text-foreground sm:text-3xl">
          Gültig ab Reopening bis Mai 2027.
        </h2>
        <a
          href={CTA_HREF}
          className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          <FlipText text="Jetzt Early Bird sichern" />
        </a>
      </section>
    </div>
  );
}
