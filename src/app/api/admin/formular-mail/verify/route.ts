import { NextResponse } from "next/server";
import { verifySmtpConnection } from "@/lib/smtp-mailer";

// "Verbindung testen"-Button im Adminpanel - Auth ueber src/proxy.ts.
export async function POST() {
  const result = await verifySmtpConnection();
  return NextResponse.json(result);
}
