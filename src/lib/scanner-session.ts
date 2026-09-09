// Eigenstaendiger, leichtgewichtiger Login fuer das Einlass-Scanner-Tool an
// der Tuer (Personal, nicht das eigentliche Adminpanel) - bewusst
// getrennt von lib/session.ts (ADMIN_USERNAME/ADMIN_PASSWORD), damit
// Tuerpersonal ein einfaches, separat vergebbares Zugangsdatenpaar
// (SCANNER_USERNAME/SCANNER_PASSWORD) bekommt, ohne vollen Adminzugang zu
// haben. Signierte Session-Tokens nach demselben Muster (HMAC-SHA256 per
// Web Crypto, laeuft in jeder Runtime ohne Node-"crypto").

const encoder = new TextEncoder();
const SESSION_TTL_MS = 1000 * 60 * 60 * 16; // 16h - reicht fuer eine Schicht am Einlass

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

function secret(): string {
  // Eigenes Secret, faellt auf ADMIN_PASSWORD zurueck, falls
  // SCANNER_PASSWORD (noch) nicht gesetzt ist.
  return process.env.SCANNER_PASSWORD ?? process.env.ADMIN_PASSWORD ?? "";
}

export async function createScannerSessionToken(username: string): Promise<string> {
  const payload = JSON.stringify({ u: username, exp: Date.now() + SESSION_TTL_MS });
  const payloadB64 = base64url(encoder.encode(payload));
  const key = await getKey(secret());
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${base64url(new Uint8Array(sig))}`;
}

export async function verifyScannerSessionToken(
  token: string | undefined
): Promise<string | null> {
  if (!token) return null;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  const key = await getKey(secret());
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
    ) as { u: string; exp: number };
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload.u;
  } catch {
    return null;
  }
}

export function verifyScannerCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.SCANNER_USERNAME ?? "";
  const expectedPass = process.env.SCANNER_PASSWORD ?? "";
  if (!expectedUser || !expectedPass) return false;
  return username === expectedUser && password === expectedPass;
}

export const SCANNER_COOKIE = "scanner_session";
