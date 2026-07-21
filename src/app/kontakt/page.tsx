import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Kontakt - moos.park | Eventlocation" };

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-4xl font-black uppercase text-white">Kontakt</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-2xl border border-white/5">
            <iframe
              title="moos.park Standort"
              src="https://www.google.com/maps?q=Rudolf-Diesel-Stra%C3%9Fe+23,+86554+P%C3%B6ttmes&output=embed"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                E-Mail
              </p>
              <a
                href="mailto:kontakt@moos-park.de"
                className="mt-1 block font-semibold text-white hover:text-accent"
              >
                kontakt@moos-park.de
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                Adresse
              </p>
              <p className="mt-1 font-semibold text-white">
                moos-park Gastronomie GmbH
                <br />
                Rudolf-Diesel-Str. 23
                <br />
                86554 Pöttmes
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                Telefon
              </p>
              <a
                href="tel:082537576"
                className="mt-1 block font-semibold text-white hover:text-accent"
              >
                08253-7576
              </a>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                Bürozeiten
              </p>
              <p className="mt-1 font-semibold text-white">
                Mo., Mi., Fr.: 09:00 – 15:00 Uhr
              </p>
              <p className="mt-1 text-sm text-white/50">
                Gerne auch eine Nachricht auf unseren Anrufbeantworter. Wir
                rufen zurück.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-wide text-white/40">
              Folge uns
            </p>
            <div className="mt-2 flex gap-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-accent"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:text-accent"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black uppercase text-white">
            Schreib uns eine Nachricht.
          </h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
