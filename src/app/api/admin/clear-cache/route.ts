import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// "/", "layout" revalidiert den kompletten Cache aller Seiten, die unter dem
// Root-Layout haengen - also praktisch die gesamte Seite in einem Rutsch.
export async function POST() {
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
