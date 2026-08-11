import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    // URL-Struktur der alten moos-park.de weicht an einigen Stellen ab -
    // ohne diese Redirects verlieren die Seiten beim Umzug ihr SEO-Ranking
    // und Nutzer mit alten Lesezeichen/Google-Treffern landen auf 404.
    return [
      { source: "/tickets-uebersicht", destination: "/tickets", permanent: true },
      { source: "/tickets-checkout", destination: "/tickets", permanent: true },
      { source: "/purchase-checkout", destination: "/tickets", permanent: true },
      { source: "/purchase", destination: "/tickets", permanent: true },
      { source: "/purchase/", destination: "/tickets", permanent: true },
      { source: "/eventtickets", destination: "/tickets", permanent: true },
      { source: "/bilder", destination: "/galerie", permanent: true },
      { source: "/bilder/:id", destination: "/galerie/:id", permanent: true },
      { source: "/gallery", destination: "/galerie", permanent: true },
      // Alte Galerie-Links mit Query-Parameter (?id=...) statt Pfad -
      // Google hat diese als eigenstaendige Duplikate der echten
      // /galerie/:id-Seite indexiert.
      {
        source: "/galerie",
        has: [{ type: "query", key: "id", value: "(?<id>.*)" }],
        destination: "/galerie/:id",
        permanent: true,
      },
      { source: "/bewerbung", destination: "/jobs", permanent: true },
      { source: "/bewerbung/", destination: "/jobs", permanent: true },
      { source: "/events/:id", destination: "/eventdetails?id=:id", permanent: true },
      // Google hat einige eventdetails-Links noch mit abschliessendem
      // Slash indexiert (alte URL-Struktur) - ohne diesen Redirect 404en
      // die trotz vorhandenem Ziel (?id= wird automatisch durchgereicht).
      { source: "/eventdetails/", destination: "/eventdetails", permanent: true },
    ];
  },
};

export default nextConfig;
