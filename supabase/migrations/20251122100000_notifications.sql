-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('reply', 'like', 'system')),
    resource_id UUID,
    resource_type TEXT CHECK (resource_type IN ('comment', 'article')),
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications (mark as read)"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = recipient_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON public.notifications(recipient_id, read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Function to create notification on comment reply
CREATE OR REPLACE FUNCTION public.handle_new_comment_reply()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify if it's a reply (has parent_id)
    IF NEW.parent_id IS NOT NULL THEN
        INSERT INTO public.notifications (recipient_id, actor_id, type, resource_id, resource_type)
        SELECT 
            c.user_id, -- Parent comment author
            NEW.user_id, -- Replier
            'reply',
            NEW.article_id, -- Link to article
            'comment'
        FROM public.comments c
        WHERE c.id = NEW.parent_id
        AND c.user_id != NEW.user_id; -- Don't notify if replying to self
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comment reply
DROP TRIGGER IF EXISTS on_comment_reply ON public.comments;
CREATE TRIGGER on_comment_reply
    AFTER INSERT ON public.comments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_comment_reply();

-- Function to create notification on comment like
CREATE OR REPLACE FUNCTION public.handle_new_comment_like()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (recipient_id, actor_id, type, resource_id, resource_type)
    SELECT 
        c.user_id, -- Comment author
        NEW.user_id, -- Liker
        'like',
        c.article_id, -- Link to article
        'comment'
    FROM public.comments c
    WHERE c.id = NEW.comment_id
    AND c.user_id != NEW.user_id; -- Don't notify if liking own comment
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for comment like
DROP TRIGGER IF EXISTS on_comment_like ON public.comment_likes;
CREATE TRIGGER on_comment_like
    AFTER INSERT ON public.comment_likes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_comment_like();
