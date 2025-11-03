import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { BlockRenderer } from "@/components/article/BlockRenderer";
import { ArticleActionsBar } from "./ArticleActionsBar";

interface Article {
  id: string;
  type: "article";
  slug: string;
  category: string;
  title: string;
  contentHtml: string;
  heroSrc: string;
  videoHls?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  engagement: {
    likes: number;
    views: number;
    shares: number;
  };
  publishedAt: string;
  content_blocks?: any[];
}

interface FullScreenArticleFeedProps {
  items: Article[];
}

export const FullScreenArticleFeed = ({ items }: FullScreenArticleFeedProps) => {
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const articleRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = articleRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              setCurrentArticleIndex(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    articleRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [items]);

  const currentArticle = items[currentArticleIndex];

  return (
    <>
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory pb-32">
        {items.map((article, index) => (
          <article
            key={article.id}
            ref={(el) => (articleRefs.current[index] = el)}
            className="min-h-screen snap-start flex flex-col"
          >
            {/* Hero Media */}
            {(article.heroSrc || article.videoHls) && (
              <div className="relative w-full aspect-video bg-muted flex-shrink-0">
                {article.videoHls ? (
                  <video
                    className="w-full h-full object-cover"
                    poster={article.heroSrc}
                    controls
                    playsInline
                  >
                    <source src={article.videoHls} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={article.heroSrc}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 px-4 py-6 overflow-y-auto">
              <Badge variant="destructive" className="mb-3 text-xs font-bold uppercase">
                {article.category}
              </Badge>

              <h1 className="text-3xl font-extrabold leading-tight mb-4 text-foreground">
                {article.title}
              </h1>

              <div className="flex items-center gap-3 mb-6">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full bg-muted ring-2 ring-border"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">
                    {article.author.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString("fr-FR")}
                    </span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{article.engagement.views.toLocaleString()} vues</span>
                    </div>
                  </div>
                </div>
              </div>

              {article.content_blocks && article.content_blocks.length > 0 ? (
                <BlockRenderer blocks={article.content_blocks} />
              ) : (
                <div
                  className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-p:text-foreground/90 prose-p:leading-relaxed prose-a:text-primary prose-a:font-semibold prose-strong:text-foreground prose-strong:font-bold"
                  dangerouslySetInnerHTML={{ __html: article.contentHtml }}
                />
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/50">
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-medium px-3 py-1.5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Actions Bar for Current Article */}
      {currentArticle && (
        <ArticleActionsBar
          articleId={currentArticle.id}
          authorId={currentArticle.author.id}
          authorName={currentArticle.author.name}
          category={currentArticle.category}
          tags={currentArticle.tags}
          initialLikeCount={currentArticle.engagement.likes}
        />
      )}
    </>
  );
};
