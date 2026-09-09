import { list, put } from "@vercel/blob";

// Woechentlicher automatischer Check aller öffentlichen Formulare der Webseite:
// Seite laedt + Formular ist da + (wo sicher moeglich) Backend akzeptiert
// eine echte Testeinreichung. Ergebnis wird in Vercel Blob gespeichert und
// bei Fehlern per Mail an ph.felber@moos-park.de und s.geisler@moos-park.de
// gemeldet (siehe api/cron/form-health-check/route.ts).
//
// WICHTIG: Health-Checks duerfen NIE einen sichtbaren Fake-Eintrag im
// Postfach/Firmen/Firmenkontakte/Firmenevents-CRM hinterlassen, den
// Mitarbeitende faelschlich bearbeiten koennten. Deshalb wird pro Formular
// bewusst die "sicherste ausreichende" Methode gewaehlt, siehe Kommentare
// je CHECK unten.

const RESULT_PATH = "admin/form-health-check.json";
const TEST_MARKER = "___SYSTEMTEST___";

export type FormCheckKind = "submission" | "page-load";

export type FormCheckResult = {
  name: string;
  pageUrl: string;
  kind: FormCheckKind;
  ok: boolean;
  message: string;
  checkedAt: string;
  durationMs: number;
};

type CheckDef = {
  name: string;
  pageUrl: string;
  kind: FormCheckKind;
  run: (origin: string) => Promise<{ ok: boolean; message: string }>;
};

// --- Hilfsfunktionen -------------------------------------------------

// Vercel-Preview-Deployments sind standardmaessig durch "Deployment
// Protection" geschuetzt (Vercel Authentication) - ohne diesen Bypass
// bekaeme der Formular-Check bei jedem Selbstaufruf ein 401 "Protected
// deployment" statt der echten Antwort. Der Bypass gilt NUR fuer unsere
// eigenen automatisierten Checks, der Schutz fuer alle anderen Besucher
// bleibt bestehen. Secret liegt in Vercel -> Project Settings ->
// Deployment Protection -> Protection Bypass for Automation.
function bypassHeaders(): Record<string, string> {
  const secret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  return secret ? { "x-vercel-protection-bypass": secret } : {};
}

async function checkPageHasForm(
  origin: string,
  path: string,
  formHint: RegExp
): Promise<{ ok: boolean; message: string }> {
  const res = await fetch(`${origin}${path}`, {
    cache: "no-store",
    headers: bypassHeaders(),
  });
  if (!res.ok) {
    return { ok: false, message: `Seite antwortet mit Status ${res.status}.` };
  }
  const html = await res.text();
  if (!formHint.test(html)) {
    return {
      ok: false,
      message: "Seite laedt, aber erwartetes Formular-Markup wurde nicht gefunden.",
    };
  }
  return { ok: true, message: "Seite laedt (200) und Formular ist vorhanden." };
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...bypassHeaders() },
    body: JSON.stringify(body),
  });
  // Rohtext IMMER mitlesen (nicht nur versuchtes JSON-Parsing) - falls die
  // Antwort z.B. von einer vorgelagerten Ebene (Vercel-Protection, Proxy)
  // statt von unserer eigenen Route kommt, ist es meist gar kein JSON. Ohne
  // den Rohtext sehen wir im Fehlerfall nur "[object Object]" und koennen
  // die eigentliche Ursache nicht diagnostizieren.
  const rawText = await res.text();
  let data: unknown = null;
  try {
    data = JSON.parse(rawText);
  } catch {
    data = null;
  }
  return { res, data, rawText };
}

// Extrahiert eine lesbare Fehlermeldung aus einer API-Antwort, egal ob sie
// wie erwartet { error: "..." } ist, ein anderes JSON-Objekt (z.B. von einer
// vorgelagerten Ebene) oder gar kein JSON (HTML-Fehlerseite o.ae.).
function extractErrorMessage(data: unknown, rawText: string): string {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as { error?: unknown }).error;
    if (typeof err === "string") return err;
    if (err) return JSON.stringify(err);
  }
  if (rawText.trim()) {
    // Rohtext kuerzen, damit die Fehlermeldung nicht ausufert (z.B. bei
    // einer kompletten HTML-Fehlerseite).
    return rawText.trim().slice(0, 300);
  }
  return "unbekannter Fehler (leere Antwort)";
}

