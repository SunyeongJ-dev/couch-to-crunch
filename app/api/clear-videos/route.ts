// app/api/clear-videos/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE() {
  // DELETE only allowed in development mode.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { ok: false, error: "Not available in production" },
      { status: 403 },
    );
  }

  try {
    const result = await prisma.video.deleteMany({});

    return NextResponse.json({
      ok: true,
      deleted: result.count,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        ok: false,
        error: (err as Error)?.message ?? "Unknown error",
      },
      { status: 500 },
    );
  }
}
