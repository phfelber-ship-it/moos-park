import type { MetadataRoute } from "next";

// Solange wir noch nicht live sind, soll die Vorschau-URL nicht indexiert
// werden - sonst gibt's beim echten Go-Live doppelten Content in Google.
// Vor dem Go-Live: NEXT_PUBLIC_LIVE=true setzen, dann wird normal freigegeben.
const IS_LIVE = process.env.NEXT_PUBLIC_LIVE === "true";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

export default function robots(): MetadataRoute.Robots {
  if (!IS_LIVE) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
