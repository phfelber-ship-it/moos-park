import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";
import CookieConsent from "@/components/CookieConsent";
import GoogleTagManager from "@/components/GoogleTagManager";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "moos.park Pöttmes – Eventlocation Bayern | Firmenfeiern, Partys & mehr",
  description:
    "moos.park in Pöttmes – deine Eventlocation in Aichach-Friedberg. Konzerte, Clubnächte, Firmenfeiern und Partys in modernem Design und exklusivem Ambiente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsAppButton />
        <CookieConsent />
        <GoogleTagManager />
      </body>
    </html>
  );
}
