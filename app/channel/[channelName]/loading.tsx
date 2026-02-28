// app/channel/[channelName]/loading.tsx
// This is the default loading component for the channel page.
// Server components can have a loading.tsx file that will be rendered while the server component is loading data.
import VideoGridSkeleton from "@/app/ui/video-grid-skeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col max-w-7xl mx-auto px-4 pt-2 pb-6 sm:px-8">
      <h1 className="text-lg sm:text-2xl font-bold pb-3 mb-2 border-b-2 border-primary">
        Loading channel...
      </h1>
      <div className="mb-8">
        <div className="flex gap-1">
          <button
            className={
              "px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition duration-200 border-b-2 border-primary text-primary -mb-0.5"
            }
          >
            Newest
          </button>
          <button
            className={
              "px-4 py-2 text-xs sm:text-sm font-medium cursor-pointer transition duration-200 text-text-500 hover:text-primary"
            }
          >
            Most Viewed
          </button>
        </div>
      </div>
      <VideoGridSkeleton />
    </div>
  );
}
