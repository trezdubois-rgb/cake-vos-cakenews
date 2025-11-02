export interface FeedItem {
  id: string;
  type: 'article' | 'video' | 'ad';
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  heroSrc: string;
  heroLqip: string;
  videoHls?: string;
  videoDuration?: number;
  publishedAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  category: string;
  engagement: {
    likes: number;
    views: number;
    shares: number;
  };
}

export interface UserInteraction {
  itemId: string;
  seen: boolean;
  liked: boolean;
  favorited: boolean;
  timeSpentSec: number;
  lastSeenAt: string;
}

export const mockFeedItems: FeedItem[] = [
  {
<<<<<<< HEAD
    id: '1',
    type: 'article',
    slug: 'intelligence-artificielle-revolution',
    title: "L'IA révolutionne le quotidien",
    excerpt: "Comment l'intelligence artificielle transforme nos habitudes...",
    contentHtml: `
      <p>L'intelligence artificielle n'est plus de la science-fiction. Elle s&apos;immisce dans notre quotidien de manière subtile mais révolutionnaire.</p>
      
      <h2>Des assistants personnels aux voitures autonomes</h2>
      <p>Depuis les assistants vocaux jusqu&apos;aux algorithmes de recommandation, l&apos;IA façonne déjà notre façon de vivre, travailler et nous divertir.</p>
      
      <p>Les secteurs de la santé, de l&apos;éducation et des transports connaissent des transformations majeures grâce à ces technologies émergentes.</p>
      
      <h3>L'impact sur l&apos;emploi</h3>
      <p>Contrairement aux craintes répandues, l'IA crée autant d'emplois qu&apos;elle en supprime, mais dans des domaines différents nécessitant de nouvelles compétences.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    heroLqip:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z',
    publishedAt: '2024-09-28T10:00:00Z',
    author: {
      id: 'author1',
      name: 'Sarah Tech',
      avatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    tags: ['technologie', 'ia', 'innovation'],
    category: 'Tech',
    engagement: { likes: 234, views: 1205, shares: 45 },
  },
  {
    id: '2',
    type: 'video',
    slug: 'recette-rapide-pasta',
    title: 'Pâtes carbonara en 10 minutes',
    excerpt: 'La vraie recette italienne, simple et rapide...',
    contentHtml: `
      <p>Découvrez la véritable recette des pâtes carbonara, telle qu&apos;elle se transmet de génération en génération en Italie.</p>
=======
    id: "1",
    type: "article",
    slug: "intelligence-artificielle-revolution",
    title: "L'IA révolutionne le quotidien",
    excerpt: "Comment l'intelligence artificielle transforme nos habitudes...",
    contentHtml: `
      <p>L'intelligence artificielle n'est plus de la science-fiction. Elle s'immisce dans notre quotidien de manière subtile mais révolutionnaire.</p>
      
      <h2>Des assistants personnels aux voitures autonomes</h2>
      <p>Depuis les assistants vocaux jusqu'aux algorithmes de recommandation, l'IA façonne déjà notre façon de vivre, travailler et nous divertir.</p>
      
      <p>Les secteurs de la santé, de l'éducation et des transports connaissent des transformations majeures grâce à ces technologies émergentes.</p>
      
      <h3>L'impact sur l'emploi</h3>
      <p>Contrairement aux craintes répandues, l'IA crée autant d'emplois qu'elle en supprime, mais dans des domaines différents nécessitant de nouvelles compétences.</p>
    `,
    heroSrc: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    heroLqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z",
    publishedAt: "2024-09-28T10:00:00Z",
    author: {
      id: "author1",
      name: "Sarah Tech",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    tags: ["technologie", "ia", "innovation"],
    category: "Tech",
    engagement: { likes: 234, views: 1205, shares: 45 }
  },
  {
    id: "2",
    type: "video",
    slug: "recette-rapide-pasta",
    title: "Pâtes carbonara en 10 minutes",
    excerpt: "La vraie recette italienne, simple et rapide...",
    contentHtml: `
      <p>Découvrez la véritable recette des pâtes carbonara, telle qu'elle se transmet de génération en génération en Italie.</p>
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      
      <h2>Ingrédients (4 personnes)</h2>
      <ul>
        <li>400g de spaghettis</li>
        <li>200g de pancetta ou guanciale</li>
        <li>4 œufs entiers</li>
        <li>100g de pecorino romano</li>
        <li>Poivre noir fraîchement moulu</li>
      </ul>
      
      <h3>La technique secrète</h3>
<<<<<<< HEAD
      <p>Le secret d&apos;une carbonara réussie réside dans le timing et la température. L&apos;œuf ne doit jamais cuire mais simplement créer une crème onctueuse.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop',
    heroLqip:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z',
    videoHls: 'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4',
    videoDuration: 120,
    publishedAt: '2024-09-28T08:30:00Z',
    author: {
      id: 'author2',
      name: 'Chef Marco',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    tags: ['cuisine', 'recette', 'italien'],
    category: 'Lifestyle',
    engagement: { likes: 456, views: 2340, shares: 78 },
  },
  {
    id: '3',
    type: 'article',
    slug: 'climat-cop28-resultats',
    title: 'COP28 : Les décisions qui changent tout',
    excerpt: 'Analyse des accords historiques sur le climat...',
=======
      <p>Le secret d'une carbonara réussie réside dans le timing et la température. L'œuf ne doit jamais cuire mais simplement créer une crème onctueuse.</p>
    `,
    heroSrc: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop",
    heroLqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z",
    videoHls: "https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4",
    videoDuration: 120,
    publishedAt: "2024-09-28T08:30:00Z",
    author: {
      id: "author2",
      name: "Chef Marco",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    tags: ["cuisine", "recette", "italien"],
    category: "Lifestyle",
    engagement: { likes: 456, views: 2340, shares: 78 }
  },
  {
    id: "3",
    type: "article",
    slug: "climat-cop28-resultats",
    title: "COP28 : Les décisions qui changent tout",
    excerpt: "Analyse des accords historiques sur le climat...",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    contentHtml: `
      <p>La COP28 de Dubaï marque un tournant dans la lutte contre le changement climatique avec des engagements sans précédent.</p>
      
      <h2>Les principales décisions</h2>
<<<<<<< HEAD
      <p>Pour la première fois, un accord mondial mentionne explicitement la "transition&quot; hors des énergies fossiles.</p>
=======
      <p>Pour la première fois, un accord mondial mentionne explicitement la "transition" hors des énergies fossiles.</p>
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
      
      <h3>Financement climatique</h3>
      <p>200 milliards de dollars supplémentaires ont été promis pour aider les pays en développement dans leur transition énergétique.</p>
      
<<<<<<< HEAD
      <p>Ces décisions, bien qu&apos;ambitieuses sur le papier, devront maintenant être mises en œuvre par chaque nation signataire.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1569163139394-de44cb3c217e?w=800&h=600&fit=crop',
    heroLqip:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z',
    publishedAt: '2024-09-27T15:45:00Z',
    author: {
      id: 'author3',
      name: 'Marie Écologie',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    tags: ['environnement', 'climat', 'cop28'],
    category: 'Environnement',
    engagement: { likes: 789, views: 3456, shares: 123 },
  },
  {
    id: '4',
    type: 'ad',
    slug: 'pub-smartphone-x',
    title: 'Découvrez le nouveau Smartphone X',
    excerpt: 'La révolution mobile est là...',
=======
      <p>Ces décisions, bien qu'ambitieuses sur le papier, devront maintenant être mises en œuvre par chaque nation signataire.</p>
    `,
    heroSrc: "https://images.unsplash.com/photo-1569163139394-de44cb3c217e?w=800&h=600&fit=crop",
    heroLqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z",
    publishedAt: "2024-09-27T15:45:00Z",
    author: {
      id: "author3",
      name: "Marie Écologie",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    tags: ["environnement", "climat", "cop28"],
    category: "Environnement",
    engagement: { likes: 789, views: 3456, shares: 123 }
  },
  {
    id: "4",
    type: "ad",
    slug: "pub-smartphone-x",
    title: "Découvrez le nouveau Smartphone X",
    excerpt: "La révolution mobile est là...",
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
    contentHtml: `
      <div class="ad-content text-center">
        <h2>Smartphone X Pro</h2>
        <p>Camera 108MP • 5G Ultra • Batterie 5000mAh</p>
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg my-4">
          <p class="text-2xl font-bold">-200€</p>
          <p>Offre limitée</p>
        </div>
        <button class="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold">
          Commander maintenant
        </button>
      </div>
    `,
<<<<<<< HEAD
    heroSrc: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop',
    heroLqip:
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z',
    publishedAt: '2024-09-28T12:00:00Z',
    author: {
      id: 'sponsor1',
      name: 'TechCorp',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    tags: ['smartphone', 'technologie', 'promo'],
    category: 'Publicité',
    engagement: { likes: 0, views: 0, shares: 0 },
  },
];

export const mockUserInteractions: Map<string, UserInteraction> = new Map([
  [
    '1',
    {
      itemId: '1',
      seen: true,
      liked: true,
      favorited: false,
      timeSpentSec: 45,
      lastSeenAt: '2024-09-28T09:15:00Z',
    },
  ],
  [
    '3',
    {
      itemId: '3',
      seen: true,
      liked: false,
      favorited: true,
      timeSpentSec: 120,
      lastSeenAt: '2024-09-27T16:30:00Z',
    },
  ],
]);

export const getUserInteraction = (itemId: string): UserInteraction => {
  return (
    mockUserInteractions.get(itemId) ?? {
      itemId,
      seen: false,
      liked: false,
      favorited: false,
      timeSpentSec: 0,
      lastSeenAt: new Date().toISOString(),
    }
  );
=======
    heroSrc: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
    heroLqip: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSrhtyahhp80B//Z",
    publishedAt: "2024-09-28T12:00:00Z",
    author: {
      id: "sponsor1",
      name: "TechCorp",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    tags: ["smartphone", "technologie", "promo"],
    category: "Publicité",
    engagement: { likes: 0, views: 0, shares: 0 }
  }
];

export const mockUserInteractions: Record<string, UserInteraction> = {
  "1": {
    itemId: "1",
    seen: true,
    liked: true,
    favorited: false,
    timeSpentSec: 45,
    lastSeenAt: "2024-09-28T09:15:00Z"
  },
  "3": {
    itemId: "3",
    seen: true,
    liked: false,
    favorited: true,
    timeSpentSec: 120,
    lastSeenAt: "2024-09-27T16:30:00Z"
  }
};

export const getUserInteraction = (itemId: string): UserInteraction => {
  return mockUserInteractions[itemId] || {
    itemId,
    seen: false,
    liked: false,
    favorited: false,
    timeSpentSec: 0,
    lastSeenAt: new Date().toISOString()
  };
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
};