// app/api/saved-videos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { videoIds } = await req.json();
  if (!Array.isArray(videoIds)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  await Promise.all(
    videoIds.map((id) =>
      prisma.userSavedVideo.upsert({
        where: { userId_videoId: { userId, videoId: id } },
        update: {},
        create: { userId: userId, videoId: id },
      }),
    ),
  );

  return NextResponse.json({ success: true });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const savedVideos = await prisma.userSavedVideo.findMany({
    where: { userId: session.user.id },
    select: { videoId: true },
  });
  return NextResponse.json({ savedVideos });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { videoId } = await req.json();
  if (typeof videoId !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  await prisma.userSavedVideo.deleteMany({
    where: { userId, videoId },
  });
  return NextResponse.json({ success: true });
}
