import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import GoogleTagManager from "@/components/GoogleTagManager";
import ClickTracker from "@/components/ClickTracker";
import StructuredDataInjector from "@/components/StructuredDataInjector";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    // Explizite Groesse (Vielfaches von 48px) + Typ, wie von Google fuer
    // Favicons in den Suchergebnissen verlangt:
    // https://developers.google.com/search/docs/appearance/favicon-in-search
    icon: { url: "/api/favicon", sizes: "144x144", type: "image/png" },
  },
  title:
    "moos.park Pöttmes – Eventlocation Bayern | Firmenfeiern, Partys & mehr",
  description:
    "moos.park in Pöttmes – deine Eventlocation in Aichach-Friedberg. Konzerte, Clubnächte, Firmenfeiern und Partys in modernem Design und exklusivem Ambiente.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "moos.park",
    title: "moos.park Pöttmes – Eventlocation Bayern",
    description:
      "Deine Eventlocation in Aichach-Friedberg: Konzerte, Clubnächte, Firmenfeiern und Partys.",
    images: [{ url: "/images/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
  },
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteChrome>{children}</SiteChrome>
        <GoogleTagManager />
        <ClickTracker />
        {/* Strukturierte Daten (JSON-LD) laufen bewusst client-seitig statt
            im Server-Rendering - ein Blob-Fetch im Layout/einer Seite
            haengt sonst zuverlaessig jede statische Seite beim Build fest
            (siehe lib/seo-overrides.ts). So kann das SEO-Tool
            (/admin/seo-tool) sie trotzdem per Knopfdruck umschalten. */}
        <StructuredDataInjector />
      </body>
    </html>
  );
}
