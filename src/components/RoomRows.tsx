import RoomImageRotator from "@/components/RoomImageRotator";

type RowRoom = {
  slug: string;
  name: string;
  capacity: string;
  area: string;
  text: string;
  images: string[];
};

function PersonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10m0 2c-4.4 0-9 2.2-9 5v3h18v-3c0-2.8-4.6-5-9-5" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RoomRows({ rooms }: { rooms: RowRoom[] }) {
  return (
    <div className="mx-auto mt-12 max-w-5xl space-y-12 text-left lg:space-y-16">
      {rooms.map((room, i) => (
        <div
          key={room.slug}
          className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12"
        >
          <div
            className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-foreground/5 ${
              i % 2 === 1 ? "lg:order-2" : ""
            }`}
          >
            <RoomImageRotator
              images={room.images}
              alt={room.name}
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          <div>
            <h3 className="text-2xl font-black uppercase text-foreground">
              {room.name}
            </h3>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold text-foreground/70">
              <span className="flex items-center gap-1.5">
                <PersonIcon />
                {room.capacity}
              </span>
              <span className="h-5 w-px bg-foreground/15" />
              <span className="flex items-center gap-1.5">
                <AreaIcon />
                {room.area}
              </span>
            </div>
            <p className="mt-4 text-foreground/70">{room.text}</p>
            <a
              href="#anfragen"
              className="mt-6 inline-block rounded-lg bg-accent-lime px-8 py-2.5 text-xs font-black uppercase tracking-wide text-black transition-transform hover:scale-105"
            >
              Anfragen
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
