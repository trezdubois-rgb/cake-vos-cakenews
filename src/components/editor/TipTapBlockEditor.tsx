import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import { Audio } from './extensions/AudioExtension';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Image as ImageIcon,
  Highlighter,
  Undo,
  Redo,
  Code,
  Video,
  Music,
  Type,
  Plus
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

interface TipTapBlockEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const TipTapBlockEditor = ({ content, onChange }: TipTapBlockEditorProps) => {
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
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
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-lg my-4',
        },
      }),
      Audio,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'Titre...';
          }
          return 'Tapez "/" pour les commandes ou commencez à écrire...';
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[500px] p-4 bg-background text-foreground',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          if (event.key === '/') {
            setTimeout(() => setShowBlockMenu(true), 0);
          }
          if (event.key === 'Escape') {
            setShowBlockMenu(false);
          }
          return false;
        },
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL de l\'image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addAudio = () => {
    const url = window.prompt('URL de l\'audio:');
    if (url) {
      editor.chain().focus().setAudio({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('URL de la vidéo YouTube:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const addCustomVideo = () => {
    const url = window.prompt('URL de la vidéo (TikTok, Vimeo, Facebook, etc.):');
    if (url) {
      let embedUrl = url;
      let height = 400;
      
      if (url.includes('tiktok.com')) {
        const videoId = url.match(/\/video\/(\d+)/)?.[1];
        if (videoId) embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
        height = 600;
      } else if (url.includes('vimeo.com')) {
        const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
        if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
      } else if (url.includes('facebook.com')) {
        embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&width=640`;
      }
      
      const iframeHtml = `<div class="video-wrapper my-4"><iframe src="${embedUrl}" width="100%" height="${height}" frameborder="0" allowfullscreen class="rounded-lg"></iframe></div>`;
      editor.chain().focus().insertContent(iframeHtml).run();
    }
  };

  const insertBlock = (type: string) => {
    setShowBlockMenu(false);
    
    switch (type) {
      case 'paragraph':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading1':
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
      case 'image':
        addImage();
        break;
      case 'video':
        addYoutubeVideo();
        break;
      case 'audio':
        addAudio();
        break;
      case 'quote':
        editor.chain().focus().toggleBlockquote().run();
        break;
      case 'code':
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
    }
  };

  const blockTypes = [
    { type: 'paragraph', icon: Type, label: 'Paragraphe' },
    { type: 'heading1', icon: Heading1, label: 'Titre 1' },
    { type: 'heading2', icon: Heading2, label: 'Titre 2' },
    { type: 'heading3', icon: Heading3, label: 'Titre 3' },
    { type: 'image', icon: ImageIcon, label: 'Image' },
    { type: 'video', icon: Video, label: 'Vidéo' },
    { type: 'audio', icon: Music, label: 'Audio' },
    { type: 'quote', icon: Quote, label: 'Citation' },
    { type: 'code', icon: Code, label: 'Code' },
    { type: 'bulletList', icon: List, label: 'Liste' },
    { type: 'orderedList', icon: ListOrdered, label: 'Liste numérotée' },
  ];

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {/* Toolbar fixe en haut */}
      <div className="sticky top-0 z-10 border-b p-2 flex flex-wrap gap-1 bg-muted/30 backdrop-blur-sm">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowBlockMenu(!showBlockMenu)}
          title="Ajouter un bloc"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-muted' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-muted' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-muted' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-muted' : ''}
        >
          <Link2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          title="Ajouter une image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addYoutubeVideo}
          title="Ajouter une vidéo YouTube"
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addAudio}
          title="Ajouter un audio"
        >
          <Music className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive('highlight') ? 'bg-muted' : ''}
          title="Surligner"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Éditeur */}
      <div className="relative">
        <EditorContent editor={editor} />
        
        {/* Menu de blocs en bas */}
        {showBlockMenu && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
            <Card className="p-3 shadow-2xl max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Insérer un bloc</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBlockMenu(false)}
                >
                  <span className="text-xs">Fermer</span>
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {blockTypes.map(({ type, icon: Icon, label }) => (
                  <Button
                    key={type}
                    type="button"
                    variant="outline"
                    onClick={() => insertBlock(type)}
                    className="flex flex-col gap-1 h-auto p-2"
                    size="sm"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
