import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { ArticleWithGutenberg } from '@/components/article/ArticleWithGutenberg';
import { Button } from '@/components/ui/button';
import { articles } from '@/data/articles';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  contentHtml: string;
  slug: string;
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

export const ArticleViewGutenberg: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Article ID not provided');
      setLoading(false);
      return;
    }

    // Simulate fetching article
    const foundArticle = articles.find((a) => a.id === id) as Article | undefined;

    if (foundArticle) {
      setArticle(foundArticle);
      setError(null);
    } else {
      setError('Article not found');
    }

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Back
          </Button>

          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {error ?? 'Article not found'}
            </h1>
            <p className="text-gray-600 mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')}>Go to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        {/* Article Content */}
        <ArticleWithGutenberg {...article} />

        {/* Related Articles Section (Optional) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More in {article.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles
              .filter(
                (a) =>
                  a.category === article.category &&
                  a.id !== article.id
              )
              .slice(0, 2)
              .map((relatedArticle) => (
                <div
                  key={relatedArticle.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/article-gutenberg/${relatedArticle.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/article-gutenberg/${relatedArticle.id}`);
                    }
                  }}
                >
                  {relatedArticle.heroSrc && (
                    <div className="aspect-video overflow-hidden bg-gray-200">
                      <img
                        src={relatedArticle.heroSrc}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedArticle.excerpt}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleViewGutenberg;