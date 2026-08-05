import { getAiInsights } from "@/lib/ai-insights";
import AiInsightsManager from "@/components/AiInsightsManager";

export const dynamic = "force-dynamic";

export default async function KiAssistentPage() {
  const insights = await getAiInsights();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        KI-Assistent
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Analysiert täglich automatisch GA4, Google Search Console und den
        Ticket-Verkaufsstand der anstehenden Events und gibt priorisierte
        Handlungsempfehlungen, um mehr Tickets zu verkaufen, mehr
        Tischreservierungen abzuschließen und mehr App-Downloads zu
        generieren.
      </p>
      <AiInsightsManager initialInsights={insights} />
    </div>
  );
}
