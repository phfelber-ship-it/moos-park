import { NextResponse } from "next/server";
import { getUsers, verifyPassword } from "@/lib/admin-users";
import { createSessionToken } from "@/lib/session";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { error: "Falscher Benutzername oder falsches Passwort." },
      { status: 401 }
    );
  }

  const isBootstrapAdmin =
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD;

  let valid = isBootstrapAdmin;
  if (!valid) {
    const users = await getUsers();
    const match = users.find((u) => u.username === username);
    if (match && verifyPassword(password, match.salt, match.hash)) {
      valid = true;
    }
  }

  if (!valid) {
    return NextResponse.json(
      { error: "Falscher Benutzername oder falsches Passwort." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
