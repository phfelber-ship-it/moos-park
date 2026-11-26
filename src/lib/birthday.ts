// Liest ein vom Browser-Autofill (oder Einfuegen) vorgegebenes Geburtsdatum in
// einem einzigen Feld und teilt es in Tag, Monat und Jahr (alles Strings, Tag
// und Monat zweistellig). Erkannt werden TT.MM.JJJJ (auch mit / - oder
// Leerzeichen), JJJJ-MM-TT und reine Ziffernfolgen mit 8 Stellen (TTMMJJJJ oder
// JJJJMMTT). Gibt null zurueck, wenn es kein vollstaendiges, plausibles Datum
// ist (dann ist es normale Eingabe in ein einzelnes Feld).
export function parseFullBirthday(
  raw: string,
  currentYear = new Date().getFullYear()
): { day: string; month: string; year: string } | null {
  const text = raw.trim();
  let d: string | undefined;
  let m: string | undefined;
  let y: string | undefined;

  let match = /^(\d{4})[-./\s](\d{1,2})[-./\s](\d{1,2})$/.exec(text);
  if (match) {
    [, y, m, d] = match;
  } else if ((match = /^(\d{1,2})[-./\s](\d{1,2})[-./\s](\d{4})$/.exec(text))) {
    [, d, m, y] = match;
  } else if (/^\d{8}$/.test(text)) {
    const first = Number(text.slice(0, 4));
    if (first >= 1900 && first <= currentYear) {
      y = text.slice(0, 4);
      m = text.slice(4, 6);
      d = text.slice(6, 8);
    } else {
      d = text.slice(0, 2);
      m = text.slice(2, 4);
      y = text.slice(4, 8);
    }
  }
  if (!d || !m || !y) return null;

  const dayN = Number(d);
  const monthN = Number(m);
  const yearN = Number(y);
  if (dayN < 1 || dayN > 31 || monthN < 1 || monthN > 12) return null;
  if (yearN < 1900 || yearN > currentYear) return null;
  return {
    day: String(dayN).padStart(2, "0"),
    month: String(monthN).padStart(2, "0"),
    year: String(yearN),
  };
}
