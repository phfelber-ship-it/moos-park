export type InboxLogInput = {
  type:
    | "kontakt"
    | "eventlocation"
    | "veranstaltung"
    | "promoter"
    | "bewerbung"
    | "reservierung";
  name: string;
  email: string;
  phone?: string;
  summary?: string;
  message?: string;
};

// Best-effort: legt eine Kopie der Einsendung im Adminpanel-Postfach ab.
// Schlaegt bewusst leise fehl - der eigentliche Versand an Clubscale ist
// davon unabhaengig und darf dadurch nie blockiert werden.
export function logInbox(entry: InboxLogInput): void {
  fetch("/api/inbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  }).catch(() => {});
}
