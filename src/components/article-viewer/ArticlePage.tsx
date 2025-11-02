import React from 'react';

import { sanitizeHtml } from '@/lib/sanitize';

// Define the article structure, reusing or adapting from existing types
interface FeedArticle {
  id: string;
  type?: 'article';
  slug?: string;
  category?: string;
  title: string;
  excerpt?: string;
  contentHtml?: string;
  content?: string;
  heroSrc?: string;
  heroLqip?: string;
  videoHls?: string;
  image_url?: string;
  author: {
    id?: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  engagement?: {
    likes?: number;
    views?: number;
    shares?: number;
  };
  publishedAt?: string;
  published_at?: string;
  summary?: string;
}

interface ArticlePageProps {
  article: FeedArticle;
}

// Helper to calculate read time
const calculateReadTime = (htmlContent: string) => {
  const text = htmlContent.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 200); // 200 words per minute
  return `${readTimeMinutes} min`;
};

// Helper to format date
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    return date.toLocaleDateString('fr-FR');
  };

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {

  // Vérification de sécurité
  if (!article) {
    return <div className="h-screen w-screen flex items-center justify-center text-gray-500">Article non disponible</div>;
  }
  
  // Gestion flexible des données
  const content = article.contentHtml ?? article.content ?? article.summary ?? '';
  const heroSrc = article.heroSrc ?? article.image_url ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop';
  const authorName = article.author?.name ?? 'Auteur inconnu';
  const authorAvatar = article.author?.avatar ?? 'https://randomuser.me/api/portraits/men/1.jpg';
  const publishedAt = article.publishedAt ?? article.published_at ?? new Date().toISOString();
  const excerpt = article.excerpt ?? article.summary ?? '';
  const engagement = article.engagement ?? { likes: 0, views: 0, shares: 0 };
  
  const readTime = calculateReadTime(content);
  const publishedTime = formatDate(publishedAt);

  return (
    <div className="h-screen w-screen bg-gray-50 text-gray-900 flex justify-center">
       <main className="w-full max-w-3xl bg-white shadow-lg rounded-2xl flex flex-col">
         {/* Header fixe */}
         <header className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10 shadow-sm">
           <button aria-label="menu" className="p-2 rounded-md hover:bg-gray-100">
             <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect width="22" height="2" rx="1" fill="#9CA3AF"/>
               <rect y="7" width="22" height="2" rx="1" fill="#9CA3AF"/>
               <rect y="14" width="22" height="2" rx="1" fill="#9CA3AF"/>
             </svg>
           </button>
           
           <div className="logo-cakenews text-4xl text-[#ff005c]">CAKENEWS</div>
           
           <button className="p-2 rounded-full hover:bg-gray-100">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
               <circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="1.5"/>
             </svg>
           </button>
         </header>

         {/* Contenu scrollable */}
         <div className="flex-1 overflow-y-auto">
           {/* Hero */}
           <section className="px-5 pt-5">
             <div className="rounded-lg overflow-hidden bg-gray-200 aspect-[16/9]">
               <img 
                 src={heroSrc} 
                 alt={article.title} 
                 className="w-full h-full object-cover" 
                 loading="lazy"
                 decoding="async"
                 fetchPriority="high"
               />
             </div>

             <div className="mt-4">
               <h1 className="text-2xl md:text-3xl font-bold leading-tight">{article.title}</h1>
               {excerpt && <p className="mt-2 text-sm text-gray-600">{excerpt}</p>}

               <div className="mt-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                     <img 
                       src={authorAvatar} 
                       alt={authorName} 
                       className="w-full h-full object-cover" 
                       loading="lazy"
                       decoding="async"
                     />
                   </div>
                   <div>
                     <div className="text-sm font-medium">{authorName}</div>
                     <div className="text-xs text-gray-500">{publishedTime} · {readTime} de lecture</div>
                   </div>
                 </div>

                 <div className="flex items-center gap-3">
                   <button className="px-3 py-1 text-sm border border-[#ff005c] text-[#ff005c] rounded-md hover:bg-[#ff005c] hover:text-white transition-colors">Suivre</button>
                   <button aria-label="bookmark" className="p-2 rounded-md hover:bg-gray-100 text-[#ff005c]">
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                       <path d="M6 3h12v18l-6-4-6 4V3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </button>
                 </div>
               </div>
             </div>
           </section>

           {/* Article body */}
           <article className="article-content px-6 py-5 text-gray-800">
              {content ? (
                // eslint-disable-next-line react/no-danger
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
              ) : (
                <p>Contenu de l&apos;article non disponible.</p>
              )}

             <div className="mt-6 flex gap-4 items-center">
               <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 px-3 py-2 border border-[#ff005c] text-[#ff005c] rounded-lg hover:bg-[#ff005c] hover:text-white transition-colors">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                     <path d="M12 21l-8-8h6V3h4v10h6l-8 8z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                   <span className="text-sm">{engagement.likes}</span>
                 </button>

                 <button className="flex items-center gap-2 px-3 py-2 border border-[#ff005c] text-[#ff005c] rounded-lg hover:bg-[#ff005c] hover:text-white transition-colors">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                     <path d="M21 15a2 2 0 0 1-2 2H8l-5 3V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                   <span className="text-sm">{engagement.shares}</span>
                 </button>
               </div>

               <div className="ml-auto text-sm text-[#171717]">Partager · Signaler</div>
             </div>
           </article>

           {/* Related articles */}
           <section className="px-6 pb-8">
             <h4 className="text-base font-semibold mb-3">Articles liés</h4>

             <div className="grid grid-cols-1 gap-4">
               {[1,2,3].map((i) => (
                 <div key={i} className="flex gap-4 items-start p-3 rounded-lg hover:bg-gray-50 border" role="button" tabIndex={0}>
                   <div className="w-24 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                     <img src={`https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop&sat=-10&ixid=${i}`} alt="thumb" className="w-full h-full object-cover"/>
                   </div>
                   <div>
                     <div className="font-medium">Titre d'article lié #{i}</div>
                     <div className="text-xs text-gray-500">Résumé court pour capter l&apos;attention.</div>
                   </div>
                 </div>
               ))}
             </div>
           </section>
         </div>
       </main>
     </div>
  );
};

export default ArticlePage;