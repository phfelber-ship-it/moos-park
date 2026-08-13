import { list, put } from "@vercel/blob";
import { STATIC_ROUTES } from "@/app/sitemap";
import { getEvents, getGalleries } from "@/lib/clubscale";
import { getAllBlogSlugs } from "@/lib/blog-posts";

const RESULT_PATH = "admin/seo-audit.json";

export type SeoSeverity = "error" | "warning" | "info";

export type SeoIssue = {
  severity: SeoSeverity;
  category: "Struktur" | "Text" | "Bausteine" | "Technisch";
  message: string;
};

export type PageAuditResult = {
  path: string;
  url: string;
  status: number | null;
  ok: boolean;
  loadTimeMs: number | null;
  title: string | null;
  descriptionMeta: string | null;
  h1Count: number;
  h1Text: string | null;
  h2Count: number;
  h3Count: number;
  wordCount: number;
  paragraphCount: number;
  longParagraphCount: number;
  hasList: boolean;
  hasBold: boolean;
  hasNav: boolean;
  hasFooter: boolean;
  imageCount: number;
  imagesMissingAlt: number;
  hasCanonical: boolean;
  hasOgTags: boolean;
  hasStructuredData: boolean;
  hasViewport: boolean;
  htmlLang: string | null;
  issues: SeoIssue[];
};

export type SeoAuditResult = {
  runAt: string;
  siteOrigin: string;
  pages: PageAuditResult[];
  summary: {
    pagesChecked: number;
    errors: number;
    warnings: number;
    infos: number;
    score: number;
  };
  duplicateTitles: string[][];
  duplicateDescriptions: string[][];
  robotsOk: boolean;
  sitemapOk: boolean;
};

// Seiten, die geprueft werden: alle statischen Routen aus der Sitemap plus
// je ein Beispiel fuer die dynamischen Seitentypen (Event, Galerie, jeder
// Blogartikel) - so ist jede im Code vorkommende Seitenvorlage mindestens
// einmal abgedeckt, ohne bei hunderten Events/Galerien jedes einzelne
// Exemplar abzuklappern.
async function getPagesToCheck(): Promise<string[]> {
  const paths = [...STATIC_ROUTES];

  try {
    const [events, galleries] = await Promise.all([
      getEvents(),
      getGalleries(),
    ]);
    if (events[0]) paths.push(`/eventdetails?id=${events[0].id}`);
    if (galleries[0]) paths.push(`/galerie/${galleries[0].id}`);
  } catch {
    // Clubscale nicht erreichbar - Rest der Pruefung soll trotzdem laufen.
  }

  for (const slug of getAllBlogSlugs()) {
    paths.push(`/blog/${slug}`);
  }

  return Array.from(new Set(paths));
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&[a-z]+;|&#\d+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countTag(html: string, tag: string): number {
  const matches = html.match(new RegExp(`<${tag}[\\s>]`, "gi"));
  return matches ? matches.length : 0;
}

function extractFirst(html: string, regex: RegExp): string | null {
  const m = html.match(regex);
  return m ? m[1].trim() : null;
}

