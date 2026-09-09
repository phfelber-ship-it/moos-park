import jwt from "jsonwebtoken";
import type { Ticket } from "@/lib/event-experience";
import {
  EVENT_ADDRESS,
  EVENT_DATE_LABEL,
  EVENT_LOCATION_NAME,
  EVENT_TIME_LABEL,
} from "@/lib/event-experience-info";

// Google Wallet - erfordert ein Google-Cloud-Projekt mit aktivierter
// Wallet-API, einen als "Issuer" freigeschalteten Account (Google Pay &
// Wallet Console, kostenlos aber mit Freischaltung durch Google) und einen
// Service-Account mit "Wallet Object Issuer"-Rolle. Drei Umgebungs-
// variablen sind noetig:
//   GOOGLE_WALLET_ISSUER_ID           - eure Issuer-ID aus der Wallet Console
//   GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL - E-Mail des Service-Accounts
//   GOOGLE_WALLET_PRIVATE_KEY         - privater Schluessel des Service-
//                                        Accounts (PEM, Zeilenumbrueche als \n)
export function isGoogleWalletConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_WALLET_ISSUER_ID &&
      process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_WALLET_PRIVATE_KEY
  );
}

const CLASS_SUFFIX = "event_experience_ticket";

// Baut den "Zu Google Wallet hinzufuegen"-Link fuer ein Ticket. Klasse und
// Objekt werden inline im signierten JWT mitgeschickt (kein vorheriger
// REST-Aufruf zum Anlegen der Pass-Klasse noetig).
export function buildGoogleWalletSaveUrl(
  ticket: Ticket,
  company: string
): string {
  if (!isGoogleWalletConfigured()) {
    throw new Error(
      "Google Wallet ist noch nicht eingerichtet: GOOGLE_WALLET_* Umgebungsvariablen fehlen."
    );
  }

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const classId = `${issuerId}.${CLASS_SUFFIX}`;
  const objectId = `${issuerId}.${ticket.code}`;

  const genericClass = {
    id: classId,
    classTemplateInfo: {
      cardTemplateOverride: {
        cardRowTemplateInfos: [
          {
            twoItems: {
              startItem: {
                firstValue: {
                  fields: [{ fieldPath: "object.textModulesData['date']" }],
                },
              },
              endItem: {
                firstValue: {
                  fields: [{ fieldPath: "object.textModulesData['location']" }],
                },
              },
            },
          },
        ],
      },
    },
  };

  const genericObject = {
    id: objectId,
    classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    hexBackgroundColor: "#0b0b0d",
    logo: {
      sourceUri: {
        uri: "https://moos-park.de/images/logo.png",
      },
    },
    cardTitle: { defaultValue: { language: "de", value: "THE EVENT EXPERIENCE" } },
    subheader: { defaultValue: { language: "de", value: "Ticket" } },
    header: {
      defaultValue: {
        language: "de",
        value: `${ticket.salutation} ${ticket.firstName} ${ticket.lastName}`,
      },
    },
    textModulesData: [
      { id: "company", header: "Unternehmen", body: company },
      { id: "date", header: "Datum", body: `${EVENT_DATE_LABEL}, ${EVENT_TIME_LABEL}` },
      { id: "location", header: "Ort", body: `${EVENT_LOCATION_NAME}, ${EVENT_ADDRESS}` },
    ],
    barcode: { type: "QR_CODE", value: ticket.code },
  };

  const payload = {
    iss: process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL,
    aud: "google",
    typ: "savetowallet",
    iat: Math.floor(Date.now() / 1000),
    payload: {
      genericClasses: [genericClass],
      genericObjects: [genericObject],
    },
  };

  const privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY!.replace(/\\n/g, "\n");
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  return `https://pay.google.com/gp/v/save/${token}`;
}
