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
      { source: "/tickets-uebersicht", destination: "/tickets", permanent: true },
      { source: "/tickets-checkout", destination: "/tickets", permanent: true },
      { source: "/purchase-checkout", destination: "/tickets", permanent: true },
      { source: "/eventtickets", destination: "/tickets", permanent: true },
      { source: "/bilder", destination: "/galerie", permanent: true },
      { source: "/bilder/:id", destination: "/galerie/:id", permanent: true },
      { source: "/events/:id", destination: "/eventdetails?id=:id", permanent: true },
    ];
  },
};

export default nextConfig;
