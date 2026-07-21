import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Reservierung - moos.park | Eventlocation" };

export default function ReservierungPage() {
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

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
