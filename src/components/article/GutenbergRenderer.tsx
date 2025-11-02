import React from 'react';

interface GutenbergRendererProps {
  htmlContent: string;
  className?: string;
}

/**
 * Component to render TipTap-generated HTML content
 * Applies prose styles for proper rendering
 */
export const GutenbergRenderer: React.FC<GutenbergRendererProps> = ({
  htmlContent,
  className = '',
}) => {
  return (
    <div
      className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default GutenbergRenderer;