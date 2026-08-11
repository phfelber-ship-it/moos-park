import type { MetadataRoute } from "next";
import { getEvents, getGalleries } from "@/lib/clubscale";
import { getAllBlogSlugs } from "@/lib/blog-posts";

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
  "/aufsichtsformular",
  "/kontakt",
  "/reservierung",
  "/firmenevents",
  "/eventlocation-mieten",
  "/eventlocation-augsburg",
  "/eventlocation-bayern",
  "/eventlocation-ingolstadt",
  "/eventlocation-region",
  "/veranstaltungsanfrage",
  "/app",
  "/promoter",
  "/erleben",
  "/blog",
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

  const blogEntries = getAllBlogSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticEntries,
    ...eventEntries,
    ...galleryEntries,
    ...blogEntries,
  ];
}
