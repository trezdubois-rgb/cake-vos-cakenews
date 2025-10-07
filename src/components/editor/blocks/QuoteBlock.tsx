import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Block } from "../BlockEditor";

interface QuoteBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const QuoteBlock = ({ block, onChange }: QuoteBlockProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Label>Citation</Label>
        <Textarea
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Votre citation..."
          className="min-h-[80px] italic"
        />
      </div>
      <div>
        <Label>Auteur (optionnel)</Label>
        <Input
          value={block.attributes?.author || ''}
          onChange={(e) => 
            onChange({ attributes: { ...block.attributes, author: e.target.value } })
          }
          placeholder="Nom de l'auteur"
        />
      </div>
    </div>
  );
};