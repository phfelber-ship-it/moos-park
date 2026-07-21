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
};

export function eventTicketUrl(eventId: string): string {
  return `https://moospark.clubscale.com/events/${eventId}`;
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
