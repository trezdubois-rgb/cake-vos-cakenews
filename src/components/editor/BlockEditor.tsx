import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { ParagraphBlock } from "./blocks/ParagraphBlock";
import { HeadingBlock } from "./blocks/HeadingBlock";
import { ImageBlock } from "./blocks/ImageBlock";
import { VideoBlock } from "./blocks/VideoBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { CodeBlock } from "./blocks/CodeBlock";
import { ListBlock } from "./blocks/ListBlock";
import { AudioBlock } from "./blocks/AudioBlock";
import { BlockTypeSelector } from "./BlockTypeSelector";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'audio' | 'quote' | 'code' | 'list';
  content: any;
  attributes?: Record<string, any>;
}

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

export const BlockEditor = ({ blocks, onChange }: BlockEditorProps) => {
  const [showBlockSelector, setShowBlockSelector] = useState<number | null>(null);

  const addBlock = (index: number, type: Block['type']) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random()}`,
      type,
      content: type === 'list' ? { items: [''], ordered: false } : '',
      attributes: type === 'heading' ? { level: 2 } : {},
    };

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
    setShowBlockSelector(null);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    onChange(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    if (blocks.length > 1) {
      onChange(blocks.filter(block => block.id !== id));
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const renderBlock = (block: Block, index: number) => {
    const commonProps = {
      block,
      onChange: (updates: Partial<Block>) => updateBlock(block.id, updates),
    };

    switch (block.type) {
      case 'paragraph':
        return <ParagraphBlock {...commonProps} />;
      case 'heading':
        return <HeadingBlock {...commonProps} />;
      case 'image':
        return <ImageBlock {...commonProps} />;
      case 'video':
        return <VideoBlock {...commonProps} />;
      case 'audio':
        return <AudioBlock {...commonProps} />;
      case 'quote':
        return <QuoteBlock {...commonProps} />;
      case 'code':
        return <CodeBlock {...commonProps} />;
      case 'list':
        return <ListBlock {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="blocks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="group relative mb-2"
                    >
                      <div className="flex gap-2 items-start">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                        >
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="flex-1 border rounded-lg p-4 bg-background">
                          {renderBlock(block, index)}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBlock(block.id)}
                          className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
                          disabled={blocks.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      {/* Add Block Button */}
                      <div className="flex justify-center my-2">
                        {showBlockSelector === index ? (
                          <BlockTypeSelector
                            onSelect={(type) => addBlock(index, type)}
                            onClose={() => setShowBlockSelector(null)}
                          />
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowBlockSelector(index)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Ajouter un bloc
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};