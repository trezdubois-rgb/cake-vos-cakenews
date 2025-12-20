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

        // Check file size before compression (max 10MB raw)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("L'image est trop lourde (max 10MB)");
            return null;
        }

        setUploading(true);
        try {
            // Verify user is still authenticated
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("Session expirée. Veuillez vous reconnecter.");
                return null;
            }

            toast.info("Compression de l'image en cours...");

            // Compress image
            const compressedFile = await compressImageFor1080(file);

            // Generate unique filename
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
            const fileName = `${timestamp}-${randomStr}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            console.log("Uploading to:", filePath);

            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('article-media')
                .upload(filePath, compressedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error("Upload error details:", uploadError);
                if (uploadError.message.includes('row-level security')) {
                    toast.error("Permission refusée. Vérifiez que vous êtes admin.");
                } else {
                    toast.error(`Erreur d'upload: ${uploadError.message}`);
                }
                return null;
            }

            const { data } = supabase.storage
                .from('article-media')
                .getPublicUrl(filePath);

            toast.success("Image uploadée avec succès");
            return data.publicUrl;
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error("Erreur lors de l'upload: " + (error.message || "Erreur inconnue"));
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploading, uploadImage };
};
