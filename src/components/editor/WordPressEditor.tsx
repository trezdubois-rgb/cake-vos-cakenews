import { Plus, Type, Image, List, Quote, Code, Video, Audio, Settings, Eye, Save, Upload } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'video' | 'audio' | 'quote' | 'code' | 'list' | 'gallery' | 'poll' | 'quiz' | 'divider' | 'spacer' | 'button' | 'columns' | 'cover' | 'media-text' | 'embed' | 'table' | 'file' | 'html';
  content: Record<string, unknown>;
  settings?: Record<string, unknown>;
}

interface WordPressEditorProps {
  initialContent?: Block[];
  onSave: (content: Block[]) => void;
  onPublish: (content: Block[]) => void;
  postType?: 'post' | 'page' | 'quiz' | 'poll' | 'list' | 'gallery';
}

const WordPressEditor: React.FC<WordPressEditorProps> = ({ 
  initialContent = [], 
  onSave, 
  onPublish,
  _postType = 'post'
}) => {
  const [blocks, setBlocks] = useState<Block[]>(initialContent);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postExcerpt, setPostExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [postStatus, setPostStatus] = useState<'draft' | 'publish' | 'private'>('draft');
  const [_postCategories, _setPostCategories] = useState<string[]>([]);
  const [_postTags, _setPostTags] = useState<string[]>([]);
  const [allowComments, setAllowComments] = useState(true);
  const [allowPingbacks, setAllowPingbacks] = useState(true);
  const [_postAuthor, _setPostAuthor] = useState('current-user');
  const [_postDate, _setPostDate] = useState(new Date().toISOString().slice(0, 16));

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      settings: getDefaultSettings(type)
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, content: Record<string, unknown>, settings?: Record<string, unknown>) => {
    setBlocks(blocks.map(block => 
      block.id === id 
        ? { ...block, content: { ...block.content, ...content }, settings: settings ? { ...block.settings, ...settings } : block.settings }
        : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (index === -1) return;
    
    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < blocks.length) {
      // eslint-disable-next-line security/detect-object-injection
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'paragraph':
        return { text: 'Commencez à écrire...' };
      case 'heading':
        return { text: 'Titre', level: 2 };
      case 'image':
        return { url: '', alt: '', caption: '', link: '', align: 'center', size: 'large' };
      case 'video':
        return { url: '', caption: '', autoplay: false, loop: false, muted: false };
      case 'audio':
        return { url: '', caption: '', autoplay: false, loop: false };
      case 'quote':
        return { text: '', citation: '', align: 'left' };
      case 'code':
        return { code: '', language: 'javascript' };
      case 'list':
        return { items: ['Item 1', 'Item 2'], ordered: false };
      case 'gallery':
        return { images: [], columns: 3, linkTo: 'none', size: 'medium' };
      case 'poll':
        return { question: '', options: ['Option 1', 'Option 2'], allowMultiple: false };
      case 'quiz':
        return { title: '', questions: [] };
      case 'button':
        return { text: 'Cliquez ici', url: '', style: 'primary', size: 'medium', align: 'left' };
      case 'columns':
        return { columns: 2, content: [[], []] };
      case 'cover':
        return { image: '', title: '', subtitle: '', overlay: true, align: 'center' };
      case 'media-text':
        return { media: '', mediaPosition: 'left', content: '' };
      case 'embed':
        return { url: '', type: 'auto' };
      case 'table':
        return { rows: 3, cols: 3, data: Array(3).fill(null).map(() => Array(3).fill('')) };
      case 'file':
        return { file: '', showDownloadButton: true };
      case 'html':
        return { html: '' };
      default:
        return {};
    }
  };

  const getDefaultSettings = (type: Block['type']) => {
    switch (type) {
      case 'image':
        return { rounded: false, shadow: false, border: false };
      case 'video':
        return { controls: true, responsive: true };
      case 'quote':
        return { style: 'default', large: false };
      case 'code':
        return { lineNumbers: true, copyButton: true };
      case 'button':
        return { openInNewTab: false, noFollow: false };
      default:
        return {};
    }
  };

  const blockTypes = [
    { type: 'paragraph', icon: Type, label: 'Paragraphe' },
    { type: 'heading', icon: Type, label: 'Titre' },
    { type: 'image', icon: Image, label: 'Image' },
    { type: 'video', icon: Video, label: 'Vidéo' },
    { type: 'audio', icon: Audio, label: 'Audio' },
    { type: 'quote', icon: Quote, label: 'Citation' },
    { type: 'code', icon: Code, label: 'Code' },
    { type: 'list', icon: List, label: 'Liste' },
    { type: 'gallery', icon: Image, label: 'Galerie' },
    { type: 'poll', icon: List, label: 'Sondage' },
    { type: 'quiz', icon: List, label: 'Quiz' },
    { type: 'button', icon: Type, label: 'Bouton' },
    { type: 'columns', icon: Type, label: 'Colonnes' },
    { type: 'cover', icon: Image, label: 'Couverture' },
    { type: 'media-text', icon: Type, label: 'Média & Texte' },
    { type: 'embed', icon: Code, label: 'Embed' },
    { type: 'table', icon: List, label: 'Tableau' },
    { type: 'file', icon: Upload, label: 'Fichier' },
    { type: 'html', icon: Code, label: 'HTML' },
  ];

  const renderBlockEditor = (block: Block) => {
    // Implementation pour chaque type de bloc
    switch (block.type) {
      case 'paragraph':
        return (
          <Textarea
            value={block.content.text}
            onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            placeholder="Écrivez votre paragraphe..."
            className="min-h-[100px]"
          />
        );
      case 'heading':
        return (
          <div className="space-y-2">
            <Select value={block.content.level.toString()} onValueChange={(value) => updateBlock(block.id, { level: parseInt(value) })}>
              <SelectTrigger>
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">H1</SelectItem>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
                <SelectItem value="5">H5</SelectItem>
                <SelectItem value="6">H6</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={block.content.text}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
              placeholder="Titre"
            />
          </div>
        );
      case 'image':
        return (
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => updateBlock(block.id, { url: e.target?.result });
                  reader.readAsDataURL(file);
                }
              }}
            />
            {block.content.url && (
              <img src={block.content.url} alt="Preview" className="max-w-full h-auto rounded" />
            )}
            <Input
              value={block.content.alt}
              onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
              placeholder="Texte alternatif"
            />
            <Input
              value={block.content.caption}
              onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              placeholder="Légende"
            />
          </div>
        );
      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
            Éditeur pour {block.type} - À implémenter
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Block Library */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">CAKENEWS Éditeur</h2>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <Label>Titre du post</Label>
            <Input
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="Titre du post"
            />
          </div>
          
          <div>
            <Label>Extrait</Label>
            <Textarea
              value={postExcerpt}
              onChange={(e) => setPostExcerpt(e.target.value)}
              placeholder="Résumé du post"
              rows={3}
            />
          </div>

          <div>
            <Label>Image à la une</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => setFeaturedImage(e.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
            {featuredImage && (
              <img src={featuredImage} alt="Featured" className="mt-2 max-w-full h-auto rounded" />
            )}
          </div>

          <Tabs defaultValue="blocks" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="blocks">Blocs</TabsTrigger>
              <TabsTrigger value="document">Document</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blocks" className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {blockTypes.map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock(type as Block['type'])}
                    className="h-auto py-2 flex-col gap-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="document" className="space-y-4">
              <div>
                <Label>Statut</Label>
                <Select value={postStatus} onValueChange={(value) => setPostStatus(value as 'draft' | 'publish' | 'private')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="publish">Publié</SelectItem>
                    <SelectItem value="private">Privé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="comments">Commentaires</Label>
                <Switch
                  id="comments"
                  checked={allowComments}
                  onCheckedChange={setAllowComments}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="pingbacks">Rétroliens</Label>
                <Switch
                  id="pingbacks"
                  checked={allowPingbacks}
                  onCheckedChange={setAllowPingbacks}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={isPreview ? "outline" : "default"}
              size="sm"
              onClick={() => setIsPreview(false)}
            >
              <Settings className="w-4 h-4 mr-1" />
              Éditer
            </Button>
            <Button
              variant={isPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreview(true)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Aperçu
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave(blocks)}
            >
              <Save className="w-4 h-4 mr-1" />
              Enregistrer
            </Button>
            <Button
              size="sm"
              onClick={() => onPublish(blocks)}
            >
              Publier
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isPreview ? (
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{postTitle ?? 'Titre du post'}</h1>
              {featuredImage && (
                <img src={featuredImage} alt="Featured" className="w-full h-auto rounded-lg mb-6" />
              )}
              <div className="prose prose-lg max-w-none">
                {blocks.map((block) => (
                  <div key={block.id} className="mb-6">
                    {/* Preview rendering for each block type */}
                    <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                      Aperçu: {block.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {blocks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Type className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Commencez à écrire</h3>
                  <p className="text-gray-500 mb-4">Ajoutez votre premier bloc pour commencer à créer votre contenu</p>
                  <Button onClick={() => addBlock('paragraph')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un bloc
                  </Button>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <Card
                    key={block.id}
                    className={`p-4 ${selectedBlock === block.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedBlock(block.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700 capitalize">{block.type}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(block.id, 'up');
                          }}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(block.id, 'down');
                          }}
                          disabled={index === blocks.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBlock(block.id);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    {renderBlockEditor(block)}
                  </Card>
                ))
              )}
              
              {blocks.length > 0 && (
                <div className="text-center py-8">
                  <Button variant="outline" onClick={() => addBlock('paragraph')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un bloc
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordPressEditor;