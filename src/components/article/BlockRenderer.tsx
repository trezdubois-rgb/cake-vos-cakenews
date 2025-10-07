import { Block } from "../editor/BlockEditor";

interface BlockRendererProps {
  blocks: Block[];
}

export const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p key={block.id} className="text-foreground/90 leading-relaxed mb-4">
            {block.content}
          </p>
        );

      case 'heading': {
        const level = block.attributes?.level || 2;
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
        const sizeClasses = {
          1: 'text-4xl',
          2: 'text-3xl',
          3: 'text-2xl',
          4: 'text-xl',
        }[level];

        return (
          <HeadingTag 
            key={block.id} 
            className={`font-bold text-foreground ${sizeClasses} mb-4 mt-6`}
          >
            {block.content}
          </HeadingTag>
        );
      }

      case 'image':
        return (
          <figure key={block.id} className="my-6">
            <img
              src={block.content}
              alt={block.attributes?.caption || "Image"}
              className="w-full rounded-lg"
            />
            {block.attributes?.caption && (
              <figcaption className="text-sm text-muted-foreground text-center mt-2 italic">
                {block.attributes.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'video': {
        const platform = block.attributes?.platform || 'youtube';
        const getEmbedUrl = (url: string) => {
          if (!url) return '';
          
          try {
            switch (platform) {
              case 'youtube': {
                const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
                return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
              }
              case 'tiktok': {
                const videoId = url.match(/\/video\/(\d+)/)?.[1];
                return videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : url;
              }
              case 'vimeo': {
                const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
                return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
              }
              case 'facebook':
                return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&width=640`;
              default:
                return url;
            }
          } catch {
            return url;
          }
        };

        const embedUrl = getEmbedUrl(block.content);

        return (
          <div key={block.id} className="aspect-video rounded-lg overflow-hidden bg-muted my-6">
            <iframe
              src={embedUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      case 'quote':
        return (
          <blockquote 
            key={block.id} 
            className="border-l-4 border-primary pl-6 py-4 my-6 italic text-lg"
          >
            <p className="text-foreground/90 mb-2">{block.content}</p>
            {block.attributes?.author && (
              <footer className="text-sm text-muted-foreground not-italic">
                — {block.attributes.author}
              </footer>
            )}
          </blockquote>
        );

      case 'code':
        return (
          <div key={block.id} className="my-6">
            {block.attributes?.language && (
              <div className="bg-muted px-4 py-2 rounded-t-lg text-sm text-muted-foreground font-mono">
                {block.attributes.language}
              </div>
            )}
            <pre className={`bg-muted p-4 ${block.attributes?.language ? 'rounded-b-lg' : 'rounded-lg'} overflow-x-auto`}>
              <code className="text-sm font-mono">{block.content}</code>
            </pre>
          </div>
        );

      case 'list': {
        const items = block.content?.items || [];
        const ordered = block.content?.ordered || false;
        const ListTag = ordered ? 'ol' : 'ul';

        return (
          <ListTag 
            key={block.id} 
            className={`my-4 space-y-2 ${ordered ? 'list-decimal' : 'list-disc'} list-inside`}
          >
            {items.map((item: string, i: number) => (
              <li key={i} className="text-foreground/90">
                {item}
              </li>
            ))}
          </ListTag>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="prose prose-lg max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};