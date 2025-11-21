import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ArticleFormData {
    title: string;
    category_id: string;
    content_html: string;
    tags: string[];
    status: string;
    excerpt: string;
    featured: boolean;
    hero_image_url: string;
    hero_video_url: string;
    seo_title: string;
    seo_description: string;
    published: boolean;
    scheduled_publish_at: string;
}

const INITIAL_STATE: ArticleFormData = {
    title: "",
    category_id: "",
    content_html: "",
    tags: [],
    status: "draft",
    excerpt: "",
    featured: false,
    hero_image_url: "",
    hero_video_url: "",
    seo_title: "",
    seo_description: "",
    published: false,
    scheduled_publish_at: "",
};

export const useArticleForm = (articleId?: string, userId?: string) => {
    const [formData, setFormData] = useState<ArticleFormData>(INITIAL_STATE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (articleId) {
            fetchArticle();
        } else {
            setLoading(false);
        }
    }, [articleId]);

    const fetchArticle = async () => {
        if (!articleId) return;

        try {
            const { data, error } = await supabase
                .from("articles")
                .select("*")
                .eq("id", articleId)
                .single();

            if (error) throw error;

            setFormData({
                ...data,
                category_id: data.category_id || "",
                tags: data.tags || [],
                hero_image_url: data.hero_image_url || "",
                hero_video_url: data.hero_video_url || "",
                seo_title: data.seo_title || "",
                seo_description: data.seo_description || "",
                excerpt: data.excerpt || "",
                status: data.status || "draft",
                featured: data.featured || false,
                scheduled_publish_at: data.scheduled_publish_at ? new Date(data.scheduled_publish_at).toISOString().slice(0, 16) : "",
            });
        } catch (error: any) {
            toast.error("Erreur lors du chargement de l'article");
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof ArticleFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;

        setFormData(prev => {
            if (prev.tags.includes(trimmedTag)) return prev;
            return { ...prev, tags: [...prev.tags, trimmedTag] };
        });
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const saveArticle = async (publish = false, schedule = false) => {
        if (!userId) {
            toast.error("Vous devez être connecté pour sauvegarder");
            return;
        }

        if (!formData.title || !formData.content_html) {
            toast.error("Titre et contenu sont obligatoires");
            return;
        }

        if (schedule && !formData.scheduled_publish_at) {
            toast.error("Veuillez sélectionner une date de publication");
            return;
        }

        setSaving(true);
        try {
            const articleData = {
                title: formData.title,
                category_id: formData.category_id || null,
                content_html: formData.content_html,
                content_blocks: null,
                tags: formData.tags,
                status: schedule ? "scheduled" : (publish ? "published" : "draft"),
                excerpt: formData.excerpt || null,
                featured: formData.featured,
                hero_image_url: formData.hero_image_url || null,
                hero_video_url: formData.hero_video_url || null,
                seo_title: formData.seo_title || null,
                seo_description: formData.seo_description || null,
                author_id: userId,
                published: publish && !schedule,
                published_at: publish && !schedule ? new Date().toISOString() : null,
                scheduled_publish_at: schedule ? new Date(formData.scheduled_publish_at).toISOString() : null,
            };

            if (articleId) {
                const { error } = await supabase
                    .from("articles")
                    .update(articleData)
                    .eq("id", articleId);

                if (error) throw error;
                toast.success(schedule ? "Article planifié" : "Article mis à jour");
            } else {
                const { error } = await supabase
                    .from("articles")
                    .insert([articleData]);

                if (error) throw error;
                toast.success(schedule ? "Article planifié" : "Article créé");
            }

            navigate("/admin/articles");
        } catch (error: any) {
            console.error("Erreur de sauvegarde:", error);
            toast.error(`Erreur lors de la sauvegarde: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    return {
        formData,
        loading,
        saving,
        updateField,
        addTag,
        removeTag,
        saveArticle,
    };
};
