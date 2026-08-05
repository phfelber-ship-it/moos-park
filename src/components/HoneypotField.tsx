// Unsichtbares Spam-Schutz-Feld: fuer echte Nutzer nicht sichtbar/erreichbar
// (position off-screen, tabIndex -1, aria-hidden), einfache Bots fuellen
// aber oft jedes Feld im Formular aus - ist es beim Absenden nicht leer,
// wird die Einsendung im jeweiligen submit-Handler still verworfen (siehe
// "if (honeypot) return;" in den Formularen).
export default function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
    />
  );
}
