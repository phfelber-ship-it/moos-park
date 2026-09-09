import { cookies } from "next/headers";
import { SCANNER_COOKIE, verifyScannerSessionToken } from "@/lib/scanner-session";
import ScannerLogin from "@/components/ScannerLogin";
import ScannerApp from "@/components/ScannerApp";

export const dynamic = "force-dynamic";

// Mobile Einlasskontrolle fuer Tuerpersonal - eigener, sehr einfacher
// Login (siehe lib/scanner-session.ts), getrennt vom Adminpanel. Die
// eventId aus der URL bestimmt, gegen welches Firmenevent die gescannten
// Codes geprueft werden (mehrere Events koennen parallel laufen).
export default async function ScannerPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = (await cookies()).get(SCANNER_COOKIE)?.value;
  const scannerUser = await verifyScannerSessionToken(session);

  if (!scannerUser) {
    return <ScannerLogin eventId={eventId} />;
  }

  return <ScannerApp eventId={eventId} />;
}
