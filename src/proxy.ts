import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Einfacher Passwort-Schutz fuer den internen Admin-Bereich (Hero-Bilder-
// Verwaltung) - kein Nutzerkonzept auf dieser Seite, daher bewusst ein
// einzelnes geteiltes Passwort statt eines vollen Auth-Systems.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get("admin_session")?.value;
  if (session && session === process.env.ADMIN_PASSWORD) {
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
