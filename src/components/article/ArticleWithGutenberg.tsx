import { Eye, Heart, Share2 } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';

import { GutenbergRenderer } from './GutenbergRenderer';






























































































































interface ArticleWithGutenbergProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  contentHtml: string;
  heroSrc?: string;
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
}

/**
 * Component to display an article with Gutenberg-rendered content
 * Integrates seamlessly with your feed system
 */
export const ArticleWithGutenberg: React.FC<ArticleWithGutenbergProps> = ({
  title,
  excerpt,
  category,
  contentHtml,
  heroSrc,
  author,
  tags,
  engagement,
  publishedAt,
}) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Hero Image */}
      {heroSrc && (
        <div className="relative aspect-video overflow-hidden bg-gray-200">
          <img
            src={heroSrc}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <Badge variant="destructive" className="mb-3 text-xs font-bold uppercase">
          {category}
        </Badge>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-3 text-gray-900">{title}</h1>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 text-lg">{excerpt}</p>

        {/* Author Info */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold text-gray-900">{author.name}</p>
            <p className="text-sm text-gray-500">
              {new Date(publishedAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Gutenberg Content */}
        <div className="mb-8">
          <GutenbergRenderer htmlContent={contentHtml} className="mb-6" />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-gray-200">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span className="text-sm">{engagement.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart size={18} />
            <span className="text-sm">{engagement.likes.toLocaleString()} likes</span>
          </div>
          <div className="flex items-center gap-2">
            <Share2 size={18} />
            <span className="text-sm">{engagement.shares.toLocaleString()} shares</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleWithGutenberg;

