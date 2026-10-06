// Zentrale Eckdaten fuer THE EVENT EXPERIENCE (Landingpage + Bestaetigungsseite
// + Einladungs-Mailvorlage teilen sich diese Werte, statt sie mehrfach zu
// pflegen).
export const EVENT_DATE_LABEL = "Mittwoch, 14. Oktober 2026";
export const EVENT_TIME_LABEL = "17:00–22:00 Uhr";
export const EVENT_LOCATION_NAME = "moos.park Eventlocation";
export const EVENT_ADDRESS = "Rudolf-Diesel-Straße 23, 86554 Pöttmes";

export const TIMETABLE = [
  { time: "17:00", label: "Empfang aller Gäste" },
  { time: "18:00", label: "Herzliches Willkommen durch die Veranstalter" },
  { time: "18:30", label: "Kulinarische Verwöhnung" },
  { time: "20:00", label: "Inspirationen" },
  { time: "22:00", label: "Veranstaltungsende" },
];

// Gemeinsame Eckdaten-Form, die Mailer/Ticket-/Brief-/E-Mail-Generierung
// entgegennehmen - entweder die obigen Legacy-Konstanten (Default, falls
// kein konkretes Event uebergeben wird) oder aus einem CompanyEvent
// (lib/company-events.ts) abgeleitet. Dadurch bleiben bestehende Aufrufer
// ohne Aenderung lauffaehig, waehrend neue Firmenevents ihre eigenen
// Eckdaten mitgeben koennen.
export type EventInfo = {
  dateLabel: string;
  timeLabel: string;
  locationName: string;
  address: string;
  timetable: { time: string; label: string }[];
  heroTitle: string;
};

export const LEGACY_EVENT_INFO: EventInfo = {
  dateLabel: EVENT_DATE_LABEL,
  timeLabel: EVENT_TIME_LABEL,
  locationName: EVENT_LOCATION_NAME,
  address: EVENT_ADDRESS,
  timetable: TIMETABLE,
  heroTitle: "THE EVENT EXPERIENCE",
};
