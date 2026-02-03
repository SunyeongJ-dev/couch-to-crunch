import VideoGrid from "./ui/video-grid";
import SideBar from "./ui/sidebar";

export default function Home() {
  return (
    <>
      <div className="flex h-screen">
        <SideBar />

        <main className="flex-1 overflow-auto">
          <VideoGrid />
        </main>
      </div>
    </>
  );
}
