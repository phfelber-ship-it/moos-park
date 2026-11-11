import { getGiftCardTemplates } from "@/lib/clubscale";
import GutscheinCheckout from "@/components/GutscheinCheckout";

export const metadata = {
  title: "Deine Daten - moos.park Gutscheine",
  robots: { index: false },
};

export default async function GutscheinKassePage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string }>;
}) {
  const { items } = await searchParams;
  const templates = await getGiftCardTemplates();

  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-32">
      <GutscheinCheckout itemsParam={items ?? "[]"} templates={templates} />
    </div>
  );
}
