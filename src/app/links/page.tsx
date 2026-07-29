import Image from "next/image";

export const metadata = {
  title: "Links | moos.park Pöttmes",
  description:
    "Alle wichtigen Links von moos.park an einem Ort: Events, Location, Tickets, Social Media und Kontakt.",
};

const SOCIALS = [
  {
    href: "https://www.facebook.com/mp.poettmes",
    label: "Facebook",
    icon: (
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12" />
    ),
  },
  {
    href: "https://www.instagram.com/moos.park/?hl=de",
    label: "Instagram",
    icon: (
      <path d="M12 2c-2.7 0-3.1 0-4.2.1-1.1 0-1.8.2-2.5.5-.7.3-1.3.6-1.8 1.2-.6.5-.9 1.1-1.2 1.8-.3.7-.5 1.4-.5 2.5C1.7 9.2 1.7 9.6 1.7 12.3s0 3.1.1 4.2c0 1.1.2 1.8.5 2.5.3.7.6 1.3 1.2 1.8.5.6 1.1.9 1.8 1.2.7.3 1.4.5 2.5.5 1.1.1 1.5.1 4.2.1s3.1 0 4.2-.1c1.1 0 1.8-.2 2.5-.5.7-.3 1.3-.6 1.8-1.2.6-.5.9-1.1 1.2-1.8.3-.7.5-1.4.5-2.5.1-1.1.1-1.5.1-4.2s0-3.1-.1-4.2c0-1.1-.2-1.8-.5-2.5-.3-.7-.6-1.3-1.2-1.8-.5-.6-1.1-.9-1.8-1.2-.7-.3-1.4-.5-2.5-.5C15.1 2 14.7 2 12 2m0 1.8c2.6 0 3 0 4 .1 1 0 1.5.2 1.9.3.5.2.8.4 1.1.8.4.3.6.6.8 1.1.2.4.3.9.3 1.9.1 1 .1 1.4.1 4s0 3-.1 4c0 1-.2 1.5-.3 1.9-.2.5-.4.8-.8 1.1-.3.4-.6.6-1.1.8-.4.2-.9.3-1.9.3-1 .1-1.4.1-4 .1s-3 0-4-.1c-1 0-1.5-.2-1.9-.3-.5-.2-.8-.4-1.1-.8-.4-.3-.6-.6-.8-1.1-.2-.4-.3-.9-.3-1.9-.1-1-.1-1.4-.1-4s0-3 .1-4c0-1 .2-1.5.3-1.9.2-.5.4-.8.8-1.1.3-.4.6-.6 1.1-.8.4-.2.9-.3 1.9-.3 1-.1 1.4-.1 4-.1M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4m5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0" />
    ),
  },
  {
    href: "https://www.tiktok.com/@moos.park",
    label: "TikTok",
    icon: (
      <path d="M16.6 5.8a4.3 4.3 0 0 1-3-3.8h-3.1v13.7a2.6 2.6 0 1 1-1.8-2.5v-3.2a5.8 5.8 0 1 0 4.9 5.7V9.3a7.3 7.3 0 0 0 4.3 1.4V7.5a4.3 4.3 0 0 1-1.3-1.7" />
    ),
  },
];

const LINK_BUTTONS = [
  { href: "/events", label: "Kommende Events 🎉" },
  {
    href: "https://www.google.com/maps?q=Rudolf-Diesel-Stra%C3%9Fe+23,+86554+P%C3%B6ttmes",
    label: "Unsere Location 📍",
  },
  {
    href: "https://apps.apple.com/de/app/moos-park/id6739537470",
    label: "Ticket & App für iOS 🎫",
  },
  {
    href: "https://play.google.com/store/apps/details?id=de.moospark.clubscale&pcampaignid=web_share",
    label: "Ticket & App für ANDROID 🎫",
  },
  { href: "/kontakt", label: "Kontakt zu uns 🤙" },
];

export default function LinksPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-6 pb-16 pt-6 text-center">
      <div className="mt-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[3px]">
        <div className="rounded-full bg-background p-2">
          <Image
            src="/images/logo.png"
            alt="moos.park – Dein Hotspot für Tag und Nacht"
            width={180}
            height={180}
            className="w-40"
          />
        </div>
      </div>

      <h1 className="mt-6 text-3xl font-black uppercase tracking-tight text-foreground">
        Links
      </h1>
      <p className="mt-2 text-xl font-bold text-foreground">
        moos.park – Die Eventlocation seit 1994 🚀
      </p>
      <p className="mt-4 text-foreground/60">
        Die wichtigsten Links findest du hier.
      </p>

      <div className="mt-6 flex items-center justify-center gap-4">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              {s.icon}
            </svg>
          </a>
        ))}
      </div>

      <div className="mt-8 flex w-full max-w-md flex-col gap-4">
        {LINK_BUTTONS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent-lime px-6 py-4 text-lg font-black text-black transition-transform hover:scale-[1.02]"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
