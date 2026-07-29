import { ROOMS } from "@/lib/rooms";
import { getRoomBlobsOrdered } from "@/lib/room-images";
import RoomsAdminTabs from "@/components/RoomsAdminTabs";

export const dynamic = "force-dynamic";

export default async function RaeumeAdminPage() {
  const rooms = await Promise.all(
    ROOMS.map(async (r) => ({
      slug: r.slug,
      name: r.name,
      images: await getRoomBlobsOrdered(r.slug),
      fallbackImages: r.images,
    }))
  );

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-32">
      <h1 className="text-2xl font-black uppercase text-foreground">
        Räume verwalten
      </h1>
      <p className="mt-2 text-sm text-foreground/60">
        Bilder je Raum fuer Startseite und /eventlocation. Reihenfolge per
        Pfeiltasten anpassbar.
      </p>
      <RoomsAdminTabs rooms={rooms} />
    </div>
  );
}
