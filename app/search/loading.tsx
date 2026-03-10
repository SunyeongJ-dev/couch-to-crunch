// app/search/loading.tsx
import VideoGridSkeleton from "@/app/ui/video-grid-skeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-8">
      <h1 className="text-lg sm:text-2xl font-bold pb-3 mb-2 border-b-2 border-primary">
        Searching...
      </h1>
      <div className="mt-6">
        <VideoGridSkeleton />
      </div>
    </div>
  );
}
