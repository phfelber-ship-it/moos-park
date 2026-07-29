import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Falsches Passwort." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", password, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
