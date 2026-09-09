import { redirect } from "next/navigation";
import { LEGACY_EVENT_ID } from "@/lib/company-events";

// /admin/event-experience ist jetzt Teil der generischen Firmenevents-CRM-
// Verwaltung - Redirect statt Loeschen, damit bestehende Lesezeichen/Links
// weiterhin funktionieren (siehe AGENTS-Vorgabe).
export default function EventExperienceAdminRedirect() {
  redirect(`/admin/firmenevents/${LEGACY_EVENT_ID}`);
}
