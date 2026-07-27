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
    ],
  },
  async redirects() {
    // URL-Struktur der alten moos-park.de weicht an einigen Stellen ab -
    // ohne diese Redirects verlieren die Seiten beim Umzug ihr SEO-Ranking
    // und Nutzer mit alten Lesezeichen/Google-Treffern landen auf 404.
    return [
      { source: "/tickets", destination: "/eventtickets", permanent: true },
      { source: "/tickets-uebersicht", destination: "/eventtickets", permanent: true },
      { source: "/eventdetails", destination: "/events", permanent: true },
      { source: "/tanzveranstaltungen", destination: "/tanzabend", permanent: true },
      { source: "/galerie", destination: "/bilder", permanent: true },
    ];
  },
};

export default nextConfig;
