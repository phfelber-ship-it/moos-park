import EventRequestForm from "@/components/EventRequestForm";

export const metadata = {
  title: "Veranstaltungsanfragen - moos.park | Eventlocation",
};

export default function VeranstaltungsanfragePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pb-20 pt-32">
      <h1 className="text-center text-4xl font-black uppercase text-foreground">
        Veranstaltungsanfragen
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-foreground/60">
        Hochzeit, Konzert, Messe, Geburtstag, Tagung oder exklusives
        Sonderevent – schreib uns die Eckdaten, wir melden uns innerhalb von
        24 Stunden mit einem passenden Angebot.
      </p>

      <div className="mt-10">
        <EventRequestForm />
      </div>
    </div>
  );
}
