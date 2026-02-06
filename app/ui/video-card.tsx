import Image from "next/image";
import type { Video } from "../lib/placeholder-data";

type VideoCardProps = {
  video: Video;
};

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="w-full bg-sub-background rounded-lg shadow-md overflow-hidden">
      <div className="relative pb-[56.25%]">
        <Image
          src={video.thumbnail}
          alt="Video Thumbnail"
          className="absolute top-0 left-0 w-full h-full object-cover"
          width={280}
          height={157}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
        <p className="text-text-600 text-sm">{video.channel}</p>
        <div className="flex justify-between">
          <p className="text-text-500 text-xs mt-1">
            {video.viewCount} • {video.uploadTime}
          </p>
          <p className="text-text-500 text-xs mt-1">{video.duration}</p>
        </div>
      </div>
    </div>
  );
}
