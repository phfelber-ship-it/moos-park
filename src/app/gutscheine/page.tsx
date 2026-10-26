import { getGiftCardTemplates } from "@/lib/clubscale";
import GutscheinShop from "@/components/GutscheinShop";

export const metadata = {
  alternates: { canonical: "/gutscheine" },
  title: "Gutscheine verschenken - moos.park",
  description:
    "moos.park Gutschein verschenken: Motiv und Betrag wählen, online bezahlen, per E-Mail erhalten. Einlösbar im Online-Ticketshop.",
};

export default async function GutscheinePage() {
  const templates = await getGiftCardTemplates();

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <h1 className="text-center text-4xl font-black uppercase text-foreground">
        Gutscheine
      </h1>
      <p className="mx-auto mt-3 max-w-md text-center text-foreground/60">
        Verschenk Partyfreude: Motiv wählen, Betrag wählen, per E-Mail erhalten.
      </p>
      <GutscheinShop templates={templates} />
    </div>
  );
}
