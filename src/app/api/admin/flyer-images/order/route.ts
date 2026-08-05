import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { FLYER_ORDER_PATH } from "@/lib/flyer-images";

export async function PUT(request: Request) {
  const { order } = (await request.json()) as { order?: string[] };
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "Ungueltige Reihenfolge." }, { status: 400 });
  }

  await put(FLYER_ORDER_PATH, JSON.stringify(order), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });

  return NextResponse.json({ ok: true });
}
