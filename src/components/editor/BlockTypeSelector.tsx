import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Type, 
  Heading, 
  Image, 
  Video, 
  Quote, 
  Code, 
  List,
  X
} from "lucide-react";
import { Block } from "./BlockEditor";

interface BlockTypeSelectorProps {
  onSelect: (type: Block['type']) => void;
  onClose: () => void;
}

export const BlockTypeSelector = ({ onSelect, onClose }: BlockTypeSelectorProps) => {
  const blockTypes = [
    { type: 'paragraph' as const, icon: Type, label: 'Paragraphe' },
    { type: 'heading' as const, icon: Heading, label: 'Titre' },
    { type: 'image' as const, icon: Image, label: 'Image' },
    { type: 'video' as const, icon: Video, label: 'Vidéo' },
    { type: 'quote' as const, icon: Quote, label: 'Citation' },
    { type: 'code' as const, icon: Code, label: 'Code' },
    { type: 'list' as const, icon: List, label: 'Liste' },
  ];

  return (
    <Card className="p-2 shadow-lg border-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-sm font-medium">Choisir un bloc</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {blockTypes.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            type="button"
            variant="outline"
            onClick={() => onSelect(type)}
            className="flex flex-col gap-1 h-auto p-3"
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};