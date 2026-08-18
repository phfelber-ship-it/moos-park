import { getCompaniesWithLeads } from "@/lib/companies";
import FirmenManager from "@/components/FirmenManager";

export const dynamic = "force-dynamic";

export default async function FirmenAdminPage() {
  let companies: Awaited<ReturnType<typeof getCompaniesWithLeads>> = [];
  let loadError = false;
  try {
    companies = await getCompaniesWithLeads();
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Firmen
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Firmenanfragen von /firmenevents – nach Lead Score sortiert. Klick auf
        eine Firma zeigt alle eingegangenen Anfragen.
      </p>
      {loadError ? (
        <p className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          Firmen konnten nicht geladen werden – Supabase ist evtl. noch nicht
          konfiguriert (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).
        </p>
      ) : (
        <FirmenManager initialCompanies={companies} />
      )}
    </div>
  );
}
