import VideoCard from "./video-card";
import type { FetchedVideo } from "../lib/types";

type VideoGridProps = {
  videos: FetchedVideo[];
};

// The VideoGrid component receives a list of videos and renders them in a responsive grid layout using the VideoCard component for each video.
export default function VideoGrid({ videos }: VideoGridProps) {
  const videoCards = videos.map((video) => (
    <VideoCard key={video.youtubeId} video={video} />
  ));
  return (
    <div className="w-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videoCards}
    </div>
  );
}
