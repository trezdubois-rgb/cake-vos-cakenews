import { Textarea } from "@/components/ui/textarea";
import { Block } from "../BlockEditor";

interface ParagraphBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const ParagraphBlock = ({ block, onChange }: ParagraphBlockProps) => {
  return (
    <Textarea
      value={block.content}
      onChange={(e) => onChange({ content: e.target.value })}
      placeholder="Commencez à écrire..."
      className="min-h-[100px] resize-none border-0 focus-visible:ring-0 p-0"
    />
  );
};