import { getCompanyContacts } from "@/lib/company-contacts";
import CompanyContactsManager from "@/components/CompanyContactsManager";

export const dynamic = "force-dynamic";

export default async function CompanyContactsAdminPage() {
  const contacts = await getCompanyContacts();

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Firmenkontakte
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Zentrale Firmenkunden-Datenbank, unabhängig von einzelnen
        Veranstaltungen wie THE EVENT EXPERIENCE – nutzbar für beliebige
        künftige Einladungen und Aktionen.
      </p>
      <div className="mt-8">
        <CompanyContactsManager initialContacts={contacts} />
      </div>
    </div>
  );
}
