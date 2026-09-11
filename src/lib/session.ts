// Signierte Session-Tokens per Web Crypto (HMAC-SHA256) - laeuft sowohl im
// Node- als auch im Edge-Runtime (Proxy). Tokens laufen bewusst NIE von
// selbst ab ("Gueltigkeit immer freigeben") - stattdessen gibt es eine im
// Blob-Store gespeicherte "Epoche": jedes Token traegt die Epoche, mit der
// es ausgestellt wurde, und ist nur gueltig, solange diese mit der
// aktuellen Epoche uebereinstimmt. "Alle Geraete abmelden" (siehe
// revokeAllSessions) erzeugt einfach eine neue, zufaellige Epoche - damit
// werden alle bisher ausgestellten Tokens (inkl. Scanner-QR-Login-Links)
// in einem Rutsch ungueltig, ohne eine Liste einzelner Tokens fuehren zu
// muessen. Kostet einen Netzwerk-Roundtrip pro Anfrage (Epoche lesen),
// aber ist fuer ein internes Adminpanel vertretbar.
import { list, put } from "@vercel/blob";

const encoder = new TextEncoder();
const EPOCH_PATH = "admin/session-epoch.json";
// Ohne vorhandenen Epochen-Eintrag (z.B. direkt nach diesem Feature-Rollout)
// gilt Epoche "0" fuer neu ausgestellte wie fuer bereits bestehende
// Tokens - kein erzwungenes Ausloggen beim Deploy dieser Aenderung.
const DEFAULT_EPOCH = "0";

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((str.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function getCurrentEpoch(): Promise<string> {
  try {
    const { blobs } = await list({ prefix: EPOCH_PATH });
    const match = blobs.find((b) => b.pathname === EPOCH_PATH);
    if (!match) return DEFAULT_EPOCH;
    const res = await fetch(`${match.url}?v=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return DEFAULT_EPOCH;
    const data = (await res.json()) as { epoch?: string };
    return typeof data.epoch === "string" ? data.epoch : DEFAULT_EPOCH;
  } catch {
    return DEFAULT_EPOCH;
  }
}

// "Alle Geraete abmelden" - macht jedes bisher ausgestellte Session-Token
// (Adminpanel-Login wie Scanner-QR-Login) auf einen Schlag ungueltig,
// inklusive der Session, aus der dieser Aufruf selbst kommt.
export async function revokeAllSessions(): Promise<void> {
  const epoch = crypto.randomUUID();
  await put(EPOCH_PATH, JSON.stringify({ epoch }), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function createSessionToken(username: string): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const epoch = await getCurrentEpoch();
  const payload = JSON.stringify({ u: username, epoch });
  const payloadB64 = base64url(encoder.encode(payload));
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${base64url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  const secret = process.env.ADMIN_PASSWORD ?? "";
  const key = await getKey(secret);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64urlToBytes(sigB64) as BufferSource,
    encoder.encode(payloadB64) as BufferSource
  );
  if (!valid) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlToBytes(payloadB64))
    ) as { u: string; epoch?: string };
    const currentEpoch = await getCurrentEpoch();
    if ((payload.epoch ?? DEFAULT_EPOCH) !== currentEpoch) {
      return null;
    }
    return payload.u;
  } catch {
    return null;
  }
}
