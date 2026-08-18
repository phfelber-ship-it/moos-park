import { supabaseAdmin } from "@/lib/supabase";

export type Company = {
  id: string;
  name: string;
  industry: string | null;
  street: string | null;
  zip: string | null;
  city: string | null;
  distance_km: number | null;
  employee_count: number | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  ceo_name: string | null;
  hr_contact_name: string | null;
  hr_contact_email: string | null;
  hr_contact_phone: string | null;
  source: string;
  status: string;
  priority: string | null;
  lead_score: number;
  lead_score_breakdown: { label: string; points: number }[];
  notes: string | null;
  last_contact_at: string | null;
  next_contact_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  company_id: string;
  contact_name: string;
  email: string;
  phone: string | null;
  event_type: string;
  guest_count: number | null;
  preferred_date: string | null;
  alternative_date: string | null;
  budget: string | null;
  requested_services: string | null;
  message: string | null;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CompanyRequestInput = {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  eventType: string;
  guestCount: number | null;
  preferredDate: string | null;
  alternativeDate: string | null;
  budget: string | null;
  requestedServices: string | null;
  message: string | null;
  website?: string | null;
};

// Phase 1: einfache, nachvollziehbare Bewertung nach Mitarbeiterzahl (aus
// dem Formular unbekannt, daher erstmal nur nach Guestcount/Quelle) - wird
// in Phase 2 um Branche/Entfernung/HR-Kontakt etc. erweitert, sobald diese
// Felder in der Firmendatenbank gepflegt sind.
function scoreForRequest(input: CompanyRequestInput): {
  score: number;
  breakdown: { label: string; points: number }[];
} {
  const breakdown: { label: string; points: number }[] = [];

  if (input.guestCount) {
    if (input.guestCount >= 500) breakdown.push({ label: "Große Gästezahl (500+)", points: 30 });
    else if (input.guestCount >= 100) breakdown.push({ label: "Mittlere Gästezahl (100+)", points: 20 });
    else breakdown.push({ label: "Gästezahl bekannt", points: 10 });
  }
  if (input.website) breakdown.push({ label: "Website angegeben", points: 10 });
  if (input.preferredDate) breakdown.push({ label: "Konkreter Wunschtermin", points: 15 });
  if (input.budget) breakdown.push({ label: "Budget angegeben", points: 15 });
  breakdown.push({ label: "Aktive Anfrage über Website", points: 20 });

  const score = Math.min(100, breakdown.reduce((sum, b) => sum + b.points, 0));
  return { score, breakdown };
}

// Findet eine bestehende Firma per Name oder Website (case-insensitive) -
// verhindert Dubletten, wenn dieselbe Firma mehrfach anfragt.
async function findExistingCompany(name: string, website?: string | null) {
  const db = supabaseAdmin();
  const orFilters = [`name.ilike.${escapeForOr(name)}`];
  if (website) orFilters.push(`website.ilike.${escapeForOr(website)}`);

  const { data, error } = await db
    .from("companies")
    .select("*")
    .or(orFilters.join(","))
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as Company | null;
}

function escapeForOr(value: string): string {
  return value.trim().replace(/[,()]/g, "");
}

// Legt aus einer Firmen-Anfrage vom Formular eine Firma (falls neu) und
// einen Lead an - erkennt Dubletten anhand des Firmennamens.
export async function createCompanyRequest(input: CompanyRequestInput) {
  const db = supabaseAdmin();
  const { score, breakdown } = scoreForRequest(input);

  let company = await findExistingCompany(input.company, input.website);

  if (!company) {
    const { data, error } = await db
      .from("companies")
      .insert({
        name: input.company.trim(),
        website: input.website?.trim() || null,
        email: input.email.trim(),
        phone: input.phone.trim(),
        hr_contact_name: input.contactName.trim(),
        hr_contact_email: input.email.trim(),
        hr_contact_phone: input.phone.trim(),
        source: "Website - Firmenfeier",
        status: "NEU",
        lead_score: score,
        lead_score_breakdown: breakdown,
      })
      .select("*")
      .single();
    if (error) throw error;
    company = data as Company;
  } else {
    const newScore = Math.min(100, company.lead_score + 10);
    const { data, error } = await db
      .from("companies")
      .update({
        lead_score: newScore,
        lead_score_breakdown: [
          ...company.lead_score_breakdown,
          { label: "Erneute Anfrage über Website", points: 10 },
        ],
        updated_at: new Date().toISOString(),
      })
      .eq("id", company.id)
      .select("*")
      .single();
    if (error) throw error;
    company = data as Company;
  }

  const { data: lead, error: leadError } = await db
    .from("leads")
    .insert({
      company_id: company.id,
      contact_name: input.contactName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      event_type: input.eventType,
      guest_count: input.guestCount,
      preferred_date: input.preferredDate,
      alternative_date: input.alternativeDate,
      budget: input.budget,
      requested_services: input.requestedServices,
      message: input.message,
      source: "Website - Firmenfeier",
      status: "NEU",
    })
    .select("*")
    .single();
  if (leadError) throw leadError;

  return { company, lead: lead as Lead };
}

export async function getCompaniesWithLeads(): Promise<
  (Company & { leads: Lead[] })[]
> {
  const db = supabaseAdmin();
  const { data: companies, error } = await db
    .from("companies")
    .select("*")
    .order("lead_score", { ascending: false });
  if (error) throw error;

  const { data: leads, error: leadsError } = await db
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (leadsError) throw leadsError;

  return (companies as Company[]).map((c) => ({
    ...c,
    leads: (leads as Lead[]).filter((l) => l.company_id === c.id),
  }));
}

export async function updateCompanyStatus(id: string, status: string) {
  const db = supabaseAdmin();
  const { error } = await db
    .from("companies")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
