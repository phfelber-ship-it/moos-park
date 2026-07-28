import type { MetadataRoute } from "next";
import { getEvents, getGalleries } from "@/lib/clubscale";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://moos-park-hmd7.vercel.app";

const STATIC_ROUTES = [
  "",
  "/events",
  "/tickets",
  "/tanzveranstaltungen",
  "/geburtstag",
  "/eventlocation",
  "/galerie",
  "/jobs",
  "/faq",
  "/kontakt",
  "/reservierung",
  "/firmenevents",
  "/eventlocation-mieten",
  "/eventlocation-augsburg",
  "/eventlocation-bayern",
  "/eventlocation-ingolstadt",
  "/eventlocation-region",
  "/veranstaltungsanfrage",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, galleries] = await Promise.all([
    getEvents(),
    getGalleries(),
  ]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

  const eventEntries = events.map((event) => ({
    url: `${SITE_URL}/eventdetails?id=${event.id}`,
    lastModified: new Date(),
  }));

  const galleryEntries = galleries.map((gallery) => ({
    url: `${SITE_URL}/galerie/${gallery.id}`,
    lastModified: new Date(gallery.date),
  }));

  return [...staticEntries, ...eventEntries, ...galleryEntries];
}
