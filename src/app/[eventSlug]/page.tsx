import { notFound } from "next/navigation";
import { getCompanyEventBySlug } from "@/lib/company-events";
import CompanyEventLandingPage from "@/components/CompanyEventLandingPage";
import CompanyEventOfflinePage from "@/components/CompanyEventOfflinePage";

export const dynamic = "force-dynamic";

// Next.js loest statische/explizite Top-Level-Routen IMMER vor dynamischen
// Segmenten auf (siehe node_modules/next/dist/docs/01-app/03-api-reference/
// 03-file-conventions/dynamic-routes.md) - bestehende Seiten wie
// /firmenevents, /impressum etc. sind daher nicht in Gefahr, von dieser
// Route "verdeckt" zu werden. Neue Event-Slugs werden zusaetzlich beim
// Anlegen gegen genau diese Liste geprueft (siehe
// lib/company-events-routes.ts).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const event = await getCompanyEventBySlug(eventSlug);
  if (!event) return {};
  if (event.status !== "AKTIV") {
    return { title: `${event.name} – moos.park Pöttmes`, robots: { index: false, follow: false } };
  }
  return {
    alternates: { canonical: `/${event.slug}` },
    title: `${event.name} – moos.park Pöttmes`,
    description: `${event.dateLabel}, ${event.timeLabel}: ${event.heroSubtitle || event.name} im ${event.locationName}.`,
  };
}

export default async function CompanyEventPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const event = await getCompanyEventBySlug(eventSlug);
  if (!event) notFound();
  if (event.status !== "AKTIV") return <CompanyEventOfflinePage eventName={event.name} />;

  return <CompanyEventLandingPage event={event} />;
}
