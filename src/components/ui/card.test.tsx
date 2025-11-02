import { render } from '@testing-library/react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';

import '@testing-library/jest-dom';

describe('Card component', () => {
  it('renders Card with children and className', () => {
    const { getByText, container } = render(
      <Card className="test-class">
        <span>Child content</span>
      </Card>
    );
    expect(getByText('Child content')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('test-class');
  });

  it('renders CardHeader, CardTitle, CardDescription, CardContent, CardFooter', () => {
    const { getByText } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
    );
    expect(getByText('Title')).toBeInTheDocument();
    expect(getByText('Description')).toBeInTheDocument();
    expect(getByText('Content')).toBeInTheDocument();
    expect(getByText('Footer')).toBeInTheDocument();
  });

  it('applies additional props correctly', () => {
    const { container } = render(
      <Card data-testid="card-test">
        <span>Test</span>
      </Card>
    );
    expect(container.firstChild).toHaveAttribute('data-testid', 'card-test');
  });
});
