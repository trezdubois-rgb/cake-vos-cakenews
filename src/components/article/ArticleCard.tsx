import React from 'react';

export interface ArticleCardProps {
  title: string;
  author: string;
  date: string;
  imageUrl?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, author, date, imageUrl }) => (
  <div className="article-card">
    {imageUrl && <img src={imageUrl} alt={title} />}
    <h2>{title}</h2>
    <p>
      Par {author} — {date}
    </p>
  </div>
);

export default ArticleCard;
