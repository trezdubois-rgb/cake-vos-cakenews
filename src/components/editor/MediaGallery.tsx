import React, { useState, useEffect, useCallback } from 'react';

import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface MediaFile {
  name: string;
  url: string;
}

interface MediaGalleryProps {
  onSelect: (url: string) => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ onSelect }) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.storage.from('media').list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });
      if (error) throw error;

      const mediaFiles = await Promise.all(
        data.map(async (file) => {
          const { data: urlData } = supabase.storage.from('media').getPublicUrl(file.name);
          return { name: file.name, url: urlData.publicUrl };
        })
      );
      setFiles(mediaFiles);
    } catch (err: unknown) {
      setError('Failed to load media files.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    setUploading(false);

    if (uploadError) {
      setError('Failed to upload file.');
      console.error(uploadError);
    } else {
      fetchFiles(); // Refresh the list
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Media Gallery</h2>

      <div className="mb-4">
        <Input type="file" onChange={handleUpload} disabled={uploading} />
        {uploading && <p>Uploading...</p>}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {isLoading ? (
        <p>Loading media...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div 
              key={file.name} 
              className="aspect-square relative group" 
              role="button"
              tabIndex={0}
              onClick={() => onSelect(file.url)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelect(file.url);
                }
              }}
            >
              <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-md cursor-pointer" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity">
                <p className="text-white opacity-0 group-hover:opacity-100 text-xs text-center p-1">{file.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGallery;