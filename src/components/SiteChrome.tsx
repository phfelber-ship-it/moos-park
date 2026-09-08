"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import CookieConsent from "@/components/CookieConsent";

// Reine Landingpages (z.B. /event-experience) laufen bewusst ohne Header,
// Footer und WhatsApp-Button - keine Navigation, die vom Anmeldeformular
// ablenkt oder von der Seite wegfuehrt. Cookie-Banner bleibt aus rechtlichen
// Gruenden ueberall bestehen.
const CHROMELESS_PREFIXES = ["/event-experience"];

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const chromeless = CHROMELESS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`)
  );

  if (chromeless) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <CookieConsent />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsAppButton />
      <CookieConsent />
    </>
  );
}
