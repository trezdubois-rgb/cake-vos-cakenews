import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CommentInputProps {
  onSubmit: (content: string) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
  submitting?: boolean;
}

export const CommentInput = ({
  onSubmit,
  placeholder = "Écrivez votre commentaire...",
  autoFocus = false,
  onCancel,
  submitting = false,
}: CommentInputProps) => {
  const [content, setContent] = useState("");
  const maxLength = 2000;

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;
    
    await onSubmit(content);
    setContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={submitting}
        className="min-h-[80px] resize-none"
        maxLength={maxLength}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}/{maxLength}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={submitting}
            >
              Annuler
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              "Publier"
            )}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Astuce : Ctrl+Entrée pour publier rapidement
      </p>
    </div>
  );
};
