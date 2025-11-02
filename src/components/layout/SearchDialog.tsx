<<<<<<< HEAD
import { Search } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
=======
import { useState } from "react";
import { Search } from "lucide-react";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
<<<<<<< HEAD
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { mockFeedItems } from '@/data/mockData';

type SearchResult = {
  id: string;
  type: 'article' | 'author' | 'category' | 'tag';
=======
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockFeedItems } from "@/data/mockData";

type SearchResult = {
  id: string;
  type: "article" | "author" | "category" | "tag";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  title: string;
  subtitle?: string;
};

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
<<<<<<< HEAD
  const [query, setQuery] = useState('');
=======
  const [query, setQuery] = useState("");
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
<<<<<<< HEAD

=======
    
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search in articles
    mockFeedItems.forEach((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: item.id,
<<<<<<< HEAD
          type: 'article',
=======
          type: "article",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          title: item.title,
          subtitle: item.excerpt,
        });
      }

      // Search in authors
      if (item.author.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `author-${item.author.id}`,
<<<<<<< HEAD
          type: 'author',
          title: item.author.name,
          subtitle: 'Auteur',
=======
          type: "author",
          title: item.author.name,
          subtitle: "Auteur",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        });
      }

      // Search in categories
      if (item.category?.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `category-${item.category}`,
<<<<<<< HEAD
          type: 'category',
          title: item.category,
          subtitle: 'Catégorie',
=======
          type: "category",
          title: item.category,
          subtitle: "Catégorie",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
        });
      }

      // Search in tags
      item.tags?.forEach((tag) => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            id: `tag-${tag}`,
<<<<<<< HEAD
            type: 'tag',
            title: tag,
            subtitle: 'Tag',
=======
            type: "tag",
            title: tag,
            subtitle: "Tag",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          });
        }
      });
    });

    // Remove duplicates
    const uniqueResults = searchResults.filter(
      (result, index, self) =>
        index === self.findIndex((r) => r.id === result.id && r.type === result.type)
    );

    setResults(uniqueResults.slice(0, 20));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
<<<<<<< HEAD
      case 'article':
        return 'default';
      case 'author':
        return 'secondary';
      case 'category':
        return 'destructive';
      case 'tag':
        return 'outline';
      default:
        return 'default';
=======
      case "article":
        return "default";
      case "author":
        return "secondary";
      case "category":
        return "destructive";
      case "tag":
        return "outline";
      default:
        return "default";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 hover:bg-accent rounded-lg">
          <Search className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Recherche intelligente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <Input
            placeholder="Rechercher un article, auteur, sujet, tag..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
<<<<<<< HEAD
          />

=======
            autoFocus
          />
          
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
          <div className="flex-1 overflow-y-auto space-y-2">
            {query && results.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun résultat trouvé
              </p>
            )}
<<<<<<< HEAD

=======
            
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
            {results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="p-3 hover:bg-accent rounded-lg cursor-pointer"
                onClick={() => {
                  // Handle navigation based on result type
                  setOpen(false);
                }}
<<<<<<< HEAD
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setOpen(false);
                  }
                }}
                role="button"
                tabIndex={0}
=======
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{result.title}</h4>
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                  <Badge variant={getTypeColor(result.type)} className="shrink-0">
                    {result.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
