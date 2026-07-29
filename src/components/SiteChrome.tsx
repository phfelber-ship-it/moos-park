import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import CookieConsent from "@/components/CookieConsent";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
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
