import Accordion from "@/components/Accordion";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "FAQ - moos.park | Eventlocation" };

const FAQ_ITEMS = [
  {
    q: "Ticket (VVK, Abendkasse)",
    a: "Early Bird Ticket – Für alle, die clever planen: Sichere dir jetzt dein Ticket im Vorverkauf zum vergünstigten Preis und garantiertem Einlass – solange der Vorrat reicht! Begrenzte Stückzahl – wenn weg, dann weg. ⸻ Abendkasse: Eine Abendkasse darf bei keiner Veranstaltung fehlen und ist immer für euch geöffnet. Für alle Spontanen: Kommt vorbei! ⸻ Fastlane Ticket: Für alle, die keine Zeit für Schlangen haben – mit priorisiertem Einlass ohne Anstehen.",
  },
  {
    q: "Einlassbedingungen",
    a: "Ein gültiges Ausweisdokument im Original (Personalausweis, Reisepass) – egal wie alt du bist. Führerscheine, Bankkarten, Versichertenkarten, Mitgliedsausweise oder Kopien werden nicht angenommen. Noch nicht volljährig? Dann benötigst du eine Aufsichtsperson (mind. 18 Jahre, bis 23:59 Uhr notwendig), eine Kopie vom Ausweis eines Erziehungsberechtigten und den ausgefüllten Aufsichtszettel (in der App). Pro Aufsichtsperson ist nur eine Person unter 18 Jahren zulässig. Einlass immer unter Vorbehalt.",
  },
  {
    q: "Altersbeschränkung",
    a: "Der Einlass ist generell ab 17 Jahren. An Ü30-Veranstaltungen ab 25 Jahren. An ausgewählten Veranstaltungen ab 16 Jahren. Am besten in der Eventbeschreibung nachlesen. Ausnahmen werden nicht gemacht, auch nicht bei Nachfrage im Haus.",
  },
  {
    q: "Wie kleide ich mich richtig",
    a: "Kleide dich, als wäre es dein erstes Date! Einlass erhält im Allgemeinen jeder Gast mit gepflegtem Erscheinungsbild und angemessenem Verhalten. Trendige, moderne Kleidung ja – aber keine Sportbekleidung, Vereinskleidung, Motorradkleidung oder Club-Jacken. Keine rechtsradikalen Outfits wie Springerstiefel oder Bomberjacken.",
  },
  {
    q: "Reservierungen",
    a: "Reservieren kannst du direkt über die App. Notwendig ist das nicht. Deine Reservierung findest du in der App unter Events → Meine Tickets. Melde dich am Veranstaltungstag am Eingang beim Sicherheitsdienst. Reservierungen müssen bis spätestens 00:30 Uhr eingenommen werden, danach verfallen sie. Stornierung bis 24 Stunden vorher möglich, danach wird der volle Betrag berechnet.",
  },
  {
    q: "Fotobox",
    a: "Die im Chillout aufgestellte Fotobox gehört nicht der moos.park Gastronomie GmbH, sondern einem externen Aufsteller. Bei Fragen oder Störungen: info@vendago.de – bitte mit Angabe von Datum und Uhrzeit.",
  },
  {
    q: "Fotos / Videoaufnahmen",
    a: "Im moos.park werden an jedem Öffnungstag Foto- und Videoaufnahmen gemacht. Solltest du auf einem Bild erkennbar sein und das nicht möchten, schreib uns mit triftigem Grund über das Kontaktformular. Aufgenommene Medien können von uns für Werbezwecke verwendet und veröffentlicht werden.",
  },
  {
    q: "Garderobe",
    a: "Jacken, Regenschirme und Rucksäcke müssen beim Betreten an der Garderobe abgegeben werden. So vermeiden wir unnötige Diskussionen bei Verlust im Haus. Nichts abzugeben? Dann geht der Einlass für dich sogar noch schneller.",
  },
  {
    q: "Getränke",
    a: "Wir arbeiten ausschließlich mit qualitativ hochwertigen Getränkepartnern zusammen (Markenprodukten).",
  },
  {
    q: "Essen",
    a: "Im Haus gibt es eine Pizzeria mit selbstgemachten Pizzen. Essen ist nur in der Pizzeria erlaubt.",
  },
  {
    q: "Alkoholgenuss",
    a: "Bei ersichtlich angetrunkenen Personen: kein Einlass. Trink verantwortungsvoll – Alkohol ist ein Genussmittel. Mitgebrachte Getränke dürfen weder im Haus noch auf dem Gelände konsumiert werden, sonst kann der Einlass verwehrt werden.",
  },
  {
    q: "Zigaretten-/ Vapeautomat",
    a: "Die im Haus aufgestellten Automaten gehören nicht zur moos.park Gastronomie GmbH. Bei Fragen: Firma Ostermeier GmbH & Co. KG kontaktieren, mit Angabe der Automatennummer.",
  },
  {
    q: "Wie bezahle ich",
    a: "Getränke, Speisen, Garderobe und Eintritt werden bar bezahlt. Bei Bedarf kann im Haus Bargeld abgehoben werden. Alle bekannten Bankkarten werden akzeptiert (Gebühr fällig).",
  },
  {
    q: "Jobs",
    a: "Wir freuen uns immer auf fleißige helfende Hände. Meld dich einfach bei uns.",
  },
  {
    q: "Anrufen",
    a: "Wir sind nicht erreichbar? Dann hinterlass uns doch bitte eine Nachricht auf unserem Anrufbeantworter. Wir rufen zurück!",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-4xl font-black uppercase text-white">
        FAQ – Häufig gestellte Fragen
      </h1>
      <p className="mt-3 text-white/60">
        Du hast Fragen? Kein Problem! In unseren FAQs findest du schnell und
        einfach Antworten auf häufig gestellte Fragen und mehr. Kurz, klar und
        auf den Punkt.
      </p>

      <div className="mt-10">
        <Accordion items={FAQ_ITEMS} />
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-black uppercase text-white">
          Deine Frage ist hier nicht aufgelistet?
        </h2>
        <p className="mt-2 text-white/60">
          Dann schreib uns direkt über das Kontaktformular.
        </p>
        <div className="mt-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
