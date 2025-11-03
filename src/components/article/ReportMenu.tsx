import { Flag, MessageSquare, EyeOff, UserX, Tag, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReportMenuProps {
  articleId: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  onReportContent: () => void;
  onSendFeedback: () => void;
  onHideArticle: () => void;
  onHideAuthor: () => void;
  onHideCategory: () => void;
  onHideTag: (tag: string) => void;
}

export const ReportMenu = ({
  articleId,
  authorId,
  authorName,
  category,
  tags,
  onReportContent,
  onSendFeedback,
  onHideArticle,
  onHideAuthor,
  onHideCategory,
  onHideTag
}: ReportMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-col items-center justify-center gap-0.5 text-xs text-destructive-foreground min-w-[70px]">
          <Flag size={24} />
          <span className="font-medium">Signaler</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="top" className="w-64 mb-2 bg-background z-50">
        <DropdownMenuItem onClick={onSendFeedback}>
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Donner un avis aux développeurs</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onReportContent}>
          <Flag className="mr-2 h-4 w-4" />
          <span>Signaler ce contenu</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onHideArticle}>
          <EyeOff className="mr-2 h-4 w-4" />
          <span>Masquer cet article</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onHideAuthor}>
          <UserX className="mr-2 h-4 w-4" />
          <span>Masquer {authorName}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onHideCategory}>
          <Ban className="mr-2 h-4 w-4" />
          <span>Ne plus recevoir "{category}"</span>
        </DropdownMenuItem>
        
        {tags.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {tags.slice(0, 3).map(tag => (
              <DropdownMenuItem key={tag} onClick={() => onHideTag(tag)}>
                <Tag className="mr-2 h-4 w-4" />
                <span>Ne plus voir #{tag}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
