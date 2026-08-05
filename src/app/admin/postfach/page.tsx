import { getInboxEntries } from "@/lib/inbox";
import InboxManager from "@/components/InboxManager";

export const dynamic = "force-dynamic";

export default async function PostfachAdminPage() {
  const entries = await getInboxEntries();

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Postfach
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Kontaktanfragen, Eventlocation- und Veranstaltungsanfragen,
        Promoter-Bewerbungen, Jobbewerbungen und Tischreservierungen - alle
        an einem Ort. Der eigentliche Versand geht weiterhin direkt an
        info@moos-park.de, hier liegt zusätzlich eine Kopie.
      </p>
      <InboxManager initialEntries={entries} />
    </div>
  );
}
