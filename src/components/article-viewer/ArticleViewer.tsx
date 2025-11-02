import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

import ArticlePage from './ArticlePage';

interface ArticleViewerProps {
  articles: Article[];
}

interface Article {
  id: string;
  title: string;
  content?: string;
  contentHtml?: string;
  [key: string]: unknown;
}

const ArticleViewer: React.FC<ArticleViewerProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hook doit être appelé avant tout return conditionnel
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (articles && articles.length > 0) {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, articles.length - 1));
      }
    },
    onSwipedRight: () => {
      if (articles && articles.length > 0) {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  // Vérification de sécurité APRÈS les hooks
  if (!articles || articles.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center text-gray-500">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Aucun article disponible</h2>
          <p>Revenez plus tard pour découvrir de nouveaux articles.</p>
        </div>
      </div>
    );
  }

  return (
    <div {...handlers} className="h-screen w-screen overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {articles.map((article) => (
          <div key={article.id} className="w-screen flex-shrink-0">
            <ArticlePage article={article} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleViewer;