import Link from "next/link";
import { getGa4Data, getGa4Overview, type Ga4Row } from "@/lib/ga4";
import { getSearchConsoleQueries } from "@/lib/search-console";
import { resolveDateRange, type RangeKey } from "@/lib/date-range";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import TrendBadge from "@/components/TrendBadge";

export const dynamic = "force-dynamic";

const TRAFFIC_SOURCE_EXPLANATIONS = [
  {
    name: "Direct",
    text: "Adresse direkt eingetippt oder aus Lesezeichen/App geöffnet - z. B. jemand tippt moos-park.de direkt ein.",
  },
  {
    name: "Organic Search",
    text: "Über die unbezahlten Suchergebnisse einer Suchmaschine - z. B. Google-Suche nach „Eventlocation Pöttmes“.",
  },
  {
    name: "Referral",
    text: "Über einen Link auf einer anderen Website - z. B. ein Blog oder Verzeichnis verlinkt auf moos-park.de.",
  },
  {
    name: "Organic Social",
    text: "Über einen unbezahlten Beitrag/Link in sozialen Netzwerken - z. B. Instagram-Bio-Link oder ein Facebook-Post.",
  },
  {
    name: "Paid Search",
    text: "Über eine bezahlte Suchanzeige - z. B. eine Google-Ads-Anzeige.",
  },
  {
    name: "Paid Social",
    text: "Über eine bezahlte Anzeige in sozialen Netzwerken - z. B. eine beworbene Instagram-/Facebook-Anzeige.",
  },
  {
    name: "Email",
    text: "Über einen Link in einer E-Mail - z. B. ein Newsletter.",
  },
  {
    name: "Unassigned",
    text: "Konnte keiner Quelle zugeordnet werden - meist technisch bedingt (z. B. fehlende Tracking-Parameter).",
  },
];

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "today", label: "Tag" },
  { key: "7d", label: "Woche" },
  { key: "30d", label: "Monat" },
  { key: "all", label: "Gesamt" },
];

