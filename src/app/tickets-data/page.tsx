import TicketsDataFlow from "@/components/TicketsDataFlow";

export const metadata = {
  title: "Deine Daten - moos.park Tickets",
};

export default async function TicketsDataPage({
  searchParams,
}: {
  searchParams: Promise<{ eventId?: string; items?: string }>;
}) {
  const { eventId, items } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      <TicketsDataFlow eventId={eventId ?? ""} itemsParam={items ?? "[]"} />
    </div>
  );
}
