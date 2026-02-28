// app/search/page.tsx
import { prisma } from "@/app/lib/prisma";
import VideoGrid from "@/app/ui/video-grid";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage(params: PageProps) {
  const { q } = await params.searchParams;
  const words = q ? q.trim().split(/\s+/) : [];

  const videos = await prisma.video.findMany({
    where: {
      OR: words.map((word) => ({
        title: { contains: word, mode: "insensitive" },
      })),
    },
    orderBy: { publishedAt: "desc" },
  });

  const videosWithFormattedDates = videos.map((v) => ({
    ...v,
    publishedAt: v.publishedAt.toISOString(),
  }));

  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-8">
      <h1 className="text-lg sm:text-2xl font-bold pb-3 mb-2 border-b-2 border-primary">
        Search results for "{q}"
      </h1>
      {videos.length === 0 ? (
        <p className="text-text-500 mt-4">No results.</p>
      ) : (
        <VideoGrid videos={videosWithFormattedDates} />
      )}
    </div>
  );
}
