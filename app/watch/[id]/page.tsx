import { videos } from "../../lib/placeholder-data";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = videos.find((v) => v.id === id);
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl pb-4 bg-sub-background rounded-lg shadow-md overflow-hidden">
        <div className="relative pb-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${video?.id}`}
            title={video?.title}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
          />
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold">{video?.title}</h1>
            <button className="px-4 py-2 bg-accent text-white rounded">
              Save
            </button>
          </div>

          <p className="text-text-600 text-sm mb-4">{video?.channel}</p>
          <div className="flex justify-between items-center gap-4">
            <p className="text-text-500 text-xs">
              {video?.viewCount} • {video?.uploadTime}
            </p>
            <p className="text-text-500 text-xs">{video?.duration}</p>
          </div>
          <p className="border-t text-text-500 text-sm mt-4 pt-4">
            {video?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
