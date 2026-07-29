import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import GoogleTagManager from "@/components/GoogleTagManager";
import FacebookPixel from "@/components/FacebookPixel";

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
    icon: "/api/favicon",
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
        <FacebookPixel />
      </body>
    </html>
  );
}
