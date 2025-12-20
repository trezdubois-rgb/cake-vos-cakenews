import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      await handleSearch();
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search articles
      const { data: articles, error } = await supabase
        .from("articles")
        .select("id, title, excerpt, tags")
        .eq("published", true)
        .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
        .limit(20);

      if (!error && articles) {
        articles.forEach((article) => {
          searchResults.push({
            id: article.id,
            type: "article",
            title: article.title,
            subtitle: article.excerpt || undefined,
          });

          // Also search in tags
          article.tags?.forEach((tag: string) => {
            if (tag.toLowerCase().includes(query.toLowerCase())) {
              searchResults.push({
                id: `tag-${tag}`,
                type: "tag",
                title: tag,
                subtitle: "Tag",
              });
            }
          });
        });
      }

      // Remove duplicates
      const uniqueResults = searchResults.filter(
        (result, index, self) =>
          index === self.findIndex((r) => r.id === result.id && r.type === result.type)
      );

      setResults(uniqueResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
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
            placeholder="Rechercher un article, tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
          
          <div className="flex-1 overflow-y-auto space-y-2">
            {loading && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Recherche en cours...
              </p>
            )}

            {!loading && query && results.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun résultat trouvé
              </p>
            )}
            
            {results.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="p-3 hover:bg-accent rounded-lg cursor-pointer"
                onClick={() => {
                  // Handle navigation based on result type
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
