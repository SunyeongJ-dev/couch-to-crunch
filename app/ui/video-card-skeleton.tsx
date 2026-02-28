// app/ui/video-card-skeleton.tsx
export default function VideoCardSkeleton() {
  return (
    <div className="relative w-full bg-sub-background rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="relative pb-[56.25%]">
        <div className="absolute top-0 left-0 w-full h-full bg-gray-300" />
      </div>
      <div className="flex flex-col justify-between sm:min-h-36 p-4">
        <div>
          <div className="h-4 bg-gray-300 rounded mb-2 w-full" />
          <div className="h-4 bg-gray-300 rounded mb-3 w-3/4" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
        </div>
        <div className="mt-1 flex justify-between">
          <div className="h-3 bg-gray-300 rounded w-1/3" />
          <div className="h-3 bg-gray-300 rounded w-1/6" />
        </div>
      </div>
    </div>
  );
}
