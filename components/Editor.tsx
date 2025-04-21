import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Settings } from "lucide-react";

interface EditorProps {
  mediaElement: {
    type: "video" | "image";
    file: File | null;
    width: number;
    height: number;
    position: { x: number; y: number };
    startTime: number;
    endTime: number;
  };
  setMediaElement: (mediaElement: any) => void;
}

export default function Editor({ mediaElement, setMediaElement }: EditorProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(mediaElement.startTime);
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const timerRef = useRef<number>();

  // Format time as MM:SS.ms (00:01.4)
  
  const formatTime =usecallback( (time: number) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    const milliseconds = Math.floor((time % 1) * 10).toString();
    return `${minutes}:${seconds}.${milliseconds}`;
  },[time]);

  // Calculate progress percentage
  const progress =
    ((currentTime - mediaElement.startTime) /
      (mediaElement.endTime - mediaElement.startTime)) *
    100;

  // Handle timer updates
  useEffect(() => {
    if (isPlaying) {
      // Reset time to start if we're at or past the end
      if (currentTime >= mediaElement.endTime) {
        setCurrentTime(mediaElement.startTime);
      }

      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1;
          if (newTime >= mediaElement.endTime) {
            setIsPlaying(false);
            return mediaElement.endTime;
          }
          return newTime;
        });
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, mediaElement.startTime, mediaElement.endTime]);

  // Handle video time updates and visibility
  useEffect(() => {
    const video = mediaRef.current;
    if (!video || mediaElement.type !== "video") return;

    // Update video time to match timer
    if (!isSeeking) {
      video.currentTime = currentTime;
    }

    // Control visibility based on time range
    video.style.opacity =
      currentTime >= mediaElement.startTime && currentTime <= mediaElement.endTime
        ? "1"
        : "0";
  }, [
    currentTime,
    mediaElement.startTime,
    mediaElement.endTime,
    mediaElement.type,
    isSeeking,
  ]);

  // Handle play/pause
  const handlePlayPause = () => {
    const video = mediaRef.current;
    if (!video || mediaElement.type !== "video") return;

    if (!isPlaying) {
      // If we're at or past the end, reset to start
      if (currentTime >= mediaElement.endTime) {
        setCurrentTime(mediaElement.startTime);
      }
      video.style.opacity = "1"; // Ensure visibility when starting playback
      video.play().catch(console.error);
    } else {
      video.pause();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar interaction
  const handleProgressMouseDown = (e: React.MouseEvent) => {
    setIsSeeking(true);
    handleProgressClick(e);
  };

  const handleProgressMouseUp = () => {
    setIsSeeking(false);
  };

  const handleProgressClick = (e: React.MouseEvent) => {
    const progressBar = progressBarRef.current;
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const duration = mediaElement.endTime - mediaElement.startTime;
    const newTime = mediaElement.startTime + clickPosition * duration;

    setCurrentTime(newTime);
  };

  // Handle skip buttons
  const handleSkipBack = () => {
    setCurrentTime(mediaElement.startTime);
  };

  const handleSkipForward = () => {
    setCurrentTime(mediaElement.endTime);
    setIsPlaying(false);
    const video = mediaRef.current;
    if (video) {
      video.style.opacity = "0"; // Hide video after skipping to end
    }
  };

  // Handle drag for video position
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!mediaRef.current) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - mediaElement.position.x,
      y: e.clientY - mediaElement.position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    setMediaElement({
      ...mediaElement,
      position: { x: newX, y: newY },
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex-1 bg-black flex flex-col">
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {mediaElement.file &&
          (mediaElement.type === "video" ? (
            <video
              ref={mediaRef}
              src={URL.createObjectURL(mediaElement.file)}
              style={{
                position: "absolute",
                left: mediaElement.position.x,
                top: mediaElement.position.y,
                width: mediaElement.width,
                height: mediaElement.height,
                cursor: isDragging ? "grabbing" : "grab",
                transition: "opacity 0.2s ease",
                opacity:
                  currentTime >= mediaElement.startTime &&
                  currentTime <= mediaElement.endTime
                    ? "1"
                    : "0",
              }}
              onMouseDown={handleMouseDown}
            />
          ) : (
            <img
              src={URL.createObjectURL(mediaElement.file)}
              style={{
                position: "absolute",
                left: mediaElement.position.x,
                top: mediaElement.position.y,
                width: mediaElement.width,
                height: mediaElement.height,
                cursor: isDragging ? "grabbing" : "grab",
                opacity:
                  currentTime >= mediaElement.startTime &&
                  currentTime <= mediaElement.endTime
                    ? "1"
                    : "0",
                transition: "opacity 0.2s ease",
              }}
              onMouseDown={handleMouseDown}
            />
          ))}
      </div>

      <div className="h-34 bg-[#1a1a1a] border-t border-gray-800">
        <div className="flex items-center justify-between px-4 h-12 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm bg-transparent text-white rounded hover:bg-gray-800">
              Split
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-1 text-sm bg-white text-black rounded">
              <span>Landscape (16:9)</span>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="px-4 py-2 flex items-center gap-4">
          <div className="text-gray-400 text-sm w-20 text-right">
            {formatTime(currentTime)}
          </div>

          <div
            ref={progressBarRef}
            className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer relative group"
            onClick={handleProgressClick}
            onMouseDown={handleProgressMouseDown}
            onMouseUp={handleProgressMouseUp}
            onMouseLeave={handleProgressMouseUp}
          >
            <div
              className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-75"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                left: `calc(${Math.max(0, Math.min(100, progress))}% - 8px)`,
                transform: "translateY(-50%)",
              }}
            />
          </div>

          <div className="text-gray-400 text-sm w-20">
            {formatTime(mediaElement.endTime)}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-4 h-20">
          <button className="p-2 rounded-full hover:bg-gray-800" onClick={handleSkipBack}>
            <SkipBack className="w-5 h-5 text-gray-400" />
          </button>
          <button onClick={handlePlayPause} className="p-3 rounded-full hover:bg-gray-800">
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-gray-800" onClick={handleSkipForward}>
            <SkipForward className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
