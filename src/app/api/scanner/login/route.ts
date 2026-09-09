import { NextResponse } from "next/server";
import {
  SCANNER_COOKIE,
  createScannerSessionToken,
  verifyScannerCredentials,
} from "@/lib/scanner-session";

// Eigener, leichtgewichtiger Login fuer das Tuer-Scanner-Tool - getrennt
// vom Adminpanel-Login (siehe api/admin/login), damit Einlasspersonal
// keinen vollen Adminzugang braucht.
export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (
    !username ||
    !password ||
    !verifyScannerCredentials(username, password)
  ) {
    return NextResponse.json(
      { error: "Falscher Benutzername oder falsches Passwort." },
      { status: 401 }
    );
  }

  const token = await createScannerSessionToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SCANNER_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 16,
  });
  return res;
}
