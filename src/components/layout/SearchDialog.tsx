import { useState } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockFeedItems } from "@/data/mockData";

type SearchResult = {
  id: string;
  type: "article" | "author" | "category" | "tag";
  title: string;
  subtitle?: string;
};

export const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];

    mockFeedItems.forEach((item) => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: item.id,
          type: "article",
          title: item.title,
          subtitle: item.excerpt,
        });
      }

      if (item.author.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `author-${item.author.id}`,
          type: "author",
          title: item.author.name,
          subtitle: "Auteur",
        });
      }

      if (item.category?.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `category-${item.category}`,
          type: "category",
          title: item.category,
          subtitle: "Catégorie",
        });
      }

      item.tags?.forEach((tag) => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          searchResults.push({
            id: `tag-${tag}`,
            type: "tag",
            title: tag,
            subtitle: "Tag",
          });
        }
      });
    });

    const uniqueResults = searchResults.filter(
      (result, index, self) =>
        index === self.findIndex((r) => r.id === result.id && r.type === result.type)
    );

    setResults(uniqueResults.slice(0, 20));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
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
            autoFocus
          />
          
          <div className="flex-1 overflow-y-auto space-y-2">
            {query && results.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun résultat trouvé
              </p>
            )}
            
            {results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="p-3 hover:bg-accent rounded-lg cursor-pointer"
                onClick={() => {
                  setOpen(false);
                }}
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
