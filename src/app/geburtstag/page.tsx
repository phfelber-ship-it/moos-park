export const metadata = {
  title:
    "Geburtstag feiern Bayern – Location mieten für 18., 30., 40., 50. Geburtstag | moos.park",
};

const STEPS = [
  {
    num: "01",
    title: "Anfrage senden",
    text: "Schreib uns kurz über das Formular oder per WhatsApp. Kein langer Fragebogen – einfach melden.",
  },
  {
    num: "02",
    title: "Gemeinsam planen",
    text: "Wir melden uns persönlich und planen deinen Abend mit dir – Datum, Gästezahl, Wünsche. Unkompliziert.",
  },
  {
    num: "03",
    title: "Wir kümmern uns",
    text: "Du musst nichts mehr organisieren. Wir reservieren deinen Bereich für dich und deine Freunde.",
  },
  {
    num: "04",
    title: "Einfach feiern",
    text: "Du kommst, feierst und gehst. Kein Stress, kein Aufräumen. Das war's.",
  },
];

const BENEFITS = [
  {
    title: "Freier Eintritt für das Geburtstagskind",
    text: "Feiere deinen Geburtstag bei uns – als Geburtstagskind zahlst du keinen Eintritt und startest entspannt in deine Party.",
  },
  {
    title: "Kostenlose Tischreservierung",
    text: "Sichere dir kostenlos deinen Tisch – damit deine Gruppe zusammen feiern kann und der Abend entspannt startet.",
  },
  {
    title: "5 Freunde zahlen nur 50% vom Eintritt",
    text: "Bring deine Freunde mit – 5 deiner Gäste zahlen nur 50% Eintritt auf den Abendkassenpreis und feiern günstiger mit dir.",
  },
];

const REVIEWS = [
  {
    text: "Der beste Geburtstag meines Lebens. Ich musste gar nichts machen – einfach nur feiern. Das Team hat alles perfekt organisiert.",
    author: "Sarah M. – 32. Geburtstag",
  },
  {
    text: "Freier Eintritt fürs Geburtstagskind und meine Freunde haben gespart. Top Location, super Atmosphäre – nächstes Jahr wieder!",
    author: "Markus K. – 22. Geburtstag",
  },
  {
    text: "Endlich ein Geburtstag ohne Stress. Einfach ankommen, feiern und gehen. Das moos.park-Team hat sich um alles gekümmert.",
    author: "Lisa F. – 18. Geburtstag",
  },
];

const FAQ = [
  {
    q: "Wer kann einen Geburtstag im moos.park feiern?",
    a: "Jeder! Ob 18., 30., 40. oder 50. Geburtstag – wir freuen uns über jeden Anlass. Melde dich einfach bei uns und wir besprechen, was zu dir passt.",
  },
  {
    q: "Wie weit im Voraus muss ich anfragen?",
    a: "Am besten 2–4 Wochen vorher, damit wir alles in Ruhe planen können. Kurzfristige Anfragen versuchen wir aber immer möglich zu machen.",
  },
  {
    q: "Ist der Eintritt fürs Geburtstagskind wirklich gratis?",
    a: "Ja! Das Geburtstagskind kommt immer kostenlos rein. Zusätzlich sparen 5 Freunde je 50% auf den Abendkasseneintritt.",
  },
  {
    q: "Was kostet ein Geburtstag im moos.park?",
    a: "Den Tisch stellen wir dir kostenlos zur Verfügung. Der Rest ist abhängig von euren Getränken.",
  },
  {
    q: "Müssen wir selbst auf- oder abbauen?",
    a: "Nein! Wir übernehmen alles. Du kommst, feierst und gehst. Aufräumen und Abbau macht unser Team.",
  },
];

export default function GeburtstagPage() {
  return (
    <div>
      <section className="px-6 pb-12 pt-20 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          🎂 Geburtstags-Special
        </p>
        <h1 className="mt-3 text-4xl font-black uppercase leading-tight  text-foreground sm:text-6xl">
          Dein Geburtstag.
          <br />
          Einfach unvergesslich.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Kein Stress. Kein Aufräumen. Einfach nur feiern – wir kümmern uns um
          den Rest.
        </p>
        <a
          href="/kontakt"
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-sm font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
        >
          Jetzt anfragen
        </a>
        <p className="mt-6 text-sm text-foreground/50">
          ⭐⭐⭐⭐⭐ Hunderte Geburtstage bereits gefeiert – im moos.park.
        </p>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Deine Geburtstagsparty im moospark
          </h2>
          <p className="mt-2 text-center text-foreground/60">Was dich erwartet?</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8"
              >
                <h3 className="text-lg font-black uppercase text-foreground">
                  {b.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/60">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            So einfach geht's.
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            In 4 Schritten zu deiner Party.
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

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Was Gäste sagen.
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Echte Geburtstage. Echte Momente.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {REVIEWS.map((r) => (
              <div
                key={r.author}
                className="rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8"
              >
                <p className="text-accent">⭐⭐⭐⭐⭐</p>
                <p className="mt-3 text-sm italic text-foreground/70">
                  „{r.text}"
                </p>
                <p className="mt-4 text-sm font-bold text-foreground/50">
                  {r.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Häufige Fragen
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Alles, was du wissen möchtest.
          </p>
          <div className="mt-10 divide-y divide-foreground/8 rounded-2xl border border-foreground/8 bg-foreground/[0.025]">
            {FAQ.map((f) => (
              <div key={f.q} className="px-6 py-5">
                <p className="font-bold text-foreground">{f.q}</p>
                <p className="mt-2 text-sm text-foreground/60">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-foreground/60">
            Noch eine Frage offen?{" "}
            <a href="/kontakt" className="font-bold text-accent">
              Kontakt aufnehmen
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
