import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Music } from "lucide-react";
import { Block } from "../BlockEditor";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AudioBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const AudioBlock = ({ block, onChange }: AudioBlockProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error("Le fichier doit être un fichier audio");
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('article-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('article-media')
        .getPublicUrl(filePath);

      onChange({ 
        content: data.publicUrl,
        attributes: { ...block.attributes, title: block.attributes?.title || file.name }
      });
      toast.success("Audio uploadé avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Fichier Audio</Label>
        <div className="flex gap-2">
          <Input
            type="file"
            accept="audio/*"
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
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Music className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <Input
                value={block.attributes?.title || ''}
                onChange={(e) => 
                  onChange({ attributes: { ...block.attributes, title: e.target.value } })
                }
                placeholder="Titre de l'audio"
                className="mb-2"
              />
              <audio
                src={block.content}
                controls
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};