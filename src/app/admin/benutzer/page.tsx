import { getUsers } from "@/lib/admin-users";
import UsersManager from "@/components/UsersManager";

export const dynamic = "force-dynamic";

export default async function BenutzerAdminPage() {
  const users = await getUsers();

  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Benutzer verwalten
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Zusaetzliche Zugaenge fuers Admin-Panel. Der Haupt-Zugang aus den
        Vercel-Umgebungsvariablen bleibt immer zusaetzlich gueltig und ist
        hier nicht auflistbar.
      </p>
      <UsersManager initialUsers={users.map((u) => u.username)} />
    </div>
  );
}
