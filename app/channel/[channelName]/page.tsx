// app/channel/[channelName]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import VideoGrid from "@/app/ui/video-grid";
import SortControl from "./sort-control";

type PageProps = {
  params: Promise<{ channelName: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export default async function ChannelPage({ params, searchParams }: PageProps) {
  const { channelName } = await params;
  const channelNameDecoded = decodeURIComponent(channelName);
  const { sort } = await searchParams;

  const videos = await prisma.video.findMany({
    where: { channel: channelNameDecoded },
    orderBy:
      sort === "most_viewed" ? { viewCount: "desc" } : { publishedAt: "desc" },
  });

  const videosWithFormattedDates = videos.map((v) => ({
    ...v,
    publishedAt: v.publishedAt.toISOString(),
  }));

  if (!videos || videos.length === 0) notFound();

  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-8">
      <h1 className="text-lg sm:text-2xl font-bold pb-3 mb-2 border-b-2 border-primary">
        {channelNameDecoded}'s Videos
      </h1>
      <SortControl currentSort={sort} />
      {videos.length === 0 ? (
        <p className="text-text-500">No videos yet.</p>
      ) : (
        <VideoGrid videos={videosWithFormattedDates} />
      )}
    </div>
  );
}
