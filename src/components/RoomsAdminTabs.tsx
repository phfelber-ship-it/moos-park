"use client";

import { useState } from "react";
import RoomImageManager from "@/components/RoomImageManager";

type RoomData = {
  slug: string;
  name: string;
  images: { pathname: string; url: string }[];
  fallbackImages: string[];
};

export default function RoomsAdminTabs({ rooms }: { rooms: RoomData[] }) {
  const [active, setActive] = useState(0);
  const room = rooms[active];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {rooms.map((r, i) => (
          <button
            key={r.slug}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-lg px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors ${
              i === active
                ? "bg-accent-lime text-black"
                : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      <RoomImageManager
        key={room.slug}
        slug={room.slug}
        initialImages={room.images}
        fallbackImages={room.fallbackImages}
      />
    </div>
  );
}
