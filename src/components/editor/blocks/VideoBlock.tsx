import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Block } from "../BlockEditor";

interface VideoBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const VideoBlock = ({ block, onChange }: VideoBlockProps) => {
  const platform = block.attributes?.platform || 'youtube';

  const getEmbedUrl = (url: string, platform: string) => {
    if (!url) return '';

    try {
      switch (platform) {
        case 'youtube': {
          const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
          return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        }
        case 'tiktok': {
          const videoId = url.match(/\/video\/(\d+)/)?.[1];
          return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : url;
        }
        case 'vimeo': {
          const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
          return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
        }
        case 'facebook':
          return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&width=640`;
        case 'custom':
        default:
          return url;
      }
    } catch {
      return url;
    }
  };

  const embedUrl = getEmbedUrl(block.content, platform);

  return (
    <div className="space-y-3">
      <div>
        <Label>Plateforme</Label>
        <Select
          value={platform}
          onValueChange={(value) => 
            onChange({ attributes: { ...block.attributes, platform: value } })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
            <SelectItem value="vimeo">Vimeo</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="custom">Autre (URL directe)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>URL de la vidéo</Label>
        <Input
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder={`URL ${platform}`}
        />
      </div>

      {embedUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};