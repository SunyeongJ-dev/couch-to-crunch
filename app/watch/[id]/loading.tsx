// app/watch/[id]/loading.tsx

export default function Loading() {
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto bg-sub-background rounded-xl animate-pulse">
      <div className="w-full aspect-video rounded-xl bg-gray-300" />

      <div className="mt-4 sm:mt-6">
        <div className="relative mt-1 sm:pr-32">
          <div className="h-7 bg-gray-300 rounded w-3/4 mb-3" />
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-3" />
          <div className="h-9 bg-gray-300 rounded-md w-full sm:w-24 sm:absolute sm:top-0 sm:right-0" />
        </div>

        <div className="mt-3 flex gap-3">
          <div className="h-3 bg-gray-300 rounded w-20" />
          <div className="h-3 bg-gray-300 rounded w-20" />
          <div className="h-3 bg-gray-300 rounded w-16" />
        </div>

        <div className="mt-2 flex gap-2">
          <div className="h-6 bg-gray-300 rounded-full w-16" />
          <div className="h-6 bg-gray-300 rounded-full w-20" />
          <div className="h-6 bg-gray-300 rounded-full w-14" />
        </div>

        <div className="mt-6 p-4 rounded-xl border border-text-600 flex flex-col gap-2">
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
