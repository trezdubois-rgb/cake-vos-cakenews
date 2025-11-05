import { useState, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmbedVideoPlayerProps {
  embedUrl: string;
  platform: "youtube" | "facebook" | "tiktok" | "custom";
}

export const EmbedVideoPlayer = ({ embedUrl, platform }: EmbedVideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getEmbedUrl = () => {
    if (platform === "youtube") {
      const videoId = embedUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1` : embedUrl;
    }
    return embedUrl;
  };

  const sendCommand = (command: string) => {
    if (!iframeRef.current) return;

    if (platform === "youtube") {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: command, args: [] }),
        "*"
      );
    }
  };

  const handlePlayPause = () => {
    if (platform === "youtube") {
      sendCommand(isPlaying ? "pauseVideo" : "playVideo");
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (seconds: number) => {
    if (platform === "youtube" && iframeRef.current) {
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }),
        "*"
      );
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src={getEmbedUrl()}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {platform === "youtube" && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => handleSeek(-10)}
            >
              <SkipBack size={20} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => handleSeek(10)}
            >
              <SkipForward size={20} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
