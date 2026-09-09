import { notFound } from "next/navigation";
import { getCompanyEventBySlug } from "@/lib/company-events";
import CompanyEventConfirmationPage from "@/components/CompanyEventConfirmationPage";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function CompanyEventBestaetigungPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  const { eventSlug } = await params;
  const event = await getCompanyEventBySlug(eventSlug);
  if (!event) notFound();

  return <CompanyEventConfirmationPage event={event} />;
}