// --- Formular-Inventar -------------------------------------------------
//
// Vollstaendiges Inventar aller oeffentlichen Formulare (recherchiert per
// Grep nach `<form`, `fetch(` mit POST und Submit-Handlern innerhalb von
// src/app + src/components):
//
// 1. Kontaktformular (/kontakt, ContactForm.tsx)
// 2. Reservierung (/reservierung, ReservationWizard.tsx)
// 3. Jobs/Bewerbung (/jobs, JobApplicationAccordion.tsx)
// 4. Veranstaltungsanfrage (/veranstaltungsanfrage, EventRequestForm.tsx)
// 5. Firmenevent-Anfrage (/firmenevents, CompanyEventRequestForm.tsx ->
//    /api/firmenanfrage) - eigenes Backend, siehe CHECK (a) unten.
// 6. Event-Experience-Anmeldung (/event-experience, EventExperienceForm.tsx
//    -> /api/event-experience/register) - eigenes Backend, ebenfalls (a).
//    Die neuen generischen /[eventSlug]-Landingpages (company-events.ts)
//    nutzen dieselbe Komponente/Route mit anderer eventId, werden also durch
//    denselben Check mitabgedeckt.
// 7. Promoter-Bewerbung (/promoter, PromoterApplicationForm.tsx) - sendet wie
//    1-4 direkt an die externe Clubscale-API, daher page-load-Fallback (b).
//
// NICHT als Formular gezaehlt (kein echtes Absenden von Nutzerdaten):
// - /kontakt: Telefon/E-Mail sind mailto:/tel:-Links, kein Formular fuer die.
// - /qrcodewerbung, /qrcodewerbung_v1, /r/[code]: reine
//   Redirect-/Tracking-Landingpages ohne <form>, kein POST irgendwohin.
// - /tickets, /tickets-data: Ticketkauf laeuft ueber Stripe/Clubscale-Direkt-
//   Checkout-Widgets, kein eigenes Formular-Backend zum Testen.
// - /aufsichtsformular: internes PDF/Formular fuer Aufsichtspersonal, kein
//   oeffentlich beworbenes Lead-Formular.
//
// CHECK-TYP PRO FORMULAR:
// (a) ECHTE Testeinreichung (submission) nur fuer Formulare 5+6: die gehen
//     an UNSER eigenes Backend (createCompanyRequest / addRegistration),
//     das wir per `isHealthCheck: true` so erweitert haben, dass die
//     komplette Validierung normal durchlaeuft, aber am Ende NICHT
//     gespeichert wird und KEINE Mail an echte Adressen geht - siehe
//     "Health-Check-Sonderfall" in den jeweiligen route.ts. Damit ist
//     ausgeschlossen, dass ein Test-Lead im Firmen-/Event-Experience-CRM
//     auftaucht.
// (b) FALLBACK page-load fuer Formulare 1-4: die senden direkt an die
//     externe Clubscale-API (moospark.clubscale.com) - ein fremdes,
//     drittes System, auf das wir keinen "isHealthCheck"-Sonderfall
//     aufsetzen koennen. Eine echte Testeinreichung dort wuerde einen
//     echten Lead/eine echte Reservierung/Bewerbung im externen CRM
//     hinterlassen, den niemand automatisch wieder loeschen kann - zu
//     riskant. Deshalb hier bewusst nur der sichere Smoke-Test: Seite laedt
//     (200) und das erwartete Formular-Markup ist vorhanden.

