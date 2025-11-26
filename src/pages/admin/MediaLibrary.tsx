```
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, Video, File, Trash2, Search, X, Copy, Check, CloudUpload } from "lucide-react";
import { toast } from "sonner";
import { compressImageFor1080, compressImageForVertical } from "@/lib/imageCompression";
import { cn } from "@/lib/utils";

interface Media {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  url: string;
  thumbnail_url?: string;
  width?: number;
  height?: number;
  duration?: number;
  alt_text?: string;
  caption?: string;
  created_at: string;
}

export default function MediaLibrary() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchMedia();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    filterMedia();
  }, [media, searchQuery, selectedType]);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement des médias");
    } finally {
      setLoading(false);
    }
  };

  const filterMedia = () => {
    let filtered = media;

    if (selectedType !== "all") {
      filtered = filtered.filter(m => m.file_type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(m => 
        m.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.caption?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMedia(filtered);
  };

  const handleUpload = async (files: FileList | null, format?: 'square' | 'vertical') => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedFiles: Media[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');

        let uploadFile = file;

        if (isImage) {
          toast.info(`Compression de ${file.name}...`);
          if (format === 'vertical') {
            uploadFile = await compressImageForVertical(file);
          } else {
            uploadFile = await compressImageFor1080(file);
          }
        }

        const fileExt = uploadFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('article-media')
          .upload(filePath, uploadFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('article-media')
          .getPublicUrl(filePath);

        // Create media entry
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_library')
          .insert({
            user_id: user?.id,
            filename: fileName,
            original_filename: file.name,
            file_type: isImage ? 'image' : isVideo ? 'video' : 'document',
            mime_type: file.type,
            file_size: file.size,
            url: urlData.publicUrl,
            thumbnail_url: isImage ? urlData.publicUrl : undefined,
          })
          .select()
          .single();

        if (mediaError) throw mediaError;
        uploadedFiles.push(mediaData);
      }

      setMedia([...uploadedFiles, ...media]);
      toast.success(`${uploadedFiles.length} fichier(s) uploadé(s)`);
    } catch (error: any) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Supprimer ce média ?")) return;

    try {
      const { error } = await supabase
        .from('media_library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Delete from storage
      const path = url.split('/').slice(-2).join('/');
      await supabase.storage.from('article-media').remove([path]);

      setMedia(media.filter(m => m.id !== id));
      toast.success("Média supprimé");
    } catch (error: any) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Lien copié !");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Drag and Drop handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleUpload(e.dataTransfer.files);
  }, []);

  if (authLoading || loading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Médiathèque
          </h1>
          <p className="text-muted-foreground">Gérez vos images et vidéos</p>
        </div>
        <div className="flex gap-2">
          <label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleUpload(e.target.files)}
              className="hidden"
              disabled={uploading}
            />
            <Button disabled={uploading} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Upload..." : "Importer"}
            </Button>
          </label>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="p-4 rounded-full bg-muted">
            <CloudUpload className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Glissez-déposez vos fichiers ici</h3>
          <p className="text-sm text-muted-foreground">
            ou cliquez sur le bouton "Importer" pour sélectionner des fichiers
          </p>
        </div>
      </div>

      <Card className="p-1 border-none shadow-sm bg-muted/50">
        <div className="flex flex-col md:flex-row gap-4 p-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un fichier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background border-none shadow-sm"
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-4 bg-background shadow-sm">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="image">Images</TabsTrigger>
              <TabsTrigger value="video">Vidéos</TabsTrigger>
              <TabsTrigger value="document">Docs</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredMedia.map((item) => (
          <div key={item.id} className="group relative bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-square bg-muted relative overflow-hidden">
              {item.file_type === 'image' && (
                <img
                  src={item.url}
                  alt={item.alt_text || item.original_filename}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              )}
              {item.file_type === 'video' && (
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                />
              )}
              {item.file_type === 'document' && (
                <div className="flex items-center justify-center h-full bg-muted/50">
                  <File className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-black"
                  onClick={() => copyToClipboard(item.url, item.id)}
                  title="Copier le lien"
                >
                  {copiedId === item.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-9 w-9 rounded-full"
                  onClick={() => handleDelete(item.id, item.url)}
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="text-[10px] px-1.5 h-5 uppercase tracking-wider bg-muted/50 border-muted">
                  {item.file_type}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {formatFileSize(item.file_size)}
                </span>
              </div>
              <p className="text-sm font-medium truncate" title={item.original_filename}>
                {item.original_filename}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 rounded-full bg-muted mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold">Aucun média trouvé</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            Essayez de modifier vos filtres ou importez de nouveaux fichiers.
          </p>
        </div>
      )}
    </div>
  );
}
```