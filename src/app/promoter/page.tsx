import PromoterApplicationForm from "@/components/PromoterApplicationForm";

export const metadata = {
  title: "Promoter werden - moos.park | Eventlocation Pöttmes",
  description:
    "Werde Promoter im moos.park: Sonderkonditionen, freier Eintritt und Provision für Social-Media-Creator mit mindestens 1.000 Instagram-Followern.",
};

const REQUIREMENTS = [
  {
    title: "Mind. 1.000 Follower auf Instagram",
    text: "Dein Instagram-Profil hat mindestens 1.000 Follower und ist öffentlich einsehbar (kein privates Profil).",
  },
  {
    title: "Aktiver Account",
    text: "Du postest regelmäßig Storys oder Beiträge - kein reines Karteileichen-Profil.",
  },
  {
    title: "Mindestalter 18 Jahre",
    text: "Du bist volljährig und kannst eigenständig Verträge über deine Promoter-Tätigkeit abschließen.",
  },
  {
    title: "Nähe zur Region",
    text: "Du wohnst in Pöttmes oder im Umkreis (Aichach, Augsburg, Ingolstadt, Regensburg) und kannst regelmäßig vor Ort sein.",
  },
];

const BENEFITS = [
  {
    title: "Freier Eintritt",
    text: "Als Promoter kommst du an allen Veranstaltungen kostenlos rein - für dich und je nach Vereinbarung auch für deine Begleitung.",
  },
  {
    title: "Provision pro Gast",
    text: "Für jeden Gast, den du über deinen persönlichen Code oder Link mitbringst, erhältst du eine Provision.",
  },
  {
    title: "Exklusive Gästelisten-Plätze",
    text: "Du bekommst ein eigenes Kontingent an Gästelisten-Plätzen, die du an deine Follower und Freunde vergeben kannst.",
  },
  {
    title: "VIP- & Fastline-Zugang",
    text: "Kein Anstehen für dich und deine Gäste - Zugang über die Fastline und bevorzugte Behandlung im Haus.",
  },
  {
    title: "Sonderkonditionen im Haus",
    text: "Rabatte auf Getränke und exklusive Deals, die normalen Gästen nicht zur Verfügung stehen.",
  },
  {
    title: "Exklusive Einladungen",
    text: "Du erfährst als Erstes von neuen Events und wirst zu exklusiven Promoter- und Networking-Abenden eingeladen.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Bewerben",
    text: "Formular unten ausfüllen - Name, Instagram-Profil und Follower-Anzahl genügen.",
  },
  {
    num: "02",
    title: "Prüfung",
    text: "Wir schauen uns dein Profil an und melden uns innerhalb weniger Tage zurück.",
  },
  {
    num: "03",
    title: "Onboarding",
    text: "Kurzes Gespräch, dein persönlicher Code/Link wird eingerichtet, alle Konditionen werden geklärt.",
  },
  {
    num: "04",
    title: "Loslegen",
    text: "Du teilst unsere Events, bringst Gäste mit und profitierst von deinen Sonderkonditionen im Haus.",
  },
];

export default function PromoterPage() {
  return (
    <div>
      <section className="px-6 pb-8 pt-32 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          moos.park Promoter-Programm
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          Werde Promoter.
          <br />
          Sichere dir Extras.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Du liebst Nightlife-Content und hast eine aktive Instagram-Community?
          Als moos.park-Promoter bekommst du freien Eintritt, Provision und
          exklusive Sonderkonditionen bei uns im Haus.
        </p>
        <a
          href="#bewerben"
          className="mt-8 inline-block rounded-lg bg-accent-lime px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Jetzt Promoter werden
        </a>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Das bringt dir das Programm.
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Deine Sonderkonditionen als Promoter.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-foreground/8 bg-foreground/[0.025] p-6"
              >
                <h3 className="font-black uppercase leading-tight text-foreground">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Wer kann mitmachen?
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Diese Mindestanforderungen solltest du erfüllen.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {REQUIREMENTS.map((r) => (
              <div
                key={r.title}
                className="rounded-xl border border-foreground/8 bg-background p-6"
              >
                <h3 className="font-black uppercase leading-tight text-foreground">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60">{r.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-foreground/40">
            Die Aufnahme ins Promoter-Programm liegt in unserem Ermessen -
            Erfüllung der Mindestanforderungen garantiert keine Aufnahme.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            So einfach geht&apos;s.
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            In 4 Schritten zum moos.park-Promoter.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.num}>
                <span className="text-4xl font-black text-accent">
                  {s.num}
                </span>
                <h3 className="mt-2 text-lg font-black uppercase text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="bewerben" className="px-6 pb-28">
        <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 sm:p-12">
          <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
            Jetzt Promoter werden
          </p>
          <h2 className="mt-2 text-3xl font-black uppercase text-foreground">
            Sofort bewerben.
          </h2>
          <p className="mt-4 text-foreground/70">
            Name, Instagram-Profil und Follower-Anzahl angeben, Datenschutz
            akzeptieren, absenden - fertig. Wir melden uns bei dir.
          </p>
          <div className="mt-8">
            <PromoterApplicationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
