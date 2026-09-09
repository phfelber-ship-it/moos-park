import { PKPass } from "passkit-generator";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Ticket } from "@/lib/event-experience";
import {
  EVENT_ADDRESS,
  EVENT_DATE_LABEL,
  EVENT_LOCATION_NAME,
  EVENT_TIME_LABEL,
} from "@/lib/event-experience-info";

// Apple Wallet (.pkpass) - erfordert einen kostenpflichtigen Apple
// Developer Account + ein Pass-Type-ID-Zertifikat, das ihr selbst bei
// Apple erstellt. Drei Umgebungsvariablen sind noetig (jeweils Base64-
// kodierter Dateiinhalt):
//   APPLE_WALLET_WWDR_BASE64        - Apple WWDR Zwischenzertifikat
//                                      (https://www.apple.com/certificateauthority/)
//   APPLE_WALLET_SIGNER_CERT_BASE64 - euer Pass-Type-ID-Zertifikat (.pem)
//   APPLE_WALLET_SIGNER_KEY_BASE64  - der zugehoerige private Schluessel (.pem)
// Optional: APPLE_WALLET_SIGNER_KEY_PASSPHRASE, falls der Key verschluesselt ist.
// Zusaetzlich noetig:
//   APPLE_WALLET_TEAM_ID       - Team-ID aus dem Apple-Developer-Account
//   APPLE_WALLET_PASS_TYPE_ID  - die Pass-Type-Identifier, z.B.
//                                "pass.de.moos-park.eventexperience"
export function isAppleWalletConfigured(): boolean {
  return Boolean(
    process.env.APPLE_WALLET_WWDR_BASE64 &&
      process.env.APPLE_WALLET_SIGNER_CERT_BASE64 &&
      process.env.APPLE_WALLET_SIGNER_KEY_BASE64 &&
      process.env.APPLE_WALLET_TEAM_ID &&
      process.env.APPLE_WALLET_PASS_TYPE_ID
  );
}

async function loadWalletAssets(): Promise<Record<string, Buffer>> {
  const dir = path.join(process.cwd(), "src/assets/wallet");
  const files = [
    "icon.png",
    "icon@2x.png",
    "icon@3x.png",
    "logo.png",
    "logo@2x.png",
    "logo@3x.png",
  ];
  const entries = await Promise.all(
    files.map(async (f) => [f, await readFile(path.join(dir, f))] as const)
  );
  return Object.fromEntries(entries);
}

export async function generateAppleWalletPass(
  ticket: Ticket,
  company: string
): Promise<Buffer> {
  if (!isAppleWalletConfigured()) {
    throw new Error(
      "Apple Wallet ist noch nicht eingerichtet: APPLE_WALLET_* Umgebungsvariablen fehlen."
    );
  }

  const buffers = await loadWalletAssets();

  const pass = new PKPass(
    buffers,
    {
      wwdr: Buffer.from(process.env.APPLE_WALLET_WWDR_BASE64!, "base64"),
      signerCert: Buffer.from(process.env.APPLE_WALLET_SIGNER_CERT_BASE64!, "base64"),
      signerKey: Buffer.from(process.env.APPLE_WALLET_SIGNER_KEY_BASE64!, "base64"),
      signerKeyPassphrase: process.env.APPLE_WALLET_SIGNER_KEY_PASSPHRASE,
    },
    {
      serialNumber: ticket.code,
      description: "THE EVENT EXPERIENCE Ticket",
      organizationName: "moos.park",
      passTypeIdentifier: process.env.APPLE_WALLET_PASS_TYPE_ID!,
      teamIdentifier: process.env.APPLE_WALLET_TEAM_ID!,
      backgroundColor: "rgb(11,11,13)",
      foregroundColor: "rgb(242,242,242)",
      labelColor: "rgb(185,206,173)",
    }
  );

  pass.type = "eventTicket";
  pass.primaryFields.push({
    key: "event",
    label: "EVENT",
    value: "THE EVENT EXPERIENCE",
  });
  pass.secondaryFields.push(
    { key: "guest", label: "GAST", value: `${ticket.salutation} ${ticket.firstName} ${ticket.lastName}` },
    { key: "company", label: "UNTERNEHMEN", value: company }
  );
  pass.auxiliaryFields.push(
    { key: "date", label: "DATUM", value: EVENT_DATE_LABEL },
    { key: "time", label: "UHRZEIT", value: EVENT_TIME_LABEL }
  );
  pass.backFields.push(
    { key: "location", label: "Ort", value: `${EVENT_LOCATION_NAME}, ${EVENT_ADDRESS}` },
    { key: "code", label: "Ticket-Code", value: ticket.code }
  );

  pass.setBarcodes({
    message: ticket.code,
    format: "PKBarcodeFormatQR",
    messageEncoding: "iso-8859-1",
  });

  return pass.getAsBuffer();
}
