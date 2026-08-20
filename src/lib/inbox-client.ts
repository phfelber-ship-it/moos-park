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
// Schlaegt bewusst leise fehl (kein Blockieren/Fehler fuer den Nutzer) -
// der eigentliche Versand an Clubscale ist davon unabhaengig. keepalive
// sorgt dafuer, dass der Request auch dann noch ankommt, wenn direkt danach
// die Seite gewechselt/geschlossen wird (z.B. weil der Erfolgs-Screen den
// Nutzer zu einem "Zurueck"-Klick verleitet).
export function logInbox(entry: InboxLogInput): void {
  fetch("/api/inbox", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
    keepalive: true,
  })
    .then((res) => {
      if (!res.ok) {
        console.error("Postfach-Kopie fehlgeschlagen:", res.status);
      }
    })
    .catch((err) => {
      console.error("Postfach-Kopie fehlgeschlagen:", err);
    });
}
