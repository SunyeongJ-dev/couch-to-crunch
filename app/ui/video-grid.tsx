// app/ui/video-grid.tsx
import VideoCard from "./video-card";
import type { VideoData } from "../lib/types";

// The VideoGrid component receives a list of sorted videos.
export default function VideoGrid({ videos }: { videos: VideoData[] }) {
  const videoCards = videos.map((video) => (
    // Render a VideoCard for each video in the list, passing the video data as a prop.
    <VideoCard key={video.id} video={video} />
  ));
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videoCards}
    </div>
  );
}
