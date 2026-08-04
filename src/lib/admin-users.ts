import crypto from "node:crypto";
import { list, put } from "@vercel/blob";

const USERS_PATH = "admin/users.json";

export type AdminUser = { username: string; salt: string; hash: string };

// Zusaetzliche Admin-Benutzer liegen als kleine JSON-Datei im Blob-Store,
// Passwoerter nie im Klartext - nur scrypt-Hash + Salt. Der urspruengliche
// Zugang aus ADMIN_USERNAME/ADMIN_PASSWORD (Vercel-Umgebungsvariablen)
// bleibt zusaetzlich immer als Haupt-Zugang gueltig (siehe /api/admin/login),
// damit man sich nie komplett aussperren kann.
export async function getUsers(): Promise<AdminUser[]> {
  try {
    const { blobs } = await list({ prefix: USERS_PATH });
    const match = blobs.find((b) => b.pathname === USERS_PATH);
    if (!match) return [];
    const res = await fetch(match.url, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as AdminUser[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function saveUsers(users: AdminUser[]): Promise<void> {
  await put(USERS_PATH, JSON.stringify(users), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

export function hashPassword(
  password: string,
  salt: string = crypto.randomBytes(16).toString("hex")
): { salt: string; hash: string } {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(
  password: string,
  salt: string,
  hash: string
): boolean {
  const candidate = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(hash, "hex");
  if (candidate.length !== stored.length) return false;
  return crypto.timingSafeEqual(candidate, stored);
}
