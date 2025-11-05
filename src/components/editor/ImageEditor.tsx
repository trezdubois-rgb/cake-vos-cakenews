import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Crop, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImageBlob: Blob) => void;
  onCancel: () => void;
}

export const ImageEditor = ({ imageUrl, onSave, onCancel }: ImageEditorProps) => {
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const aspectRatios = [
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "9:16", value: 9 / 16 },
    { label: "4:3", value: 4 / 3 },
  ];

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = aspectRatios.find((r) => r.label === aspectRatio)?.value || 16 / 9;
    const canvasWidth = 800;
    const canvasHeight = canvasWidth / ratio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      position.x,
      position.y,
      image.width * scale,
      image.height * scale
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, "image/jpeg", 0.9);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex gap-2 flex-wrap">
        {aspectRatios.map((ratio) => (
          <Button
            key={ratio.label}
            variant={aspectRatio === ratio.label ? "default" : "outline"}
            size="sm"
            onClick={() => setAspectRatio(ratio.label)}
          >
            {ratio.label}
          </Button>
        ))}
      </div>

      <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio }}>
        <img
          ref={imageRef}
          src={imageUrl}
          alt="À éditer"
          className="w-full h-full object-contain"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          }}
        />
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
        >
          <ZoomOut size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setScale(Math.min(3, scale + 0.1))}
        >
          <ZoomIn size={16} />
        </Button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
    </Card>
  );
};
