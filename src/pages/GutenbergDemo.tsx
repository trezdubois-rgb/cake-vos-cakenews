import React, { useState } from 'react';

import GutenbergEditor from '@/components/editor/GutenbergEditor';
import { Button } from '@/components/ui/button';

export const GutenbergDemo: React.FC = () => {
  const [savedContent, setSavedContent] = useState<string>('');
  const [showSaved, setShowSaved] = useState(false);

  interface Block {
    id: string;
    type: string;
    content: string;
    attributes?: Record<string, unknown>;
  }

  const handleSave = (htmlContent: string, _blocks: Block[]) => {
    setSavedContent(htmlContent);
    setShowSaved(true);
    alert('Article saved!');
  };

  const handleContentChange = (_htmlContent: string, _blocks: Block[]) => {
    // Content change handler
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gutenberg Editor Demo
          </h1>
          <p className="text-gray-600">
            Try creating an article with the WordPress Gutenberg editor. Your
            content will be saved as WordPress-compatible HTML.
          </p>
        </div>

        <GutenbergEditor
          initialContent={`
            <h2>Welcome to Gutenberg Editor</h2>
            <p>This is a fully functional WordPress Gutenberg editor integrated into your React app.</p>
            <p>You can:</p>
            <ul>
              <li>Add paragraphs, headings, lists</li>
              <li>Embed videos from YouTube, Vimeo, etc.</li>
              <li>Add code blocks with syntax highlighting</li>
              <li>Insert images and media</li>
              <li>Create quotes and other block types</li>
            </ul>
            <p>Start editing below!</p>
          `}
          onSave={handleSave}
          onContentChange={handleContentChange}
          title="Create Your Article"
          showPreview
        />

        {showSaved && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-green-900 mb-4">
              ✓ Content Saved Successfully!
            </h2>
            <div className="bg-white p-4 rounded border border-green-200 mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>WordPress-compatible HTML:</strong>
              </p>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-48">
                {savedContent}
              </pre>
            </div>
            <Button
              onClick={() => setShowSaved(false)}
              variant="outline"
              className="text-green-700 border-green-300 hover:bg-green-50"
            >
              Close
            </Button>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Features Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">✓ Block Types</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Paragraph</li>
                <li>• Headings (H1-H6)</li>
                <li>• Lists (ordered & unordered)</li>
                <li>• Quotes</li>
                <li>• Code blocks</li>
                <li>• Images</li>
                <li>• Video embeds</li>
                <li>• Audio</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">✓ Features</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Drag & drop reordering</li>
                <li>• Rich text formatting</li>
                <li>• Link insertion</li>
                <li>• WordPress-compatible output</li>
                <li>• Real-time preview</li>
                <li>• HTML export</li>
                <li>• Block library</li>
                <li>• Undo/Redo support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Integration Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              • Import the <code className="bg-blue-100 px-2 py-1 rounded">GutenbergEditor</code> component
              in your pages
            </li>
            <li>
              • Pass <code className="bg-blue-100 px-2 py-1 rounded">initialContent</code> as HTML string
            </li>
            <li>
              • Use <code className="bg-blue-100 px-2 py-1 rounded">onSave</code> callback to handle article
              saving
            </li>
            <li>
              • The HTML output is 100% WordPress-compatible and can be
              displayed anywhere
            </li>
            <li>
              • Blocks data is also available for custom processing
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GutenbergDemo;