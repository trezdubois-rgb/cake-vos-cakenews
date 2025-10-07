import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Block } from "../BlockEditor";

interface ListBlockProps {
  block: Block;
  onChange: (updates: Partial<Block>) => void;
}

export const ListBlock = ({ block, onChange }: ListBlockProps) => {
  const items = block.content?.items || [''];
  const ordered = block.content?.ordered || false;

  const addItem = () => {
    onChange({ 
      content: { 
        ...block.content, 
        items: [...items, ''] 
      } 
    });
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      onChange({ 
        content: { 
          ...block.content, 
          items: items.filter((_: string, i: number) => i !== index) 
        } 
      });
    }
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange({ content: { ...block.content, items: newItems } });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={ordered}
          onCheckedChange={(checked) => 
            onChange({ content: { ...block.content, ordered: checked } })
          }
        />
        <Label>Liste ordonnée</Label>
      </div>

      <div className="space-y-2">
        {items.map((item: string, index: number) => (
          <div key={index} className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground w-6">
              {ordered ? `${index + 1}.` : '•'}
            </span>
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Élément ${index + 1}`}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
              disabled={items.length === 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
      >
        <Plus className="h-4 w-4 mr-1" />
        Ajouter un élément
      </Button>
    </div>
  );
};