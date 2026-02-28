// app/api/videos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Example request: /api/videos?ids=abc123,def456
export async function GET(req: Request) {
  // Parse the request URL into a URL object.
  // URL is a built-in Web API class which has searchParams.
  const url = new URL(req.url);
  // Get the "ids" query param via url.searchParams.get().
  const idsParam = url.searchParams.get("ids");
  // Split by comma, trim whitespace, and drop empty values.
  const ids = idsParam
    ? idsParam
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  // Find many videos, optionally filtered by the query.
  const rows = await prisma.video.findMany({
    where: ids.length > 0 ? { id: { in: ids } } : undefined,
    select: {
      id: true,
      title: true,
      channel: true,
      viewCount: true,
      publishedAt: true,
      durationSec: true,
      description: true,
      thumbnail: true,
      tags: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  // Map DB rows to a JSON-safe shape for the client.
  // Dates are converted to ISO strings because JSON has no Date type.
  const data = rows.map((v) => ({
    id: v.id,
    title: v.title,
    channel: v.channel,
    viewCount: v.viewCount,
    publishedAt: v.publishedAt.toISOString(),
    durationSec: v.durationSec,
    description: v.description,
    thumbnail: v.thumbnail,
    tags: v.tags,
  }));

  // Return the data as JSON in the response.
  return NextResponse.json(data);
}
