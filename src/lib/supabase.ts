import { createClient } from "@supabase/supabase-js";

// Firmen-CRM (Firmen, Leads, Veranstaltungen, Aktivitaeten, Aufgaben) liegt
// in einem eigenen "moospark"-Schema in einem bestehenden Supabase-Projekt
// (geteilt mit anderen Produkten, daher eigenes Schema statt "public").
// Zugriff ausschliesslich serverseitig ueber den Service-Role-Key - RLS auf
// allen Tabellen bleibt geschlossen, es gibt keine Client-seitige Nutzung.
// Admin-Routen sind zusaetzlich durch den bestehenden Session-Proxy
// geschuetzt (siehe src/proxy.ts).
// Kein generiertes Database-Typing fuer dieses (geteilte, bestehende)
// Supabase-Projekt vorhanden - Tabellenzugriffe sind daher bewusst lose
// typisiert (any) und die Rueckgabetypen in lib/companies.ts sind die
// eigentliche Typsicherheit fuer den Rest der App.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSupabaseAdmin(): any {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase ist nicht konfiguriert (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY fehlen)."
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached: any = null;

export function supabaseAdmin() {
  if (!cached) cached = getSupabaseAdmin();
  return cached.schema("moospark");
}
