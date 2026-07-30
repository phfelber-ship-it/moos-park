import { getGa4Data, type Ga4Row } from "@/lib/ga4";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";

export const dynamic = "force-dynamic";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-foreground/10 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-foreground">{value}</p>
    </div>
  );
}

function RowTable({
  rows,
  labelHeader,
  valueHeader,
  formatValue,
}: {
  rows: Ga4Row[];
  labelHeader: string;
  valueHeader: string;
  formatValue?: (v: number) => string;
}) {
  if (rows.length === 0) {
    return (
      <p className="mt-3 text-sm text-foreground/50">
        Noch keine Daten fuer diesen Zeitraum.
      </p>
    );
  }
  return (
    <table className="mt-3 w-full text-sm">
      <thead>
        <tr className="border-b border-foreground/10 text-left text-xs uppercase tracking-wide text-foreground/50">
          <th className="pb-2 font-bold">{labelHeader}</th>
          <th className="pb-2 text-right font-bold">{valueHeader}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-foreground/5">
            <td className="py-2 pr-4 text-foreground/80">{r.label}</td>
            <td className="py-2 text-right font-bold text-foreground">
              {formatValue ? formatValue(r.value) : r.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default async function StatistikPage() {
  const data = await getGa4Data();

  if (!data.configured) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <h1 className="text-2xl font-black uppercase text-foreground">
          Statistik
        </h1>
        <p className="mt-4 text-sm text-foreground/60">
          GA4_PROPERTY_ID und/oder GA4_SERVICE_ACCOUNT_KEY sind nicht
          gesetzt. Bitte in den Vercel-Umgebungsvariablen eintragen.
        </p>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
        <h1 className="text-2xl font-black uppercase text-foreground">
          Statistik
        </h1>
        <p className="mt-4 text-sm text-red-500">
          Fehler beim Abruf von GA4: {data.error}
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          Meist liegt es daran, dass das Service-Account noch nicht als
          Betrachter in der GA4-Property hinterlegt ist, oder GA4_PROPERTY_ID
          falsch ist.
        </p>
      </div>
    );
  }

  const { overview } = data;

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Statistik
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Letzte 30 Tage, aus Google Analytics 4.
      </p>

      {overview && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard label="Nutzer" value={String(overview.activeUsers)} />
          <StatCard
            label="Seitenaufrufe"
            value={String(overview.screenPageViews)}
          />
          <StatCard label="Sitzungen" value={String(overview.sessions)} />
          <StatCard
            label="Absprungrate"
            value={`${(overview.bounceRate * 100).toFixed(1)}%`}
          />
          <StatCard
            label="Ø Sitzungsdauer"
            value={formatDuration(overview.averageSessionDuration)}
          />
        </div>
      )}

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Verlauf
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Sitzungen pro Tag, letzte 30 Tage.
        </p>
        <div className="mt-4">
          <LineChart data={data.sessionsByDay} />
        </div>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Traffic-Quelle
        </h2>
        <div className="mt-4">
          <BarChart rows={data.trafficSources} categorical />
        </div>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Meistbesuchte Seiten
        </h2>
        <div className="mt-4">
          <BarChart rows={data.topPages} />
        </div>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Wo Leute absprangen
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Absprungrate je Seite - eine hohe Rate zeigt, wo Besucher die Seite
          verlassen haben, ohne weiterzuklicken.
        </p>
        <div className="mt-4">
          <BarChart rows={data.bounceByPage} format="percent" />
        </div>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Wann Leute da waren
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Sitzungen je Uhrzeit (0-23 Uhr), ueber die letzten 30 Tage
          summiert.
        </p>
        <div className="mt-4">
          <BarChart
            rows={data.sessionsByHour.map((r) => ({
              ...r,
              label: `${r.label} Uhr`,
            }))}
          />
        </div>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Keywords
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Moderne Suchmaschinen geben den Suchbegriff aus Datenschutzgruenden
          fast nie mehr weiter - hier steht bei organischem Traffic
          erwartungsgemaess meist &bdquo;(not set)&ldquo;. Nur bei bezahlten
          Google-Ads-Kampagnen mit Keyword-Tracking ist das zuverlaessig.
        </p>
        <RowTable
          rows={data.keywords}
          labelHeader="Keyword"
          valueHeader="Sitzungen"
        />
      </div>
    </div>
  );
}
