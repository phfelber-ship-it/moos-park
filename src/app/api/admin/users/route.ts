import { NextResponse } from "next/server";
import { getUsers, saveUsers, hashPassword } from "@/lib/admin-users";

export async function POST(request: Request) {
  const { username, password } = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const trimmed = username?.trim();
  if (!trimmed || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Benutzername und ein Passwort mit mindestens 8 Zeichen angeben." },
      { status: 400 }
    );
  }

  const users = await getUsers();
  if (
    trimmed === process.env.ADMIN_USERNAME ||
    users.some((u) => u.username === trimmed)
  ) {
    return NextResponse.json(
      { error: "Benutzername bereits vergeben." },
      { status: 409 }
    );
  }

  const { salt, hash } = hashPassword(password);
  users.push({ username: trimmed, salt, hash });
  await saveUsers(users);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { username } = (await request.json()) as { username?: string };
  if (!username) {
    return NextResponse.json({ error: "Kein Benutzername angegeben." }, { status: 400 });
  }

  const users = await getUsers();
  await saveUsers(users.filter((u) => u.username !== username));

  return NextResponse.json({ ok: true });
}
