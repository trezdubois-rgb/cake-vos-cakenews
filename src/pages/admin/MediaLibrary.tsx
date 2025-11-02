import { Upload, Video, File, Trash2, Search, X, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { compressImageFor1080, compressImageForVertical } from '@/lib/imageCompression';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const navigate = useNavigate();

  // Hooks doivent être appelés avant toute condition de retour
  useEffect(() => {
    if (user && isAdmin) {
      fetchMedia();
    }
  }, [user, isAdmin]);

  const filterMedia = useCallback(() => {
    let filtered = media;

    if (selectedType !== 'all') {
      filtered = filtered.filter((m) => m.file_type === selectedType);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.original_filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.alt_text?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
          (m.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    }

    setFilteredMedia(filtered);
  }, [media, searchQuery, selectedType]);

  useEffect(() => {
    filterMedia();
  }, [media, searchQuery, selectedType, filterMedia]);

  const fetchMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data ?? []);
    } catch (error) {
      console.error("Erreur lors du chargement des médias", error);
      toast.error("Erreur lors du chargement des médias");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    format?: 'square' | 'vertical'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedFiles: Media[] = [];

    try {
      for (const file of files) {
        if (!file) continue;
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

        const { data: urlData } = supabase.storage.from('article-media').getPublicUrl(filePath);

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

      // Validation pour éviter l'injection d'objet
      const validFiles = uploadedFiles.filter((_, index) => index >= 0 && index < uploadedFiles.length);
      setMedia(prevMedia => [...validFiles.reverse(), ...prevMedia]);
      toast.success(`${uploadedFiles.length} fichier(s) uploadé(s)`);
    } catch (error) {
      console.error("Erreur lors de l'upload", error);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!confirm('Supprimer ce média ?')) return;

    try {
      const { error } = await supabase.from('media_library').delete().eq('id', id);

      if (error) throw error;

      // Delete from storage
      const path = url.split('/').slice(-2).join('/');
      await supabase.storage.from("article-media").remove([path]);

      setMedia(media.filter((m) => m.id !== id));
      toast.success("Média supprimé");
    } catch (error) {
      console.error("Erreur lors de la suppression du média", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Vérifications d'authentification après les hooks
  if (!authLoading && !isAdmin) {
    navigate('/auth');
    return null;
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background p-8 pb-20">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={`skeleton-media-${i}`} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Bibliothèque de médias</h1>
          <div className="flex gap-2">
            <label>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleUpload(e)}
                className="hidden"
                disabled={uploading}
              />
              <Button disabled={uploading}>
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'Upload...' : 'Upload'}
              </Button>
            </label>
          </div>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchQuery && (
              <Button variant="ghost" size="icon" onClick={() => setSearchQuery('')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tous ({media.length})</TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="mr-2 h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="mr-2 h-4 w-4" />
                Vidéos
              </TabsTrigger>
              <TabsTrigger value="document">
                <File className="mr-2 h-4 w-4" />
                Docs
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden group relative">
              <div className="aspect-square bg-muted relative">
                {item.file_type === 'image' && (
                  <img
                    src={item.url}
                    alt={item.alt_text ?? item.original_filename}
                    className="w-full h-full object-cover"
                  />
                )}
                {item.file_type === 'video' && (
                  <video src={item.url} className="w-full h-full object-cover">
                    <track kind="captions" />
                  </video>
                )}
                {item.file_type === 'document' && (
                  <div className="flex items-center justify-center h-full">
                    <File className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(item.id, item.url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{item.original_filename}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary">{item.file_type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(item.file_size)}
                  </span>
                </div>
                {item.width && item.height && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.width} × {item.height}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun média trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}