import VideoCard from "./ui/video-card";
import videos from "./lib/placeholder-data";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <VideoCard video={videos[0]} />
        <VideoCard video={videos[1]} />
        <VideoCard video={videos[2]} />
      </div>
    </>
  );
}
