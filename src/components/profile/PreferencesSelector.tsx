import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PreferencesSelectorProps {
  userId: string;
  preferences: {
    tags: string[];
    authors: string[];
    categories: string[];
    formats: string[];
  };
  onPreferencesChange: (preferences: {
    tags: string[];
    authors: string[];
    categories: string[];
    formats: string[];
  }) => void;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Author {
  id: string;
  display_name: string | null;
}

interface AvailableData {
  categories: Category[];
  tags: string[];
  authors: Author[];
  formats: string[];
}

export const PreferencesSelector = ({
  userId,
  preferences,
  onPreferencesChange,
}: PreferencesSelectorProps) => {
  const [availableData, setAvailableData] = useState<AvailableData>({
    categories: [],
    tags: [],
    authors: [],
    formats: [],
  });
  const [loading, setLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableData();
  }, []);

  const fetchAvailableData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name, slug")
        .order("display_order");

      if (categoriesError) throw categoriesError;

      // Fetch all unique tags from articles
      const { data: articlesData, error: articlesError } = await supabase
        .from("articles")
        .select("tags, author_id")
        .eq("published", true);

      if (articlesError) throw articlesError;

      // Extract unique tags
      const allTags = new Set<string>();
      const authorIds = new Set<string>();
      
      articlesData?.forEach((article: any) => {
        if (article.tags) {
          article.tags.forEach((tag: string) => allTags.add(tag));
        }
        if (article.author_id) {
          authorIds.add(article.author_id);
        }
      });

      // Fetch author profiles
      const { data: authorsData, error: authorsError } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", Array.from(authorIds));

      if (authorsError) throw authorsError;

      // Define available formats (media types)
      const formats = ["article", "video", "podcast", "gallery"];

      setAvailableData({
        categories: categoriesData || [],
        tags: Array.from(allTags).sort(),
        authors: (authorsData || []).filter((a: Author) => a.display_name),
        formats,
      });
    } catch (error) {
      console.error("Error fetching available data:", error);
      toast.error("Erreur lors du chargement des options");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    const updated = preferences.categories.includes(categoryName)
      ? preferences.categories.filter((c) => c !== categoryName)
      : [...preferences.categories, categoryName];
    onPreferencesChange({ ...preferences, categories: updated });
  };

  const toggleTag = (tag: string) => {
    const updated = preferences.tags.includes(tag)
      ? preferences.tags.filter((t) => t !== tag)
      : [...preferences.tags, tag];
    onPreferencesChange({ ...preferences, tags: updated });
  };

  const toggleAuthor = (authorId: string) => {
    const updated = preferences.authors.includes(authorId)
      ? preferences.authors.filter((a) => a !== authorId)
      : [...preferences.authors, authorId];
    onPreferencesChange({ ...preferences, authors: updated });
  };

  const toggleFormat = (format: string) => {
    const updated = preferences.formats.includes(format)
      ? preferences.formats.filter((f) => f !== format)
      : [...preferences.formats, format];
    onPreferencesChange({ ...preferences, formats: updated });
  };

  const getAuthorName = (authorId: string) => {
    const author = availableData.authors.find((a) => a.id === authorId);
    return author?.display_name || "Auteur inconnu";
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      article: "Article",
      video: "Vidéo",
      podcast: "Podcast",
      gallery: "Galerie",
    };
    return labels[format] || format;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Catégories</h3>
          <span className="text-xs text-muted-foreground">
            {preferences.categories.length} sélectionnée(s)
          </span>
        </div>
        
        <Popover open={openPopover === "categories"} onOpenChange={(open) => setOpenPopover(open ? "categories" : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {preferences.categories.length > 0
                ? `${preferences.categories.length} catégorie(s)`
                : "Sélectionner des catégories"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover border border-border z-50" align="start">
            <Command>
              <CommandInput placeholder="Rechercher une catégorie..." />
              <CommandList>
                <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                <CommandGroup>
                  {availableData.categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.name}
                      onSelect={() => toggleCategory(category.name)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          preferences.categories.includes(category.name)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {category.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {preferences.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferences.categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="gap-1">
                {cat}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => toggleCategory(cat)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Sujets / Tags</h3>
          <span className="text-xs text-muted-foreground">
            {preferences.tags.length} sélectionné(s)
          </span>
        </div>
        
        <Popover open={openPopover === "tags"} onOpenChange={(open) => setOpenPopover(open ? "tags" : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {preferences.tags.length > 0
                ? `${preferences.tags.length} tag(s)`
                : "Sélectionner des sujets"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover border border-border z-50" align="start">
            <Command>
              <CommandInput placeholder="Rechercher un tag..." />
              <CommandList>
                <CommandEmpty>Aucun tag trouvé.</CommandEmpty>
                <CommandGroup>
                  {availableData.tags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => toggleTag(tag)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          preferences.tags.includes(tag)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {preferences.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferences.tags.map((tag) => (
              <Badge key={tag} variant="default" className="gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Authors Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Auteurs</h3>
          <span className="text-xs text-muted-foreground">
            {preferences.authors.length} sélectionné(s)
          </span>
        </div>
        
        <Popover open={openPopover === "authors"} onOpenChange={(open) => setOpenPopover(open ? "authors" : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {preferences.authors.length > 0
                ? `${preferences.authors.length} auteur(s)`
                : "Sélectionner des auteurs"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover border border-border z-50" align="start">
            <Command>
              <CommandInput placeholder="Rechercher un auteur..." />
              <CommandList>
                <CommandEmpty>Aucun auteur trouvé.</CommandEmpty>
                <CommandGroup>
                  {availableData.authors.map((author) => (
                    <CommandItem
                      key={author.id}
                      value={author.display_name || ""}
                      onSelect={() => toggleAuthor(author.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          preferences.authors.includes(author.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {author.display_name || "Auteur"}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {preferences.authors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferences.authors.map((authorId) => (
              <Badge key={authorId} variant="outline" className="gap-1">
                {getAuthorName(authorId)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => toggleAuthor(authorId)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Formats Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Formats</h3>
          <span className="text-xs text-muted-foreground">
            {preferences.formats.length} sélectionné(s)
          </span>
        </div>
        
        <Popover open={openPopover === "formats"} onOpenChange={(open) => setOpenPopover(open ? "formats" : null)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {preferences.formats.length > 0
                ? `${preferences.formats.length} format(s)`
                : "Sélectionner des formats"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 bg-popover border border-border z-50" align="start">
            <Command>
              <CommandInput placeholder="Rechercher un format..." />
              <CommandList>
                <CommandEmpty>Aucun format trouvé.</CommandEmpty>
                <CommandGroup>
                  {availableData.formats.map((format) => (
                    <CommandItem
                      key={format}
                      value={format}
                      onSelect={() => toggleFormat(format)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          preferences.formats.includes(format)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {getFormatLabel(format)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {preferences.formats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {preferences.formats.map((format) => (
              <Badge key={format} variant="secondary" className="gap-1">
                {getFormatLabel(format)}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => toggleFormat(format)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {(preferences.categories.length > 0 ||
        preferences.tags.length > 0 ||
        preferences.authors.length > 0 ||
        preferences.formats.length > 0) && (
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            Votre flux affichera les articles correspondant à vos{" "}
            {[
              preferences.categories.length > 0 && "catégories",
              preferences.tags.length > 0 && "sujets",
              preferences.authors.length > 0 && "auteurs",
              preferences.formats.length > 0 && "formats",
            ]
              .filter(Boolean)
              .join(", ")}{" "}
            sélectionnés.
          </p>
        </div>
      )}
    </div>
  );
};
