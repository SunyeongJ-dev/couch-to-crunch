// app/lib/useSavedVideo.ts
// Custom React hook to manage saved videos.
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function useSavedVideo(videoId: string) {
  const { data: session } = useSession();
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // This key is used to store the list of saved video Ids in localStorage.
  const SAVED_VIDEOS_KEY = "saved_videos";

  useEffect(() => {
    getSavedVideos();
  }, [session?.user?.id]);

  useEffect(() => {
    setIsSaved(videoIds.includes(videoId));
  }, [videoIds, videoId]);

  const getSavedVideos = () => {
    if (session?.user?.id) {
      // When the user logs in, this checks if there are any saved videos in localStorage.
      // If there are, it sends them to the server to be saved in the database and then clears the localStorage.
      const localSaved = JSON.parse(
        localStorage.getItem(SAVED_VIDEOS_KEY) || "[]",
      );
      if (localSaved.length > 0) {
        fetch("/api/saved-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoIds: localSaved }),
        })
          .then((res) => res.json())
          .then(() => {
            localStorage.removeItem(SAVED_VIDEOS_KEY);
          });
      }
      // Check the DB for their saved videos.
      fetch("/api/saved-videos")
        .then((res) => res.json())
        .then((data) => {
          const savedVideoIds = data.savedVideos.map(
            (v: { videoId: string }) => v.videoId,
          );
          setVideoIds(savedVideoIds);
          setIsReady(true);
        });
    } else {
      // If the user is not logged in, check localStorage.
      const savedVideoIds = JSON.parse(
        localStorage.getItem(SAVED_VIDEOS_KEY) || "[]",
      );
      setVideoIds(savedVideoIds);
      setIsReady(true);
    }
  };

  const saveVideo = (videoId: string) => {
    if (session?.user?.id) {
      if (!videoIds.includes(videoId)) {
        fetch("/api/saved-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });
        setVideoIds((prev) => [...prev, videoId]);
      }
    } else {
      const localSaved = JSON.parse(
        localStorage.getItem(SAVED_VIDEOS_KEY) || "[]",
      );
      if (!localSaved.includes(videoId)) {
        localStorage.setItem(
          SAVED_VIDEOS_KEY,
          JSON.stringify([...localSaved, videoId]),
        );
        setVideoIds((prev) => [...prev, videoId]);
      }
    }
  };

  const removeVideo = (videoId: string) => {
    if (session?.user?.id) {
      if (videoIds.includes(videoId)) {
        fetch("/api/saved-videos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId }),
        });
        setVideoIds((prev) => prev.filter((id) => id !== videoId));
      }
    } else {
      const localSaved = JSON.parse(
        localStorage.getItem(SAVED_VIDEOS_KEY) || "[]",
      );
      if (localSaved.includes(videoId)) {
        localStorage.setItem(
          SAVED_VIDEOS_KEY,
          JSON.stringify(localSaved.filter((id: string) => id !== videoId)),
        );
        setVideoIds((prev) => prev.filter((id) => id !== videoId));
      }
    }
  };

  return { isSaved, saveVideo, removeVideo, videoIds, isReady };
}