const CHECKS: CheckDef[] = [
  {
    name: "Kontaktformular",
    pageUrl: "/kontakt",
    kind: "page-load",
    run: (origin) => checkPageHasForm(origin, "/kontakt", /placeholder="Nachricht"/i),
  },
  {
    name: "Reservierung",
    pageUrl: "/reservierung",
    kind: "page-load",
    run: (origin) => checkPageHasForm(origin, "/reservierung", /reservier/i),
  },
  {
    name: "Jobs / Bewerbung",
    pageUrl: "/jobs",
    kind: "page-load",
    run: (origin) => checkPageHasForm(origin, "/jobs", /bewerb/i),
  },
  {
    name: "Veranstaltungsanfrage",
    pageUrl: "/veranstaltungsanfrage",
    kind: "page-load",
    run: (origin) => checkPageHasForm(origin, "/veranstaltungsanfrage", /anfrage|nachricht/i),
  },
  {
    name: "Promoter-Bewerbung",
    pageUrl: "/promoter",
    kind: "page-load",
    run: (origin) => checkPageHasForm(origin, "/promoter", /Follower-Anzahl/i),
  },
  {
    name: "Firmenevent-Anfrage",
    pageUrl: "/firmenevents",
    kind: "submission",
    run: async (origin) => {
      const { res, data, rawText } = await postJson(`${origin}/api/firmenanfrage`, {
        company: `${TEST_MARKER} GmbH`,
        contactName: TEST_MARKER,
        email: "healthcheck@moos-park.de",
        phone: "0000000000",
        eventType: "Health-Check",
        guestCount: 10,
        consent: true,
        isHealthCheck: true,
      });
      if (!res.ok || (data as { error?: unknown } | null)?.error) {
        return {
          ok: false,
          message: `POST /api/firmenanfrage fehlgeschlagen (Status ${res.status}): ${extractErrorMessage(
            data,
            rawText
          )}`,
        };
      }
      return { ok: true, message: "Testeinreichung an /api/firmenanfrage wurde akzeptiert." };
    },
  },
  {
    name: "Event-Experience-Anmeldung",
    pageUrl: "/event-experience",
    kind: "submission",
    run: async (origin) => {
      const { res, data, rawText } = await postJson(`${origin}/api/event-experience/register`, {
        company: `${TEST_MARKER} GmbH`,
        salutation: "Divers",
        lastName: TEST_MARKER,
        firstName: TEST_MARKER,
        email: "healthcheck@moos-park.de",
        phone: "0000000000",
        message: "",
        consent: true,
        companions: [],
        isHealthCheck: true,
      });
      if (!res.ok || (data as { error?: unknown } | null)?.error) {
        return {
          ok: false,
          message: `POST /api/event-experience/register fehlgeschlagen (Status ${res.status}): ${extractErrorMessage(
            data,
            rawText
          )}`,
        };
      }
      return {
        ok: true,
        message: "Testeinreichung an /api/event-experience/register wurde akzeptiert.",
      };
    },
  },
];

export type FormHealthCheckReport = {
  runAt: string;
  results: FormCheckResult[];
  allOk: boolean;
};

export async function runFormHealthChecks(origin: string): Promise<FormHealthCheckReport> {
  const results: FormCheckResult[] = [];

  for (const check of CHECKS) {
    const start = Date.now();
    let ok = false;
    let message = "";
    try {
      const outcome = await check.run(origin);
      ok = outcome.ok;
      message = outcome.message;
    } catch (err) {
      ok = false;
      message = err instanceof Error ? err.message : String(err);
    }
    results.push({
      name: check.name,
      pageUrl: check.pageUrl,
      kind: check.kind,
      ok,
      message,
      checkedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    });
  }

  return {
    runAt: new Date().toISOString(),
    results,
    allOk: results.every((r) => r.ok),
  };
}

// --- Speichern/Lesen des letzten Ergebnisses in Vercel Blob -------------
// Gleiches Muster wie lib/seo-audit.ts: kleine JSON-Datei, oeffentlich
// lesbar, mit allowOverwrite. Kein BLOB_READ_WRITE_TOKEN im Sandbox/Dev-
// Setup vorhanden -> beide Funktionen fangen das per try/catch ab, sodass
// z.B. `npm run build` und lokale Entwicklung ohne Blob-Zugriff nicht
// brechen (gleiches Verhalten wie getLastSeoAuditResult()).
export async function getLastFormHealthCheckResult(): Promise<FormHealthCheckReport | null> {
  try {
    const { blobs } = await list({ prefix: RESULT_PATH });
    const match = blobs.find((b) => b.pathname === RESULT_PATH);
    if (!match) return null;
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as FormHealthCheckReport;
  } catch {
    return null;
  }
}

export async function saveFormHealthCheckResult(report: FormHealthCheckReport): Promise<void> {
  await put(RESULT_PATH, JSON.stringify(report), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
