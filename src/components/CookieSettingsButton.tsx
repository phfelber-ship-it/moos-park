"use client";

import { openCookieSettings } from "@/components/CookieConsent";

export default function CookieSettingsButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
