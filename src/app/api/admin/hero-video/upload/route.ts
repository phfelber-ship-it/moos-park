import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { HERO_VIDEO_PREFIX } from "@/lib/hero-video";

// Das Video geht direkt vom Browser in den Blob Store (Serverless-Funktionen
// duerfen nur ca. 4,5 MB Body annehmen - fuer Videos viel zu wenig). Diese
// Route stellt nur das kurzlebige Upload-Token aus; /api/admin/* ist ueber den
// Proxy bereits auf eingeloggte Admins beschraenkt.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(HERO_VIDEO_PREFIX)) {
          throw new Error("Ungültiger Pfad.");
        }
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"],
          maximumSizeInBytes: 30 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload fehlgeschlagen." },
      { status: 400 }
    );
  }
}
