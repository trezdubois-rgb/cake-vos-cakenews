import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Block } from "../BlockEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { compressImageFor1080 } from "@/lib/imageCompression";

interface ImageBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const ImageBlock = ({ block, onChange }: ImageBlockProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Le fichier doit être une image");
      return;
    }

    setUploading(true);
    try {
      const compressedFile = await compressImageFor1080(file);
      const { data: { user } } = await supabase.auth.getUser();
      
      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('article-media')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-media')
        .getPublicUrl(filePath);

      onChange({ 
        content: data.publicUrl,
        attributes: { ...block.attributes, caption: block.attributes?.caption || '' }
      });
      toast.success("Image uploadée avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Image</Label>
        <div className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="flex-1"
          />
          {uploading && (
            <Button disabled size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload...
            </Button>
          )}
        </div>
      </div>

      {block.content && (
        <>
          <img
            src={block.content}
            alt={block.attributes?.caption || "Image"}
            className="w-full rounded-lg"
          />
          <Input
            value={block.attributes?.caption || ''}
            onChange={(e) => 
              onChange({ attributes: { ...block.attributes, caption: e.target.value } })
            }
            placeholder="Légende de l'image (optionnel)"
          />
        </>
      )}
    </div>
  );
};