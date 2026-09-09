import ScannerApp from "@/components/ScannerApp";

export const dynamic = "force-dynamic";

// Mobile Einlasskontrolle fuer Tuerpersonal - bewusst ohne eigenen Login
// (siehe Absprache: Geraet ist am Einlass physisch kontrolliert, ein
// Passwort war dort nur Reibung ohne echten Sicherheitsgewinn). Die
// eventId aus der URL bestimmt, gegen welches Firmenevent die gescannten
// Codes geprueft werden (mehrere Events koennen parallel laufen).
export default async function ScannerPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  return <ScannerApp eventId={eventId} />;
}