function allNotSet(rows: Ga4Row[]): boolean {
  return rows.every((r) => r.label === "(not set)");
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

function StatCard({
  label,
  value,
  current,
  previous,
  invert,
}: {
  label: string;
  value: string;
  current?: number;
  previous?: number | null;
  invert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-black text-foreground">{value}</p>
        {current !== undefined && (
          <TrendBadge
            current={current}
            previous={previous ?? null}
            invert={invert}
          />
        )}
      </div>
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

export default async function StatistikPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const dateRange = resolveDateRange(params.range, params.from, params.to);

  const [data, searchConsole, prevOverview] = await Promise.all([
    getGa4Data(dateRange.startDate, dateRange.endDate),
    getSearchConsoleQueries(dateRange.startDate, dateRange.endDate),
    dateRange.prevStartDate && dateRange.prevEndDate
      ? getGa4Overview(dateRange.prevStartDate, dateRange.prevEndDate)
      : Promise.resolve(null),
  ]);

  const rangeLinkHref = (key: RangeKey) => `/admin/statistik?range=${key}`;

  const FilterBar = (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {RANGE_OPTIONS.map((o) => (
        <Link
          key={o.key}
          href={rangeLinkHref(o.key)}
          className={`rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors ${
            dateRange.key === o.key
              ? "bg-accent-lime text-black"
              : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
          }`}
        >
          {o.label}
        </Link>
      ))}
      <form
        method="get"
        className="flex items-center gap-2 rounded-lg bg-foreground/5 px-3 py-1.5"
      >
        <input type="hidden" name="range" value="custom" />
        <input
          type="date"
          name="from"
          defaultValue={dateRange.key === "custom" ? dateRange.startDate : undefined}
          className="bg-transparent text-xs text-foreground outline-none"
        />
        <span className="text-xs text-foreground/40">–</span>
        <input
          type="date"
          name="to"
          defaultValue={dateRange.key === "custom" ? dateRange.endDate : undefined}
          className="bg-transparent text-xs text-foreground outline-none"
        />
        <button
          type="submit"
          className={`rounded px-3 py-1 text-xs font-black uppercase tracking-wide ${
            dateRange.key === "custom"
              ? "bg-accent-lime text-black"
              : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Los
        </button>
      </form>
    </div>
  );

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
        {dateRange.label}, aus Google Analytics 4.
        {prevOverview && " Pfeile zeigen den Vergleich zum vorherigen Zeitraum gleicher Länge."}
      </p>

      {FilterBar}

      {overview && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Nutzer"
            value={String(overview.activeUsers)}
            current={overview.activeUsers}
            previous={prevOverview?.activeUsers}
          />
          <StatCard
            label="Seitenaufrufe"
            value={String(overview.screenPageViews)}
            current={overview.screenPageViews}
            previous={prevOverview?.screenPageViews}
          />
          <StatCard
            label="Sitzungen"
            value={String(overview.sessions)}
            current={overview.sessions}
            previous={prevOverview?.sessions}
          />
          <StatCard
            label="Absprungrate"
            value={`${(overview.bounceRate * 100).toFixed(1)}%`}
            current={overview.bounceRate}
            previous={prevOverview?.bounceRate}
            invert
          />
          <StatCard
            label="Ø Sitzungsdauer"
            value={formatDuration(overview.averageSessionDuration)}
            current={overview.averageSessionDuration}
            previous={prevOverview?.averageSessionDuration}
          />
        </div>
      )}

      {overview && overview.screenPageViews === 0 && overview.sessions > 0 && (
        <p className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-foreground/70">
          Sitzungen werden gezählt, aber 0 Seitenaufrufe - das deutet auf ein
          GTM-Konfigurationsproblem hin: prüfe im Google Tag Manager, ob das
          GA4-Konfigurations-Tag &bdquo;Seitenaufruf beim Laden senden&ldquo;
          aktiviert hat, bzw. in GA4 unter Verwaltung → Datenstreams → dein
          Web-Stream → Erweiterte Messung, dass &bdquo;Seitenaufrufe&ldquo;
          eingeschaltet ist.
        </p>
      )}

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Verlauf
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Sitzungen pro Tag im gewählten Zeitraum.
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
        <dl className="mt-5 grid gap-3 text-xs text-foreground/60 sm:grid-cols-2">
          {TRAFFIC_SOURCE_EXPLANATIONS.map((s) => (
            <div key={s.name}>
              <dt className="font-bold text-foreground/80">{s.name}</dt>
              <dd>{s.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Meistbesuchte Seiten
        </h2>
        {data.topPages.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/50">
            Noch keine Daten. Bei einer frisch eingerichteten GA4-Property
            dauert es teils 24-48h, bis Google diese Detail-Auswertung
            (im Unterschied zu den Kennzahlen oben) fertig verarbeitet hat -
            bitte in ein bis zwei Tagen nochmal reinschauen.
          </p>
        ) : (
          <div className="mt-4">
            <BarChart rows={data.topPages} />
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Einstiegsseiten
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Auf welcher Seite Besucher ihre Sitzung starten.
        </p>
        {data.landingPages.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/50">
            Noch keine Daten fuer diesen Zeitraum.
          </p>
        ) : allNotSet(data.landingPages) ? (
          <p className="mt-3 text-sm text-foreground/50">
            GA4 hat noch keine Seiten zuordnen koennen (zeigt nur
            &bdquo;(not set)&ldquo;) - bei einer frisch eingerichteten
            Property normal, das loest sich meist nach 24-48h von selbst.
          </p>
        ) : (
          <div className="mt-4">
            <BarChart rows={data.landingPages} />
          </div>
        )}
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
          Sitzungen je Uhrzeit (0-23 Uhr), im gewählten Zeitraum summiert.
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
          Geräte
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Von welchem Gerätetyp die Besucher kommen.
        </p>
        <div className="mt-4">
          <BarChart rows={data.devices} categorical />
        </div>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Wie sich Besucher je Gerät bewegen
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Meistbesuchte Seiten getrennt nach Gerätetyp - ein echter
          Seite-zu-Seite-Pfad pro Sitzung ist über die GA4-Datenschnittstelle
          nicht abrufbar (nur direkt in GA4 unter{" "}
          <a
            href="https://analytics.google.com/analytics/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Erkunden → Pfadexploration
          </a>
          ), daher hier die Annäherung je Gerät.
        </p>
        <div className="mt-6 grid gap-8 sm:grid-cols-2">
          {Object.entries(data.topPagesByDevice).map(([device, rows]) => (
            <div key={device}>
              <h3 className="text-sm font-black uppercase tracking-wide text-foreground/70">
                {device}
              </h3>
              <div className="mt-3">
                <BarChart rows={rows} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-foreground/10 pt-8">
        <h2 className="text-lg font-black uppercase text-foreground">
          Keywords
        </h2>
        <p className="mt-2 text-xs text-foreground/50">
          Echte Suchbegriffe aus der Google Search Console (nicht GA4) -
          zeigt, wonach Leute bei Google gesucht haben, um auf die Seite zu
          kommen. Search Console hat eine eigene Verarbeitungsverzögerung von
          meist 2-3 Tagen.
        </p>
        {!searchConsole.configured ? (
          <p className="mt-3 text-sm text-foreground/50">
            SEARCH_CONSOLE_SITE_URL ist nicht gesetzt. Bitte in den
            Vercel-Umgebungsvariablen eintragen (die exakte URL, wie sie in
            der Search Console registriert ist).
          </p>
        ) : searchConsole.error ? (
          <p className="mt-3 text-sm text-red-500">
            Fehler beim Abruf: {searchConsole.error} - meist fehlt der
            Service-Account als Nutzer in der Search Console (Einstellungen →
            Nutzer und Berechtigungen).
          </p>
        ) : (
          <RowTable
            rows={searchConsole.queries}
            labelHeader="Suchbegriff"
            valueHeader="Klicks"
          />
        )}
      </div>
    </div>
  );
}
