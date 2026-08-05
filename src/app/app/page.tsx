import Image from "next/image";
import {
  TicketIcon,
  CouponIcon,
  CalendarIcon,
  PointsIcon,
  GiftIcon,
  FastlineIcon,
  PhoneInfoIcon,
  BellIcon,
} from "@/components/AppIcons";

export const metadata = {
  title: "moos.park App - Tickets, Coupons & Punkte sammeln | moos.park",
  description:
    "Die moos.park App: Tickets direkt in der Hosentasche, Coupon-Codes einlösen, Punkte sammeln und einlösen, Geschenke abholen, Fastline-Eingang und immer als Erstes von neuen Veranstaltungen erfahren.",
};

const APP_STORE_URL = "https://apps.apple.com/de/app/moos-park/id6739537470";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=de.moospark.clubscale&pcampaignid=web_share";

const BENEFITS = [
  {
    icon: TicketIcon,
    title: "Tickets in der Hosentasche",
    text: "Kein Drucken, kein Verlieren - dein Ticket liegt immer griffbereit auf deinem Handy, direkt zum Vorzeigen am Einlass.",
  },
  {
    icon: CouponIcon,
    title: "Coupon-Codes einlösen",
    text: "Rabatt-Codes und Aktionen ganz einfach direkt in der App einlösen - ohne Umwege, ohne Papierkram.",
  },
  {
    icon: PointsIcon,
    title: "Punkte sammeln & einlösen",
    text: "Bei jedem Besuch sammelst du Punkte, die du gegen Prämien und Vorteile eintauschen kannst. Je öfter du da bist, desto mehr springt für dich raus.",
  },
  {
    icon: GiftIcon,
    title: "Geschenke abholen",
    text: "Ob Geburtstags-Special oder Treue-Prämie - deine Geschenke holst du direkt über die App ab.",
  },
  {
    icon: FastlineIcon,
    title: "Fastline-Eingang",
    text: "Warteschlange? Nicht mit dir. Mit der App nutzt du den Fastline-Eingang und bist schneller drinnen.",
  },
  {
    icon: PhoneInfoIcon,
    title: "Alle Infos immer dabei",
    text: "Öffnungszeiten, Anfahrt, Line-up, Hausregeln - alles an einem Ort, jederzeit griffbereit auf deinem Handy.",
  },
  {
    icon: BellIcon,
    title: "Neueste Events als Erstes sehen",
    text: "Neue Partys, Tanzabende und Aktionen bekommst du in der App zuerst mit - bevor sie überall sonst auftauchen.",
  },
  {
    icon: CalendarIcon,
    title: "Tisch reservieren",
    text: "Sichere dir deinen Tisch bequem über die App - ganz ohne Anruf.",
  },
];

export default function AppPage() {
  return (
    <div>
      <section className="px-6 pb-8 pt-32 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent-lime">
          moos.park App
        </p>
        <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-black uppercase leading-tight text-foreground sm:text-6xl">
          Deine Nacht.
          <br />
          Deine App.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Tickets, Coupons, Punkte, Fastline-Eingang und alle Infos zu
          moos.park - alles an einem Ort, immer griffbereit in deiner Hosentasche.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-90 transition-opacity hover:opacity-100"
          >
            <Image
              src="/images/appstore.png"
              alt="App Store"
              width={150}
              height={41}
            />
          </a>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-90 transition-opacity hover:opacity-100"
          >
            <Image
              src="/images/googleplay.png"
              alt="Google Play"
              width={150}
              height={43}
            />
          </a>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black uppercase text-foreground">
            Das kann die App.
          </h2>
          <p className="mt-2 text-center text-foreground/60">
            Alle Vorteile auf einen Blick.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-xl border border-foreground/8 bg-foreground/[0.025] p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent-lime text-black">
                  <Icon />
                </div>
                <h3 className="mt-4 font-black uppercase leading-tight text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-foreground/60">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-3xl rounded-2xl border border-foreground/8 bg-foreground/[0.025] p-8 text-center sm:p-12">
          <h2 className="text-2xl font-black uppercase text-foreground sm:text-3xl">
            Jetzt kostenlos herunterladen.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-foreground/70">
            Verfügbar für iOS und Android - in wenigen Sekunden installiert
            und startklar für deinen nächsten Besuch im moos.park.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 transition-opacity hover:opacity-100"
            >
              <Image
                src="/images/appstore.png"
                alt="App Store"
                width={150}
                height={41}
              />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 transition-opacity hover:opacity-100"
            >
              <Image
                src="/images/googleplay.png"
                alt="Google Play"
                width={150}
                height={43}
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
