import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import YouTube from '@tiptap/extension-youtube';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Save,
  Eye,
  Code as CodeIcon,
  Maximize2,
  Minimize2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
} from 'lucide-react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import MediaGallery from './MediaGallery';

interface Block {
  id?: string;
  type: string;
  content?: unknown;
}

interface GutenbergEditorProps {
  initialContent?: string;
  onSave?: (htmlContent: string, blocks?: Block[]) => void;
  onContentChange?: (htmlContent: string, blocks?: Block[]) => void;
  onPublish?: (htmlContent: string, blocks?: Block[]) => void;
  title?: string;
  showPreview?: boolean;
}

export const GutenbergEditor: React.FC<GutenbergEditorProps> = ({
  initialContent = '',
  onSave,
  onContentChange,
  onPublish,
  title = 'Article Editor',
  showPreview = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'code'>('editor');
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      YouTube.configure({
        width: 640,
        height: 480,
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Convert HTML to simple blocks structure for compatibility
      const blocks: Block[] = [];
      onContentChange?.(html, blocks);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  const handleSave = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const blocks: Block[] = [];
    onSave?.(html, blocks);
  }, [editor, onSave]);

  const handlePublish = useCallback(() => {
    if (!editor) return;
    const html = editor.getHTML();
    const blocks: Block[] = [];
    onPublish?.(html, blocks);
  }, [editor, onPublish]);

  const handleImageSelect = (url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    setIsMediaGalleryOpen(false);
  };

  const addImage = () => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
  };

  const addLink = () => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
  };

  const addYouTube = () => {
    if (!editor || !youtubeUrl) return;
    const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (videoId) {
      editor.chain().focus().setYoutubeVideo({ src: `https://www.youtube.com/embed/${videoId}` }).run();
      setYoutubeUrl('');
    }
  };

  const htmlOutput = useMemo(() => {
    return editor?.getHTML() ?? '';
  }, [editor]);

  const wordCount = useMemo(() => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.split(/\s+/).filter(Boolean).length;
  }, [editor]);

  const characterCount = useMemo(() => {
    if (!editor) return 0;
    return editor.getText().length;
  }, [editor]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Initialisation de l'éditeur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`gutenberg-editor-wrapper ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      {/* Toolbar */}
      <div className="border-b bg-card sticky top-0 z-40">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{title}</h2>
            <span className="text-sm text-muted-foreground">{wordCount} mots</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Formatting Buttons */}
            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <Button
                variant={editor.isActive('bold') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Gras"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('italic') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italique"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('highlight') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                title="Surligner"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <Button
                variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Titre 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Titre 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Titre 3"
              >
                <Heading3 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <Button
                variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Liste à puces"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Liste numérotée"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                title="Citation"
              >
                <Quote className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1 border-r pr-2 mr-2">
              <Button
                variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                title="Align gauche"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                title="Centrer"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                title="Align droit"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            <Dialog open={isMediaGalleryOpen} onOpenChange={setIsMediaGalleryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" title="Ajouter média">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Média
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Bibliothèque Média</DialogTitle>
                </DialogHeader>
                <MediaGallery onSelect={handleImageSelect} />
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" title="Ajouter lien">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un lien</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="https://example.com"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <Button onClick={addLink} className="w-full">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" title="Ajouter YouTube">
                  <Youtube className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une vidéo YouTube</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  <Button onClick={addYouTube} className="w-full">
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            <div className="h-6 w-px bg-border" />

            <Button variant="ghost" size="sm" onClick={handleSave} title="Sauvegarder">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>

            {onPublish && (
              <Button size="sm" onClick={handlePublish} className="bg-primary hover:bg-primary/90" title="Publier">
                Publier
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        {showPreview && (
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'editor' | 'preview' | 'code')}
            className="w-full"
          >
            <TabsList className="w-full justify-start rounded-none border-t h-auto p-0">
              <TabsTrigger
                value="editor"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Éditeur
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <Eye className="h-4 w-4 mr-2" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                <CodeIcon className="h-4 w-4 mr-2" />
                HTML
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Editor Content */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-140px)] overflow-auto' : ''}`}>
        {showPreview ? (
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="editor" className="mt-0 p-4">
              <EditorContent editor={editor} className="min-h-[400px]" />
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="max-w-4xl mx-auto p-8">
                <Card className="p-8">
                  <div
                    className="prose prose-lg max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: htmlOutput }}
                  />
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="code" className="mt-0">
              <div className="max-w-6xl mx-auto p-8">
                <Card className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">HTML Output</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(htmlOutput);
                      }}
                    >
                      Copier HTML
                    </Button>
                  </div>
                  <textarea
                    readOnly
                    value={htmlOutput}
                    rows={20}
                    className="w-full p-4 border rounded-lg font-mono text-sm bg-muted"
                    aria-label="HTML Output"
                  />
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-4">
            <EditorContent editor={editor} className="min-h-[400px]" />
          </div>
        )}

        {/* Info Sidebar */}
        <div className="border-t bg-muted/30 p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex gap-4">
              <span>Mots: {wordCount}</span>
              <span>Caractères: {characterCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GutenbergEditor;
