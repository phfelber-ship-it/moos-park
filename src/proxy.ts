import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Einfacher Benutzername/Passwort-Schutz fuer den internen Admin-Bereich -
// kein Nutzerkonzept auf dieser Seite, daher bewusst ein einzelnes
// geteiltes Login-Paar statt eines vollen Auth-Systems.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;
  const expected = `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`;
  if (session && session === expected) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
