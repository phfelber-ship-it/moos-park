const COMMUNITY_ID = "675812b48b4595ad0f323ee6";
const API_BASE = `https://moospark.clubscale.com/api/public/v2/communities/${COMMUNITY_ID}`;

export type TicketPool = {
  id: string;
  name: string;
  price: number;
  free: boolean;
  contingent: number;
  sold: number;
  saleStart: string;
  saleEnd: string;
  deactivated: boolean;
  sortIndex: number;
};

export type ClubscaleImage = {
  presignedURL: string;
};

export type ClubscaleEvent = {
  id: string;
  name: string;
  description: string;
  descriptionContent: { html: string; text: string };
  tags: string[];
  baseColor: string;
  ageRestriction: number;
  address: {
    city: string;
    street: string;
    houseNumber: string;
    zip: string;
  };
  start: string;
  end: string;
  boxOfficePrice: number;
  hasBoxOffice: boolean;
  boxOfficeText: string;
  ticketPools: TicketPool[];
  ticketPoolMinPrice: number;
  ticketPoolMaxPrice: number;
  logo: ClubscaleImage | null;
  thumbnail: ClubscaleImage | null;
  artists: string[];
};

export type Artist = {
  id: string;
  name: string;
  subtext: string;
  image: ClubscaleImage | null;
};

export type GalleryMedia = {
  id: string;
  title: string;
  thumbnail: ClubscaleImage | null;
  fullImage: ClubscaleImage | null;
};

export type Gallery = {
  id: string;
  eventID: string;
  name: string;
  date: string;
  mediaCount: number;
  coverMediaObjects: GalleryMedia[];
};

export const TAG_STYLES: Record<string, string> = {
  party: "bg-accent-lime text-black",
  konzerte: "bg-accent text-black",
};

export function tagClasses(tag: string): string {
  return TAG_STYLES[tag.toLowerCase()] ?? "bg-foreground/10 text-foreground/70";
}

const TAG_ORDER = [
  "Main Floor",
  "Kleiner Club",
  "Terrasse",
  "Party",
  "Konzerte",
  "Comedy",
  "Lifestyle",
];

const TAG_ORDER_LOWER = TAG_ORDER.map((t) => t.toLowerCase());

export function sortTags(tags: string[]): string[] {
  return [...tags].sort((a, b) => {
    const ai = TAG_ORDER_LOWER.indexOf(a.toLowerCase());
    const bi = TAG_ORDER_LOWER.indexOf(b.toLowerCase());
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

export function checkoutUrl(
  eventId: string,
  items: { poolId: string; qty: number }[]
): string {
  const params = new URLSearchParams({
    eventId,
    items: JSON.stringify(items),
  });
  return `/tickets-data?${params.toString()}`;
}

export function priceToEuro(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function getEvents(): Promise<ClubscaleEvent[]> {
  const res = await fetch(`${API_BASE}/events?currentOrFuture=true`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as { events: ClubscaleEvent[] };
  return [...data.events].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
}

export async function getEvent(id: string): Promise<ClubscaleEvent | null> {
  const events = await getEvents();
  return events.find((e) => e.id === id) ?? null;
}

export async function getArtist(id: string): Promise<Artist | null> {
  const res = await fetch(`${API_BASE}/artists/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    return null;
  }
  return (await res.json()) as Artist;
}

export async function getArtists(ids: string[]): Promise<Artist[]> {
  const artists = await Promise.all(ids.map((id) => getArtist(id)));
  return artists.filter((a): a is Artist => a !== null);
}

export async function getGalleries(): Promise<Gallery[]> {
  const res = await fetch(`${API_BASE}/galleries?limit=100`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as { galleries: Gallery[] };
  return [...data.galleries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getGallery(id: string): Promise<Gallery | null> {
  const res = await fetch(`${API_BASE}/galleries/${id}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    return null;
  }
  return (await res.json()) as Gallery;
}

export async function getGalleryMedia(id: string): Promise<GalleryMedia[]> {
  const res = await fetch(`${API_BASE}/galleries/${id}/media?limit=100`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as { media: GalleryMedia[] };
  return data.media;
}
