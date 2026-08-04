// Signierte Session-Tokens per Web Crypto (HMAC-SHA256) - laeuft sowohl im
// Node- als auch im Edge-Runtime (Proxy), da wir bewusst kein Node-only
// "crypto"-Modul hier verwenden. Der Proxy kann das Token so ohne
// Netzwerk-Zugriff auf den Blob-Store pruefen.

const encoder = new TextEncoder();
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 Tage

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

export async function createSessionToken(username: string): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  const payload = JSON.stringify({
    u: username,
    exp: Date.now() + SESSION_TTL_MS,
  });
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
    ) as { u: string; exp: number };
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
      return null;
    }
    return payload.u;
  } catch {
    return null;
  }
}
