import { FeedContainer } from "@/components/feed/FeedContainer";
import { mockFeedItems } from "@/data/mockData";

const Accueil = () => {
  return (
    <div className="min-h-screen bg-background">
      <FeedContainer items={mockFeedItems} />
    </div>
  );
};

export default Accueil;