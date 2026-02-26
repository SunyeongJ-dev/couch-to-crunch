// app/lib/useSavedVideo.ts
// Custom React hook to manage saved videos.
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// This key is used to store the list of saved video Ids in localStorage.
const SAVED_VIDEOS_KEY = "saved_videos";

type SavedVideosState = {
  currentUserId: string | null;
  videoIds: string[];
  isReady: boolean;
  loadingPromise: Promise<void> | null;
};

const sharedState: SavedVideosState = {
  currentUserId: null,
  videoIds: [],
  isReady: false,
  loadingPromise: null,
};

const listeners = new Set<(state: SavedVideosState) => void>();

function emit() {
  listeners.forEach((listener) => listener(sharedState));
}

function subscribe(listener: (state: SavedVideosState) => void) {
  listeners.add(listener);
  listener(sharedState);
  return () => listeners.delete(listener);
}

function getLocalSavedVideos(): string[] {
  return JSON.parse(localStorage.getItem("saved_videos") || "[]");
}

function setSharedState(newState: Partial<SavedVideosState>) {
  Object.assign(sharedState, newState);
  emit();
}

async function loadForUser(userId: string) {
  if (sharedState.currentUserId === userId && sharedState.isReady) {
    return;
  }

  if (sharedState.currentUserId === userId && sharedState.loadingPromise) {
    await sharedState.loadingPromise;
    return;
  }

  const loadPromise = async () => {
    const localSaved = getLocalSavedVideos();

    if (localSaved.length > 0) {
      await fetch("/api/saved-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIds: localSaved }),
      });
      localStorage.removeItem(SAVED_VIDEOS_KEY);
    }

    const res = await fetch("/api/saved-videos");
    const data = await res.json();
    const savedVideoIds = data.savedVideos.map(
      (v: { videoId: string }) => v.videoId,
    );

    setSharedState({
      currentUserId: userId,
      videoIds: savedVideoIds,
      isReady: true,
      loadingPromise: null,
    });
  };

  setSharedState({
    currentUserId: userId,
    isReady: false,
    loadingPromise: loadPromise(),
  });

  try {
    await loadPromise();
  } finally {
    if (sharedState.currentUserId === userId) {
      setSharedState({ loadingPromise: null });
    }
  }
}

function loadForGuest() {
  const savedVideoIds = getLocalSavedVideos();
  setSharedState({
    currentUserId: null,
    videoIds: savedVideoIds,
    isReady: true,
    loadingPromise: null,
  });
}

export default function useSavedVideo(videoId: string) {
  const { data: session } = useSession();
  const [videoIds, setVideoIds] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribe((state) => {
      setVideoIds(state.videoIds);
      setIsReady(state.isReady);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      void loadForUser(session.user.id);
      return;
    }

    loadForGuest();
  }, [session?.user?.id]);

  useEffect(() => {
    setIsSaved(videoIds.includes(videoId));
  }, [videoIds, videoId]);

  const saveVideo = (targetVideoId: string) => {
    if (session?.user?.id) {
      // When the user logs in, this checks if there are any saved videos in localStorage.
      // If there are, it sends them to the server to be saved in the database and then clears the localStorage.
      if (!videoIds.includes(targetVideoId)) {
        fetch("/api/saved-videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoIds: [targetVideoId] }),
        });
        setSharedState({
          currentUserId: session.user.id,
          videoIds: [...sharedState.videoIds, targetVideoId],
          isReady: true,
        });
      }
      return;
    }

    const localSaved = getLocalSavedVideos();
    if (!localSaved.includes(targetVideoId)) {
      localStorage.setItem(
        SAVED_VIDEOS_KEY,
        JSON.stringify([...localSaved, targetVideoId]),
      );
      setSharedState({
        currentUserId: null,
        videoIds: [...sharedState.videoIds, targetVideoId],
        isReady: true,
      });
    }
  };

  const removeVideo = (targetVideoId: string) => {
    if (session?.user?.id) {
      if (videoIds.includes(targetVideoId)) {
        void fetch("/api/saved-videos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoId: targetVideoId }),
        });
        setSharedState({
          currentUserId: session.user.id,
          videoIds: sharedState.videoIds.filter((id) => id !== targetVideoId),
          isReady: true,
        });
      }
      return;
    }
    const localSaved = getLocalSavedVideos();
    if (localSaved.includes(targetVideoId)) {
      localStorage.setItem(
        SAVED_VIDEOS_KEY,
        JSON.stringify(localSaved.filter((id: string) => id !== targetVideoId)),
      );
      setSharedState({
        currentUserId: null,
        videoIds: sharedState.videoIds.filter((id) => id !== targetVideoId),
        isReady: true,
      });
    }
  };

  return {
    isSaved,
    saveVideo,
    removeVideo,
    videoIds,
    isReady,
  };
}
