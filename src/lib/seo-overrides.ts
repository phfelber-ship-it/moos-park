import { list, put } from "@vercel/blob";

const SETTINGS_PATH = "admin/seo-settings.json";

// Einstellungen, die das SEO-Tool (/admin/seo-tool) zur Laufzeit umschalten
// kann, ohne dass dafuer Code geaendert/deployed werden muss - bewusst nur
// fuer rein technische, inhaltlich risikofreie Punkte (siehe Review-Dialog
// im SEO-Tool). Inhaltliche/strukturelle Themen (Ueberschriften, Alt-Texte,
// Textlaenge, ...) laufen weiterhin ueber echte Code-Aenderungen mit
// Vorschau.
export type SeoSettings = {
  structuredDataEnabled: boolean;
};

const DEFAULT_SETTINGS: SeoSettings = {
  structuredDataEnabled: false,
};

// WICHTIG: bewusst NICHT im Root-Layout/einer Seite selbst aufrufen - ein
// Blob-Request dort haengt bei diesem Projekt (getestet) zuverlaessig jede
// eigentlich statische Seite beim Build fest (60s-Timeout pro Seite, da
// Next.js/Turbopack den Build-Worker dafuer nicht rechtzeitig freibekommt).
// Stattdessen laeuft das ueber die oeffentliche Route /api/seo-settings,
// die ein kleiner Client-Component (StructuredDataInjector) im Browser
// aufruft - komplett entkoppelt vom Seiten-Rendering/Static-Build.
export async function getSeoSettings(): Promise<SeoSettings> {
  try {
    const { blobs } = await list({ prefix: SETTINGS_PATH });
    const match = blobs.find((b) => b.pathname === SETTINGS_PATH);
    if (!match) return DEFAULT_SETTINGS;
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = (await res.json()) as Partial<SeoSettings>;
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSeoSettings(settings: SeoSettings): Promise<void> {
  await put(SETTINGS_PATH, JSON.stringify(settings), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
