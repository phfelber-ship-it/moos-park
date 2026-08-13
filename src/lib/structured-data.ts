// Reine Funktion ohne Server-Imports (kein @vercel/blob etc.) - wird
// sowohl serverseitig als auch vom clientseitigen StructuredDataInjector
// importiert, darf daher keine Node-only Abhaengigkeiten mitziehen.

// Organization/NightClub-Schema fuer die strukturierten Daten (JSON-LD) -
// Adresse/Kontakt/Social-Links wie auf /kontakt und /impressum hinterlegt.
export function buildStructuredData(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "NightClub",
    name: "moos.park",
    url: siteUrl,
    image: `${siteUrl}/images/logo.png`,
    telephone: "+49 8253 7576",
    email: "kontakt@moos-park.de",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rudolf-Diesel-Straße 23",
      postalCode: "86554",
      addressLocality: "Pöttmes",
      addressCountry: "DE",
    },
    sameAs: [
      "https://www.facebook.com/mp.poettmes",
      "https://www.instagram.com/moos.park/",
    ],
  };
}
