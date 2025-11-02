import { Music } from "lucide-react";

interface AudioPlayerProps {
  url: string;
  title?: string;
}

export const AudioPlayer = ({ url, title }: AudioPlayerProps) => {
  return (
    <div className="flex items-center gap-4 p-6 bg-muted rounded-lg my-6">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
          <Music className="h-8 w-8 text-primary" />
        </div>
      </div>
      <div className="flex-1">
        {title && (
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
        )}
        <audio
          src={url}
          controls
          className="w-full"
          controlsList="nodownload"
        />
      </div>
    </div>
  );
};