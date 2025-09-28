import { FeedContainer } from "@/components/feed/FeedContainer";
import { mockFeedItems } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

const MonFlux = () => {
  // For MVP, we'll show the same items but this would be filtered based on user preferences
  const personalizedItems = mockFeedItems.filter(item => 
    // Example filter logic - in real app this would be based on user preferences
    item.category !== 'Publicité' || Math.random() > 0.7
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header with preferences button */}
      <div className="absolute top-safe-area left-4 right-4 z-20 flex justify-between items-center">
        <h1 className="text-white font-semibold text-lg drop-shadow-lg">Mon Flux</h1>
        <Link to="/profil">
          <Button variant="ghost" size="sm" className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20">
            <Settings size={18} />
            <span className="ml-2 hidden sm:inline">Préférences</span>
          </Button>
        </Link>
      </div>

      <FeedContainer items={personalizedItems} personalFilter={true} />

      {/* Empty state if no personalized content */}
      {personalizedItems.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center p-6 bg-card rounded-lg shadow-lg max-w-sm mx-4">
            <h2 className="text-xl font-semibold mb-2">Personnalisez your flux</h2>
            <p className="text-muted-foreground mb-4">
              Configurez vos préférences pour voir du contenu adapté à vos intérêts.
            </p>
            <Link to="/profil">
              <Button>Configurer mes préférences</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonFlux;