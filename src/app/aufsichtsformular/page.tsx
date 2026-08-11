import Link from "next/link";
import Image from "next/image";
import Accordion from "@/components/Accordion";
import FlipText from "@/components/FlipText";

export const metadata = {
  title: "Aufsicht im moos.park - Aufsichtszettel & Einlassalter | moos.park",
  description:
    "Alles zum Thema Aufsicht im moos.park: Einlassalter je Veranstaltung, Anforderungen an die Aufsichtsperson und den Aufsichtszettel direkt in der App ausfüllen.",
};

const APP_STORE_URL = "https://apps.apple.com/de/app/moos-park/id6739537470";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=de.moospark.clubscale&pcampaignid=web_share";

const FAQ = [
  {
    q: "Ab welchem Alter komme ich ohne Aufsichtsperson rein?",
    a: "Der Einlass ist generell ab 17 Jahren möglich. An Ü30-Veranstaltungen liegt die Grenze bei 25 Jahren, an ausgewählten Events bei 16 Jahren. Die genaue Altersgrenze steht immer in der jeweiligen Eventbeschreibung - am besten vorher nachlesen.",
  },
  {
    q: "Wer braucht eine Aufsichtsperson?",
    a: "Bist du zum Zeitpunkt der Veranstaltung noch nicht volljährig und liegst unter der regulären Alterseinlassgrenze, benötigst du eine Aufsichtsperson.",
  },
  {
    q: "Welche Voraussetzungen muss die Aufsichtsperson erfüllen?",
    a: "Die Aufsichtsperson muss mindestens 18 Jahre alt sein und bis mindestens 23:59 Uhr anwesend bleiben. Pro Aufsichtsperson ist nur eine Person unter 18 Jahren zulässig.",
  },
  {
    q: "Was muss ich zusätzlich zum Aufsichtszettel mitbringen?",
    a: "Ein gültiges Ausweisdokument im Original (Personalausweis oder Reisepass) sowie eine Kopie vom Ausweis eines Erziehungsberechtigten. Kopien vom eigenen Ausweis, Führerscheine, Bankkarten oder Mitgliedsausweise werden nicht als Ausweisdokument akzeptiert.",
  },
  {
    q: "Wo fülle ich den Aufsichtszettel aus?",
    a: "Direkt in der moos.park App - digital, ohne Ausdrucken. Einfach vorab ausfüllen und am Einlass vorzeigen.",
  },
  {
    q: "Ist der Einlass mit Aufsichtsperson garantiert?",
    a: "Nein, der Einlass erfolgt immer unter Vorbehalt und liegt im Ermessen des Sicherheitspersonals - auch mit vollständig ausgefülltem Aufsichtszettel und anwesender Aufsichtsperson.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AufsichtsformularPage() {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-script-in-head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="px-6 pb-12 pt-32 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          Aufsicht im moos.park
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          Alles zum Thema
          <br />
          Aufsichtsperson.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Einlassalter, Voraussetzungen und der Aufsichtszettel - hier findest
          du alles, was du für den Einlass mit Aufsichtsperson wissen musst.
        </p>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-black uppercase text-foreground sm:text-3xl">
            Einlassalter je Veranstaltung
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-foreground/10 p-6 text-center">
              <p className="text-3xl font-black text-accent-lime">16+</p>
              <p className="mt-2 font-bold uppercase text-foreground">
                Ausgewählte Events
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                Bei einzelnen Veranstaltungen möglich - steht in der
                jeweiligen Eventbeschreibung.
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 p-6 text-center">
              <p className="text-3xl font-black text-accent-lime">17+</p>
              <p className="mt-2 font-bold uppercase text-foreground">
                Regulärer Einlass
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                Die generelle Altersgrenze für den Einlass ohne
                Aufsichtsperson.
              </p>
            </div>
            <div className="rounded-2xl border border-foreground/10 p-6 text-center">
              <p className="text-3xl font-black text-accent-lime">25+</p>
              <p className="mt-2 font-bold uppercase text-foreground">
                Ü30-Veranstaltungen
              </p>
              <p className="mt-2 text-sm text-foreground/60">
                An Ü30-Events liegt die Altersgrenze höher.
              </p>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-foreground/40">
            Ausnahmen werden nicht gemacht, auch nicht bei Nachfrage im Haus.
            Bist du unter der jeweiligen Altersgrenze, brauchst du eine
            Aufsichtsperson.
          </p>
        </div>
      </section>

      <section className="bg-foreground/[0.02] px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-black uppercase text-foreground sm:text-3xl">
            Das braucht deine Aufsichtsperson
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Mindestens 18 Jahre alt",
              "Bis mindestens 23:59 Uhr anwesend",
              "Gültiges Ausweisdokument im Original",
              "Nur 1 Person unter 18 Jahren pro Aufsichtsperson",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl bg-background px-5 py-4 text-sm font-bold text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-accent-lime p-8 text-center sm:p-12">
          <h2 className="text-2xl font-black uppercase text-black sm:text-3xl">
            Aufsichtszettel? Gibt's jetzt in der App.
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-bold text-black/80">
            Fülle den Aufsichtszettel direkt in der moos.park App aus - kein
            Ausdrucken mehr nötig. Das spart dir Zeit, beschleunigt den
            Einlass am Abend und schont ganz nebenbei auch noch die Umwelt.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 transition-opacity hover:opacity-100"
            >
              <Image src="/images/appstore.png" alt="App Store" width={150} height={41} />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 transition-opacity hover:opacity-100"
            >
              <Image src="/images/googleplay.png" alt="Google Play" width={150} height={43} />
            </a>
          </div>
          <Link
            href="/app"
            className="mt-6 inline-block rounded-lg bg-black px-6 py-2.5 text-xs font-black uppercase tracking-wide text-accent-lime"
          >
            <FlipText text="Mehr zur App" />
          </Link>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-black uppercase text-foreground sm:text-3xl">
            Häufige Fragen
          </h2>
          <div className="mt-8">
            <Accordion items={FAQ} />
          </div>
          <p className="mt-6 text-center text-foreground/60">
            Noch eine Frage offen?{" "}
            <Link href="/kontakt" className="font-bold text-accent">
              Kontakt aufnehmen
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
