"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MinimalFooter from "@/components/MinimalFooter";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import CookieConsent from "@/components/CookieConsent";

// Reine Landingpages (z.B. /event-experience) laufen bewusst ohne Header
// und WhatsApp-Button - keine Navigation, die vom Anmeldeformular ablenkt
// oder von der Seite wegfuehrt. Statt des vollen Footers gibt es dort nur
// den schlanken MinimalFooter (Logo, Impressum, Datenschutz). Cookie-Banner
// bleibt ueberall bestehen. /admin hat bereits seine eigene AdminTopBar
// (siehe app/admin/layout.tsx) - die oeffentliche Hauptnavigation braucht
// es dort nicht zusaetzlich.
const NO_HEADER_PREFIXES = ["/event-experience", "/admin"];

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noHeader = NO_HEADER_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`)
  );

  if (noHeader) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <MinimalFooter />
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
