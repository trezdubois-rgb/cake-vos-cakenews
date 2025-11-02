import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Block } from "../BlockEditor";

interface CodeBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const CodeBlock = ({ block, onChange }: CodeBlockProps) => {
  return (
    <div className="space-y-3">
      <div>
        <Label>Langage (optionnel)</Label>
        <Input
          value={block.attributes?.language || ''}
          onChange={(e) => 
            onChange({ attributes: { ...block.attributes, language: e.target.value } })
          }
          placeholder="javascript, python, etc."
        />
      </div>
      <div>
        <Label>Code</Label>
        <Textarea
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Votre code..."
          className="min-h-[150px] font-mono text-sm"
        />
      </div>
    </div>
  );
};