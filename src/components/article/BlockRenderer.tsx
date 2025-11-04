// BlockRenderer now simply renders HTML content from TipTap
// Blocks are deprecated - all content is stored as HTML
interface BlockRendererProps {
  blocks?: any[];
}

export const BlockRenderer = ({ blocks }: BlockRendererProps) => {
  // Content is now rendered directly as HTML in the parent component
  // This component is kept for backward compatibility but does nothing
  return null;
};