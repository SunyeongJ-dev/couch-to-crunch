import VideoCard from "./video-card";
import videos from "../lib/placeholder-data";

export default function VideoGrid() {
  const videoCards = videos.map((video) => (
    <VideoCard key={video.id} video={video} />
  ));
  return (
    <div className="w-auto max-w-7xl mx-auto px-8 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videoCards}
    </div>
  );
}