async function auditPage(origin: string, path: string): Promise<PageAuditResult> {
  const url = `${origin}${path}`;
  const issues: SeoIssue[] = [];
  const started = Date.now();

  let status: number | null = null;
  let html = "";
  try {
    const res = await fetch(url, { cache: "no-store" });
    status = res.status;
    html = await res.text();
  } catch {
    status = null;
  }
  const loadTimeMs = Date.now() - started;
  const ok = status !== null && status >= 200 && status < 400;

  if (!ok) {
    issues.push({
      severity: "error",
      category: "Technisch",
      message: status
        ? `Seite antwortet mit Status ${status} statt 200.`
        : "Seite konnte nicht geladen werden.",
    });
  }

  const title = extractFirst(html, /<title[^>]*>([^<]*)<\/title>/i);
  const descriptionMeta =
    extractFirst(
      html,
      /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
    ) ??
    extractFirst(
      html,
      /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i
    );

  const h1Count = countTag(html, "h1");
  const h1Text = extractFirst(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h2Count = countTag(html, "h2");
  const h3Count = countTag(html, "h3");

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyText = stripTags(bodyMatch ? bodyMatch[1] : html);
  const wordCount = bodyText.length === 0 ? 0 : bodyText.split(" ").filter(Boolean).length;

  const paragraphs = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) =>
    stripTags(m[1])
  );
  const paragraphCount = paragraphs.length;
  const longParagraphCount = paragraphs.filter(
    (p) => (p.match(/[.!?]/g) ?? []).length > 4
  ).length;

  const hasList = /<ul[\s>]|<ol[\s>]/i.test(html);
  const hasBold = /<strong[\s>]|<b[\s>]/i.test(html);
  const hasNav = /<nav[\s>]|role=["']navigation["']/i.test(html);
  const hasFooter = /<footer[\s>]/i.test(html);

  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const imageCount = imgTags.length;
  const imagesMissingAlt = imgTags.filter(
    (tag) => !/alt=["'][^"']*["']/i.test(tag)
  ).length;

  const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const hasOgTags = /<meta[^>]+property=["']og:title["']/i.test(html);
  const hasStructuredData = /<script[^>]+type=["']application\/ld\+json["']/i.test(
    html
  );
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const htmlLang = extractFirst(html, /<html[^>]+lang=["']([^"']+)["']/i);

  // 1. Grundstruktur
  if (h1Count === 0) {
    issues.push({ severity: "error", category: "Struktur", message: "Keine H1-Überschrift gefunden." });
  } else if (h1Count > 1) {
    issues.push({
      severity: "error",
      category: "Struktur",
      message: `${h1Count} H1-Überschriften gefunden - es sollte genau eine sein.`,
    });
  }
  if (h2Count === 0 && ok) {
    issues.push({
      severity: "warning",
      category: "Struktur",
      message: "Keine H2-Überschriften - Seite ist nicht in Abschnitte gegliedert.",
    });
  }
  if (h3Count > 0 && h2Count === 0) {
    issues.push({
      severity: "info",
      category: "Struktur",
      message: "H3-Überschriften ohne übergeordnete H2 - Hierarchie prüfen.",
    });
  }

  // 2. Text und Inhalt
  if (ok && wordCount > 0 && wordCount < 300) {
    issues.push({
      severity: "warning",
      category: "Text",
      message: `Wenig Text (${wordCount} Wörter) - dünner Content wird von Google seltener gut platziert.`,
    });
  }
  if (longParagraphCount > 0) {
    issues.push({
      severity: "info",
      category: "Text",
      message: `${longParagraphCount} Absatz/Absätze länger als 3-4 Sätze - für Überfliegbarkeit kürzen.`,
    });
  }
  if (!hasList && wordCount > 300) {
    issues.push({
      severity: "info",
      category: "Text",
      message: "Keine Aufzählung (Liste) auf der Seite - Listen machen wichtige Punkte schneller erfassbar.",
    });
  }
  if (!hasBold && wordCount > 300) {
    issues.push({
      severity: "info",
      category: "Text",
      message: "Keine hervorgehobenen (fetten) Begriffe - erschwert das Überfliegen des Texts.",
    });
  }

  // 3. Wichtige Bausteine
  if (!hasNav) {
    issues.push({ severity: "warning", category: "Bausteine", message: "Keine Navigation gefunden." });
  }
  if (!hasFooter) {
    issues.push({ severity: "warning", category: "Bausteine", message: "Kein Footer gefunden." });
  }
  if (imageCount > 0 && imagesMissingAlt > 0) {
    issues.push({
      severity: "warning",
      category: "Bausteine",
      message: `${imagesMissingAlt} von ${imageCount} Bildern ohne Alt-Text.`,
    });
  }

  // 4. Technisches SEO (fuer bessere Google-Platzierung)
  if (!title) {
    issues.push({ severity: "error", category: "Technisch", message: "Kein <title> vorhanden." });
  } else if (title.length < 30 || title.length > 65) {
    issues.push({
      severity: "warning",
      category: "Technisch",
      message: `Title-Tag-Länge ${title.length} Zeichen (ideal ca. 30-65).`,
    });
  }
  if (!descriptionMeta) {
    issues.push({ severity: "error", category: "Technisch", message: "Keine Meta-Description vorhanden." });
  } else if (descriptionMeta.length < 70 || descriptionMeta.length > 160) {
    issues.push({
      severity: "warning",
      category: "Technisch",
      message: `Meta-Description-Länge ${descriptionMeta.length} Zeichen (ideal ca. 70-160).`,
    });
  }
  if (!hasCanonical) {
    issues.push({
      severity: "warning",
      category: "Technisch",
      message: "Kein Canonical-Link - Risiko für doppelten Content in Googles Augen.",
    });
  }
  if (!hasOgTags) {
    issues.push({
      severity: "info",
      category: "Technisch",
      message: "Keine Open-Graph-Tags - Vorschau beim Teilen (WhatsApp, Facebook, ...) wirkt generisch.",
    });
  }
  if (!hasStructuredData) {
    issues.push({
      severity: "info",
      category: "Technisch",
      message: "Keine strukturierten Daten (JSON-LD) - Google zeigt dadurch keine Rich-Snippets an.",
    });
  }
  if (!hasViewport) {
    issues.push({
      severity: "error",
      category: "Technisch",
      message: "Kein Viewport-Meta-Tag - Seite ist auf dem Handy nicht mobilfreundlich, das ist ein harter Google-Rankingfaktor.",
    });
  }
  if (!htmlLang) {
    issues.push({
      severity: "warning",
      category: "Technisch",
      message: "Kein lang-Attribut auf <html> - erschwert Google die Sprachzuordnung.",
    });
  }
  if (ok && loadTimeMs > 2500) {
    issues.push({
      severity: "warning",
      category: "Technisch",
      message: `Langsame Antwortzeit (${loadTimeMs}ms) - Ladezeit ist ein Google-Rankingfaktor.`,
    });
  }

  return {
    path,
    url,
    status,
    ok,
    loadTimeMs,
    title,
    descriptionMeta,
    h1Count,
    h1Text,
    h2Count,
    h3Count,
    wordCount,
    paragraphCount,
    longParagraphCount,
    hasList,
    hasBold,
    hasNav,
    hasFooter,
    imageCount,
    imagesMissingAlt,
    hasCanonical,
    hasOgTags,
    hasStructuredData,
    hasViewport,
    htmlLang,
    issues,
  };
}

async function checkUrlOk(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

function findDuplicates(
  pages: PageAuditResult[],
  pick: (p: PageAuditResult) => string | null
): string[][] {
  const groups = new Map<string, string[]>();
  for (const p of pages) {
    const value = pick(p);
    if (!value) continue;
    const list = groups.get(value) ?? [];
    list.push(p.path);
    groups.set(value, list);
  }
  return [...groups.values()].filter((g) => g.length > 1);
}

// Begrenzte Parallelitaet statt alle Seiten gleichzeitig - schont den
// eigenen Server und bleibt innerhalb des Funktions-Timeouts.
async function auditPagesWithConcurrency(
  origin: string,
  paths: string[],
  concurrency = 4
): Promise<PageAuditResult[]> {
  const results: PageAuditResult[] = new Array(paths.length);
  let next = 0;
  async function worker() {
    while (next < paths.length) {
      const i = next++;
      results[i] = await auditPage(origin, paths[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, paths.length) }, worker));
  return results;
}

export async function runSeoAudit(siteOrigin: string): Promise<SeoAuditResult> {
  const paths = await getPagesToCheck();
  const pages = await auditPagesWithConcurrency(siteOrigin, paths);

  const [robotsOk, sitemapOk] = await Promise.all([
    checkUrlOk(`${siteOrigin}/robots.txt`),
    checkUrlOk(`${siteOrigin}/sitemap.xml`),
  ]);

  const duplicateTitles = findDuplicates(pages, (p) => p.title);
  const duplicateDescriptions = findDuplicates(pages, (p) => p.descriptionMeta);

  if (duplicateTitles.length > 0) {
    for (const group of duplicateTitles) {
      for (const path of group) {
        const page = pages.find((p) => p.path === path);
        page?.issues.push({
          severity: "warning",
          category: "Technisch",
          message: `Title-Tag ist identisch mit ${group.length - 1} anderen Seite(n) (${group
            .filter((p) => p !== path)
            .join(", ")}).`,
        });
      }
    }
  }
  if (duplicateDescriptions.length > 0) {
    for (const group of duplicateDescriptions) {
      for (const path of group) {
        const page = pages.find((p) => p.path === path);
        page?.issues.push({
          severity: "warning",
          category: "Technisch",
          message: `Meta-Description ist identisch mit ${group.length - 1} anderen Seite(n) (${group
            .filter((p) => p !== path)
            .join(", ")}).`,
        });
      }
    }
  }

  let errors = 0;
  let warnings = 0;
  let infos = 0;
  for (const page of pages) {
    for (const issue of page.issues) {
      if (issue.severity === "error") errors++;
      else if (issue.severity === "warning") warnings++;
      else infos++;
    }
  }
  if (!robotsOk) errors++;
  if (!sitemapOk) errors++;

  const score = Math.max(
    0,
    Math.round(100 - errors * 4 - warnings * 1.5 - infos * 0.5)
  );

  return {
    runAt: new Date().toISOString(),
    siteOrigin,
    pages,
    summary: {
      pagesChecked: pages.length,
      errors,
      warnings,
      infos,
      score,
    },
    duplicateTitles,
    duplicateDescriptions,
    robotsOk,
    sitemapOk,
  };
}

export async function getLastSeoAuditResult(): Promise<SeoAuditResult | null> {
  try {
    const { blobs } = await list({ prefix: RESULT_PATH });
    const match = blobs.find((b) => b.pathname === RESULT_PATH);
    if (!match) return null;
    // Cache-Buster, da der Blob-Link trotz Ueberschreiben lange am
    // CDN-Edge gecacht wird (siehe banner-stats.ts fuer den Hintergrund).
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as SeoAuditResult;
  } catch {
    return null;
  }
}

export async function saveSeoAuditResult(result: SeoAuditResult): Promise<void> {
  await put(RESULT_PATH, JSON.stringify(result), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}
