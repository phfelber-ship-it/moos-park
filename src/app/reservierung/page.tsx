import { getEvent } from "@/lib/clubscale";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Reservierung - moos.park | Eventlocation" };

export default async function ReservierungPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event: eventId } = await searchParams;
  const event = eventId ? await getEvent(eventId) : null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-center text-4xl font-black uppercase text-foreground">
        Reservierung
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center text-foreground/60">
        Du willst dir einen Tisch oder eine Lounge sichern? Schreib uns kurz
        deine Wünsche (Datum, Personenzahl, Bereich) – wir melden uns
        persönlich zurück.
      </p>

      {event && (
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-accent-lime/40 bg-accent-lime/10 px-5 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground/50">
            Anfrage für
          </p>
          <p className="mt-1 font-black uppercase text-foreground">
            {event.name}
          </p>
        </div>
      )}

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
