// app/ui/video-grid-skeleton.tsx
import VideoCardSkeleton from "./video-card-skeleton";

export default function VideoGridSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 20 }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}
