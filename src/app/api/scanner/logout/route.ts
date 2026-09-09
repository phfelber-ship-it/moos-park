import { NextResponse } from "next/server";
import { SCANNER_COOKIE } from "@/lib/scanner-session";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SCANNER_COOKIE);
  return res;
}
