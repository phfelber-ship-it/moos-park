import type { MetadataRoute } from "next";

// Solange wir noch nicht live sind, soll die Vorschau-URL nicht indexiert
// werden - sonst gibt's beim echten Go-Live doppelten Content in Google.
// Vor dem Go-Live: NEXT_PUBLIC_LIVE=true setzen, dann wird normal freigegeben.
const IS_LIVE = process.env.NEXT_PUBLIC_LIVE === "true";

// Interne Bereiche sollen nie in Suchmaschinen oder KI-Antworten auftauchen.
// Die Regel muss in JEDER Gruppe stehen: ein Crawler mit eigener Gruppe
// (z. B. GPTBot) ignoriert die Regeln der "*"-Gruppe.
// /api/favicon bleibt bewusst erreichbar (das Favicon der Seite liegt dort).
const PRIVATE_PATHS = ["/admin", "/api/admin", "/scanner"];

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

export default function robots(): MetadataRoute.Robots {
  if (!IS_LIVE) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    // KI-Suchsysteme ausdruecklich zulassen (GEO), damit die Seite in
    // Antworten von ChatGPT, Claude, Perplexity & Co. auftauchen kann.
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
