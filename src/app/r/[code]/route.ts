import { NextResponse } from "next/server";
import { getBannerAds } from "@/lib/banner-ads";
import { recordBannerView } from "@/lib/banner-stats";

// Oeffentlicher Kurzlink fuer Anhaenger-Banner (QR-Code zeigt hierher).
// Zaehlt einen Scan/Aufruf fuer den Banner und leitet dann auf die
// hinterlegte Zielseite weiter.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const origin = new URL(_request.url).origin;
  const banners = await getBannerAds();
  const banner = banners.find((b) => b.code === code);

  if (!banner) {
    return NextResponse.redirect(new URL("/", origin));
  }

  await recordBannerView(code);

  return NextResponse.redirect(new URL(banner.targetPath, origin), {
    status: 302,
  });
}
