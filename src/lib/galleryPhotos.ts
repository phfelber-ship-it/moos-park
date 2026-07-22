export const PHOTO_POOL = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/rooms/main-halle.jpg",
  "/images/rooms/terrasse.jpg",
  "/images/rooms/lounge.jpg",
  "/images/rooms/chillout.jpg",
  "/images/rooms/foyer.jpg",
  "/images/rooms/pizzeria.jpg",
];

export function photosFor(index: number, count: number): string[] {
  const photos: string[] = [];
  for (let i = 0; i < count; i++) {
    photos.push(PHOTO_POOL[(index + i) % PHOTO_POOL.length]);
  }
  return photos;
}
