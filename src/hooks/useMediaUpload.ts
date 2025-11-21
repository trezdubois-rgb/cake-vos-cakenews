import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { compressImageFor1080 } from "@/lib/imageCompression";
import { toast } from "sonner";

interface UseMediaUploadResult {
    uploading: boolean;
    uploadImage: (file: File, userId: string) => Promise<string | null>;
}

export const useMediaUpload = (): UseMediaUploadResult => {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File, userId: string): Promise<string | null> => {
        if (!file.type.startsWith('image/')) {
            toast.error("Le fichier doit être une image");
            return null;
        }

        setUploading(true);
        try {
            toast.info("Compression de l'image en cours...");

            // Compress image
            const compressedFile = await compressImageFor1080(file);

            const fileExt = compressedFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('article-media')
                .upload(filePath, compressedFile);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('article-media')
                .getPublicUrl(filePath);

            toast.success("Image compressée et uploadée avec succès");
            return data.publicUrl;
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Erreur lors de l'upload");
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploading, uploadImage };
};
