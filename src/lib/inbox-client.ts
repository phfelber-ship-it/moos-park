export type InboxLogInput = {
  type:
    | "kontakt"
    | "eventlocation"
    | "veranstaltung"
    | "promoter"
    | "bewerbung"
    | "reservierung"
    | "eventexperience";
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  message?: string;
};

// Best-effort, "fire and forget": legt eine Kopie der Einsendung im
// Adminpanel-Postfach ab. Schlaegt bewusst leise fehl - fuer Formulare, bei
// denen Clubscale weiterhin die primaere Zustellung ist (Reservierung,
// Jobs), reicht das.
export function logInbox(entry: InboxLogInput): void {
  fetch("/api/inbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  }).catch(() => {});
}

// Wie logInbox(), aber der Aufrufer wartet auf das Ergebnis: fuer
// Formulare, bei denen das Postfach + die daran gekoppelte SMTP-Benach-
// richtigung (siehe api/inbox/route.ts) der GARANTIERTE Zustellweg sein
// soll, unabhaengig davon, ob der zusaetzliche Clubscale-Versand klappt
// (siehe z.B. ContactForm.tsx - Clubscale allein war zuletzt nicht
// zuverlaessig genug fuer den einzigen Zustellweg).
export async function logInboxAwaited(entry: InboxLogInput): Promise<boolean> {
  try {
    const res = await fetch("/api/inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch {
    return false;
  }
}
