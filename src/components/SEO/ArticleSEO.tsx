import { SEO } from './SEO';

interface ArticleSEOProps {
  title: string;
  excerpt: string;
  heroImage?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  tags?: string[];
  slug: string;
}

export const ArticleSEO = ({
  title,
  excerpt,
  heroImage,
  publishedAt,
  updatedAt,
  authorName,
  tags = [],
  slug,
}: ArticleSEOProps) => {
  return (
    <SEO
      title={title}
      description={excerpt}
      image={heroImage}
      url={`/article/${slug}`}
      type="article"
      publishedTime={publishedAt}
      modifiedTime={updatedAt}
      author={authorName}
      tags={tags}
    />
  );
};
