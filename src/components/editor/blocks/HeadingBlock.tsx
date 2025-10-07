import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Block } from "../BlockEditor";

interface HeadingBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const HeadingBlock = ({ block, onChange }: HeadingBlockProps) => {
  const level = block.attributes?.level || 2;

  return (
    <div className="space-y-2">
      <Select
        value={level.toString()}
        onValueChange={(value) => 
          onChange({ attributes: { ...block.attributes, level: parseInt(value) } })
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">H1</SelectItem>
          <SelectItem value="2">H2</SelectItem>
          <SelectItem value="3">H3</SelectItem>
          <SelectItem value="4">H4</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder={`Titre de niveau ${level}`}
        className={`font-bold border-0 focus-visible:ring-0 p-0 ${
          level === 1 ? 'text-4xl' :
          level === 2 ? 'text-3xl' :
          level === 3 ? 'text-2xl' : 'text-xl'
        }`}
      />
    </div>
  );
};