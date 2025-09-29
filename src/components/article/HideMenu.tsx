import { EyeOff, UserX, Tag, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HideMenuProps {
  articleId: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  onHideArticle: () => void;
  onHideAuthor: () => void;
  onHideCategory: () => void;
  onHideTag: (tag: string) => void;
}

export const HideMenu = ({
  articleId,
  authorId,
  authorName,
  category,
  tags,
  onHideArticle,
  onHideAuthor,
  onHideCategory,
  onHideTag
}: HideMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-xs">
          <EyeOff size={20} />
          <span>Masquer</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuItem onClick={onHideArticle}>
          <EyeOff className="mr-2 h-4 w-4" />
          <span>Masquer cet article</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onHideAuthor}>
          <UserX className="mr-2 h-4 w-4" />
          <span>Masquer tous les articles de {authorName}</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onHideCategory}>
          <Ban className="mr-2 h-4 w-4" />
          <span>Ne plus recevoir "{category}"</span>
        </DropdownMenuItem>
        
        {tags.length > 0 && (
          <>
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
