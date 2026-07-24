import PurchaseConfirmation from "@/components/PurchaseConfirmation";

export const metadata = {
  title: "Bestätigung - moos.park Tickets",
};

export default async function TicketsConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ prid?: string; secret?: string }>;
}) {
  const { prid, secret } = await searchParams;

  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      {prid && secret ? (
        <PurchaseConfirmation purchaseRequestId={prid} secret={secret} />
      ) : (
        <p className="text-sm text-red-500">Ungültiger Bestätigungslink.</p>
      )}
    </div>
  );
}
