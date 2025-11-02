import { render, screen } from '@testing-library/react';

import ArticleCard, { ArticleCardProps } from './ArticleCard';

describe('ArticleCard', () => {
  const defaultProps: ArticleCardProps = {
    title: "Titre de l'article",
    author: 'Auteur',
    date: '2024-06-10',
    imageUrl: 'https://via.placeholder.com/150',
  };

  it("affiche le titre, l'auteur et la date", () => {
    render(<ArticleCard {...defaultProps} />);
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(
      screen.getByText(`Par ${defaultProps.author} — ${defaultProps.date}`)
    ).toBeInTheDocument();
  });

  it("affiche l'image si imageUrl est fourni", () => {
    render(<ArticleCard {...defaultProps} />);
    expect(screen.getByAltText(defaultProps.title)).toBeInTheDocument();
  });

  it("n'affiche pas d'image si imageUrl n'est pas fourni", () => {
    const { title, author, date } = defaultProps;
    render(<ArticleCard title={title} author={author} date={date} />);
    expect(screen.queryByAltText(title)).not.toBeInTheDocument();
  });
});
