import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { articles } from '@/data/articles';

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  engagement: {
    views: number;
    likes: number;
    shares: number;
  };
}

export const AdminArticles: React.FC = () => {
  const navigate = useNavigate();
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    // Load articles from data
    setArticlesList(articles as Article[]);
  }, []);

  const filteredArticles = articlesList.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(
    new Set(articlesList.map((a) => a.category))
  ).sort();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      setArticlesList((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/articles/${id}/edit`);
  };

  const handleView = (id: string) => {
    navigate(`/article/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
            <p className="text-gray-600 mt-1">
              Manage your articles with Gutenberg editor
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/articles/create')}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            New Article
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                id="search-input"
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No articles found
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {article.title}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {article.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {article.engagement.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(article.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Total Articles</p>
            <p className="text-3xl font-bold text-gray-900">
              {articlesList.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Total Views</p>
            <p className="text-3xl font-bold text-gray-900">
              {articlesList
                .reduce((sum, a) => sum + a.engagement.views, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-gray-600 text-sm">Total Likes</p>
            <p className="text-3xl font-bold text-gray-900">
              {articlesList
                .reduce((sum, a) => sum + a.engagement.likes, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArticles;