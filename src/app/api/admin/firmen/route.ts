import { NextResponse } from "next/server";
import { getCompaniesWithLeads, updateCompanyStatus } from "@/lib/companies";

// Geschuetzt durch src/proxy.ts (Matcher /api/admin/:path*) - kein
// zusaetzlicher Auth-Check hier noetig, analog zu den bestehenden
// Admin-API-Routen (z.B. /api/admin/dance-events).
export async function GET() {
  try {
    const companies = await getCompaniesWithLeads();
    return NextResponse.json({ companies });
  } catch (err) {
    console.error("Firmen konnten nicht geladen werden:", err);
    return NextResponse.json(
      { error: "Firmen konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { id?: string; status?: string }
    | null;
  if (!body?.id || !body.status) {
    return NextResponse.json(
      { error: "id und status sind Pflichtfelder." },
      { status: 400 }
    );
  }

  try {
    await updateCompanyStatus(body.id, body.status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Status konnte nicht aktualisiert werden:", err);
    return NextResponse.json(
      { error: "Status konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}
