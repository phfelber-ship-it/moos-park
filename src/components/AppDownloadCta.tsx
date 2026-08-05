"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TicketIcon, CouponIcon, CalendarIcon } from "@/components/AppIcons";
import FlipText from "@/components/FlipText";

const APP_STORE_URL = "https://apps.apple.com/de/app/moos-park/id6739537470";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=de.moospark.clubscale&pcampaignid=web_share";

const BENEFITS = [
  { label: "Tickets kaufen", icon: TicketIcon },
  { label: "Coupons einlösen", icon: CouponIcon },
  { label: "Tisch reservieren", icon: CalendarIcon },
];

export default function AppDownloadCta({
  className = "",
}: {
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-xl bg-accent-lime p-6 text-center transition-transform hover:scale-[1.02] ${className}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-accent-lime transition-transform group-hover:scale-110">
          <TicketIcon />
        </div>
        <p className="font-black uppercase leading-tight text-black">
          Dein Bild ist nicht dabei?
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2 text-xs font-black uppercase tracking-wide text-accent-lime">
          <FlipText text="Jetzt App laden →" />
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-background p-6 sm:p-8"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-black uppercase leading-tight text-foreground">
                Alle Bilder gibt&apos;s in der App.
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Schließen"
                className="text-foreground/40 hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {BENEFITS.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 text-center text-foreground"
                >
                  <Icon />
                  <span className="text-[11px] font-bold uppercase leading-tight tracking-wide">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-90 transition-opacity hover:opacity-100"
              >
                <Image
                  src="/images/appstore.png"
                  alt="App Store"
                  width={140}
                  height={38}
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
                  width={140}
                  height={40}
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
