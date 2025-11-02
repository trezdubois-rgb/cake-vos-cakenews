export const articles = [
  {
    id: '1',
    type: 'article',
    slug: 'les-secrets-de-la-cuisine-francaise',
    category: 'Gastronomie',
    title: 'Les secrets de la cuisine française révélés',
    excerpt: 'Découvrez les techniques et les ingrédients qui font la renommée de la gastronomie française.',
    contentHtml: `
      <p>La cuisine française est réputée dans le monde entier pour sa finesse et sa diversité. Cet article vous plonge au cœur de ses secrets les mieux gardés.</p>
      <h2>Les bases de la cuisine française</h2>
      <p>Toute grande cuisine repose sur des bases solides. En France, cela commence par le respect des produits et des saisons. Les chefs privilégient les circuits courts et les ingrédients de qualité.</p>
      <h3>Le fond de veau : l'or liquide</h3>
      <p>Un bon fond de veau est la base de nombreuses sauces et plats mijotés. Sa préparation, longue et méticuleuse, est un art en soi.</p>
      <h2>Les techniques emblématiques</h2>
      <ul>
        <li><strong>La découpe :</strong> Julienne, brunoise, mirepoix... chaque découpe a son utilité.</li>
        <li><strong>La cuisson :</strong> Saisir, pocher, braiser... maîtriser les cuissons est essentiel.</li>
        <li><strong>Le dressage :</strong> Une belle assiette est une invitation à la dégustation.</li>
      </ul>
      <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop" alt="Plat gastronomique français" />
      <p>En conclusion, la cuisine française est un héritage précieux qui continue d'évoluer. N'hésitez pas à expérimenter et à y apporter votre touche personnelle.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '1',
      name: 'Chef Antoine',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    tags: ['cuisine', 'france', 'gastronomie'],
    engagement: {
      likes: 150,
      views: 5000,
      shares: 30
    },
    publishedAt: '2024-07-20T10:00:00Z'
  },
  {
    id: '2',
    type: 'article',
    slug: 'voyage-au-coeur-des-alpes',
    category: 'Voyage',
    title: 'Voyage au cœur des Alpes : une aventure inoubliable',
    excerpt: 'Des sommets enneigés aux lacs cristallins, les Alpes offrent des paysages à couper le souffle.',
    contentHtml: `
      <p>Les Alpes sont une destination de choix pour les amoureux de la nature et les sportifs. Cet article vous guide à travers ses plus beaux paysages.</p>
      <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500&auto=format&fit=crop" alt="Paysage des Alpes" />
      <h2>Les incontournables</h2>
      <p>Ne manquez pas le Mont Blanc, le plus haut sommet d'Europe occidentale, ou le lac d'Annecy, réputé pour la pureté de son eau.</p>
      <h3>Randonnée et sports d'hiver</h3>
      <p>En été, des milliers de kilomètres de sentiers de randonnée s'offrent à vous. En hiver, les Alpes se transforment en un paradis pour les skieurs et les snowboarders.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '2',
      name: 'Clara la baroudeuse',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    tags: ['voyage', 'montagne', 'alpes'],
    engagement: {
      likes: 250,
      views: 8000,
      shares: 50
    },
    publishedAt: '2024-07-19T14:30:00Z'
  },
  // Article 3 - Intelligence Artificielle
  {
    id: '3',
    type: 'article',
    slug: 'la-revolution-de-l-ia',
    category: 'Technologie',
    title: 'L\'intelligence artificielle : une révolution en marche',
    excerpt: 'L\'IA transforme tous les secteurs de notre société. Comment fonctionne-t-elle et quels sont ses impacts ?',
    contentHtml: `
      <p>L'intelligence artificielle (IA) est devenue omniprésente dans notre quotidien. De l'assistant vocal de votre smartphone aux recommandations personnalisées sur les plateformes de streaming, l'IA façonne notre manière de vivre, travailler et interagir.</p>
      
      <h2>Comprendre l'intelligence artificielle</h2>
      <p>L'IA désigne l'ensemble des théories et des techniques mises en œuvre pour permettre aux machines d'imiter des fonctions cognitives humaines. L'apprentissage automatique (machine learning) constitue l'un de ses domaines les plus prometteurs.</p>
      
      <h3>Les différents types d'IA</h3>
      <p>On distingue généralement trois catégories d'IA : l'IA faible (ou étroite), l'IA forte (ou générale) et l'IA superintelligente. Actuellement, toutes les applications que nous utilisons relèvent de l'IA faible.</p>
      
      <h2>Applications concrètes dans notre quotidien</h2>
      <ul>
        <li><strong>Santé :</strong> Diagnostic médical, découverte de médicaments, chirurgie robotisée</li>
        <li><strong>Transport :</strong> Voitures autonomes, optimisation des itinéraires</li>
        <li><strong>Éducation :</strong> Apprentissage personnalisé, tuteurs virtuels</li>
        <li><strong>Finance :</strong> Détection de fraudes, trading algorithmique</li>
      </ul>
      
      <img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500&auto=format&fit=crop" alt="Intelligence artificielle" />
      
      <h2>Défis et opportunités</h2>
      <p>L'IA présente des opportunités extraordinaires mais soulève également des questions éthiques importantes. La protection de la vie privée, la transparence des algorithmes et l'impact sur l'emploi sont des enjeux majeurs qui nécessitent une réflexion collective.</p>
      
      <p>L'avenir de l'IA dépendra de notre capacité à développer ces technologies de manière responsable et bénéfique pour l'humanité. L'intelligence artificielle ne remplacera pas l'humain, mais les humains qui utilisent l'IA remplaceront ceux qui ne l'utilisent pas.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '3',
      name: 'Dr. Eva Tech',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    tags: ['ia', 'technologie', 'futur'],
    engagement: {
      likes: 500,
      views: 15000,
      shares: 100
    },
    publishedAt: '2024-07-21T09:00:00Z'
  },
  
  // Article 4 - Minimalisme
  {
    id: '4',
    type: 'article',
    slug: 'l-art-du-minimalisme',
    category: 'Art de vivre',
    title: 'L\'art du minimalisme : moins pour vivre mieux',
    excerpt: 'Désencombrer son espace et son esprit pour se concentrer sur l\'essentiel. Le minimalisme est plus qu\'une tendance, c\'est un mode de vie.',
    contentHtml: `
      <p>Le minimalisme gagne de plus en plus d'adeptes dans notre société consumériste. Mais au-delà du simple fait de posséder moins d'objets, le minimalisme est une philosophie de vie qui vise à simplifier notre existence pour se concentrer sur ce qui a vraiment de l'importance.</p>
      
      <h2>Qu'est-ce que le minimalisme ?</h2>
      <p>Le minimalisme n'est pas une privation, mais un choix conscient de se détacher du superflu pour faire de la place à l'essentiel. Il s'agit de questionner chaque possession et chaque engagement : est-ce que cela ajoute de la valeur à ma vie ?</p>
      
      <h3>Les bienfaits d'une vie simplifiée</h3>
      <p>Des études montrent que posséder moins d'objets réduit le stress, améliore la concentration et libère du temps pour les activités qui nous passionnent. Un espace dégagé favorise un esprit clair.</p>
      
      <img src="https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=500&auto=format&fit=crop" alt="Intérieur minimaliste" />
      
      <h2>Comment débuter sa démarche minimaliste</h2>
      <ul>
        <li><strong>Commencez petit :</strong> Choisissez une pièce ou une catégorie d'objets (vêtements, livres, etc.)</li>
        <li><strong>La règle du 90/90 :</strong> Si vous ne l'avez pas utilisé depuis 90 jours et ne pensez pas l'utiliser dans les 90 prochains jours, donnez-le</li>
        <li><strong>Un objet entrant = un objet sortant :</strong> Pour chaque nouvel achat, débarrassez-vous de quelque chose</li>
        <li><strong>Digitalisez :</strong> Préférez les documents numériques aux versions papier</li>
      </ul>
      
      <h2>Le minimalisme au-delà des objets</h2>
      <p>Le minimalisme s'applique aussi à nos agendas surchargés, nos relations toxiques et nos habitudes mentales néfastes. C'est un chemin vers l'intentionnalité dans tous les aspects de la vie.</p>
      
      <p>Adopter le minimalisme, c'est choisir de vivre délibérément. C'est reconnaître que le bonheur ne se trouve pas dans la possession, mais dans l'expérience et les relations humaines authentiques.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1519642918688-7e43b19245d8?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '4',
      name: 'Léo Zen',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    tags: ['minimalisme', 'bien-etre', 'developpement-personnel'],
    engagement: {
      likes: 320,
      views: 9500,
      shares: 60
    },
    publishedAt: '2024-07-20T18:00:00Z'
  },
  
  // Article 5 - Cinéma
  {
    id: '5',
    type: 'article',
    slug: 'histoire-du-cinema',
    category: 'Culture',
    title: 'Une brève histoire du cinéma',
    excerpt: 'Des frères Lumière à la 3D, revivez les grands moments qui ont marqué le septième art.',
    contentHtml: `
      <p>Le cinéma, ce art du mouvement, a transformé notre façon de raconter des histoires et de percevoir le monde. Depuis ses humbles débuts au XIXe siècle jusqu'aux blockbusters modernes, l'évolution du cinéma reflète notre soif de narration visuelle.</p>
      
      <h2>Les origines : la naissance du mouvement</h2>
      <p>Tout commence en 1895 quand les frères Lumière projettent publiquement leurs premières images animées à Paris. Ces courts métrages d'une minute émerveillent les spectateurs qui découvrent pour la première fois le mouvement capturé sur écran.</p>
      
      <h3>L'âge d'or du muet</h3>
      <p>De 1900 à 1930, le cinéma muet atteint son apogée. Charlie Chaplin, Buster Keaton et bien d'autres créent un langage visuel universel. Les studios hollywoodiens commencent à se former, posant les bases de l'industrie cinématographique moderne.</p>
      
      <img src="https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop" alt="Salle de cinéma" />
      
      <h2>La révolution du son</h2>
      <p>1927 marque un tournant avec "Le Chanteur de jazz", premier film parlant. Cette innovation transforme radicalement l'art cinématographique, ouvrant la voie à des genres comme la comédie musicale et le film noir.</p>
      
      <h2>L'évolution technologique</h2>
      <ul>
        <li><strong>Couleur :</strong> "Autant en emporte le vent" (1939) popularise la Technicolor</li>
        <li><strong>Grand écran :</strong> CinémaScope et autres formats larges dans les années 50</li>
        <li><strong>Effets spéciaux :</strong> Star Wars (1977) révolutionne les FX</li>
        <li><strong>Numérique :</strong> Avatar (2009) pousse la 3D vers de nouveaux sommets</li>
      </ul>
      
      <h2>Le cinéma aujourd'hui</h2>
      <p>Aujourd'hui, le cinéma est plus accessible que jamais. Les plateformes de streaming bouleversent la distribution, tandis que les technologies comme la réalité virtuelle ouvrent de nouvelles possibilités narratives. Malgré ces changements, l'essence du cinéma reste la même : raconter des histoires qui nous font rêver, réfléchir et ressentir.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '5',
      name: 'Jean-Pierre Ciné',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    tags: ['cinema', 'histoire', 'culture'],
    engagement: {
      likes: 180,
      views: 6200,
      shares: 40
    },
    publishedAt: '2024-07-18T11:00:00Z'
  },
  
  // Article 6 - Jardinage urbain
  {
    id: '6',
    type: 'article',
    slug: 'le-guide-du-jardinage-urbain',
    category: 'Nature',
    title: 'Le guide complet du jardinage urbain',
    excerpt: 'Pas besoin d\'un grand jardin pour cultiver ses propres légumes et herbes aromatiques. Découvrez nos astuces pour jardiner en ville.',
    contentHtml: `
      <p>Vivre en ville ne signifie pas renoncer à cultiver ses propres légumes et herbes aromatiques. Le jardinage urbain connaît un essor considérable, transformant balcons, terrasses et même rebords de fenêtres en petits paradis verts productifs.</p>
      
      <h2>Choisir le bon emplacement</h2>
      <p>La clé du succès réside dans l'observation de votre espace. Notez l'ensoleillement, l'exposition aux vents dominants et la facilité d'accès à l'eau. La plupart des légumes et herbes ont besoin d'au moins 6 heures de soleil par jour.</p>
      
      <h3>Optimiser l'espace vertical</h3>
      <p>En ville, l'espace est précieux. Pensez vertical : étagères, suspensions, treillis et jardinières empilables maximisent votre surface de culture. Les plantes grimpantes comme les tomates cerises ou les pois sont parfaites pour cette approche.</p>
      
      <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=500&auto=format&fit=crop" alt="Jardin urbain" />
      
      <h2>Les plantes idéales pour débuter</h2>
      <ul>
        <li><strong>Herbes aromatiques :</strong> Basilic, menthe, persil, ciboulette - faciles et productives</li>
        <li><strong>Feuilles vertes :</strong> Laitue, épinards, roquette - croissance rapide</li>
        <li><strong>Légumes résistants :</strong> Radis, carottes miniatures, tomates cerises</li>
        <li><strong>Fleurs comestibles :</strong> Capucines, pensées, soucis - jolies et utiles</li>
      </ul>
      
      <h2>Techniques de culture urbaine</h2>
      <p>Le compostage en appartement est possible avec des bokashi ou des lombricomposteurs. L'irrigation goutte-à-goutte artisanale peut être créée avec des bouteilles en plastique recyclées. L'association de plantes compagnes aide à prévenir naturellement les parasites.</p>
      
      <h2>Entretien et récolte</h2>
      <p>La surveillance régulière est cruciale. Arrosez au pied des plantes, préférablement le matin. Tailler régulièrement stimule la croissance. Récolter à maturité optimale garantit la meilleure saveur et encourage la production continue.</p>
      
      <p>Le jardinage urbain est plus qu'un hobby : c'est une déclaration d'indépendance alimentaire, un geste écologique et une source de bien-être quotidien. Chaque graine plantée est un pas vers un monde plus durable.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '6',
      name: 'Julie Green',
      avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
    },
    tags: ['jardinage', 'ville', 'nature', 'diy'],
    engagement: {
      likes: 210,
      views: 7100,
      shares: 45
    },
    publishedAt: '2024-07-21T11:30:00Z'
  },
  
  // Article 7 - Jazz
  {
    id: '7',
    type: 'article',
    slug: 'decouvrir-le-jazz',
    category: 'Musique',
    title: 'S\'initier au Jazz : par où commencer ?',
    excerpt: 'Le jazz peut sembler intimidant, mais il est accessible à tous. Voici une sélection pour faire vos premiers pas dans ce monde fascinant.',
    contentHtml: `
      <p>Le jazz, né dans le New Orleans du début du XXe siècle, est souvent perçu comme un genre musical complexe et élitiste. Pourtant, à l'écoute, il révèle une richesse émotionnelle et une spontanéité qui peuvent séduire tout auditeur curieux.</p>
      
      <h2>Les pionniers du jazz</h2>
      <p>Pour comprendre le jazz, il faut remonter à ses racines. Louis Armstrong, Duke Ellington et Charlie Parker ont posé les fondations de ce genre. Leur approche de l'improvisation et du swing reste une source d'inspiration pour les musiciens d'aujourd'hui.</p>
      
      <h3>Les styles majeurs du jazz</h3>
      <p>Le jazz a évolué à travers différentes époques et styles : le swing des années 30, le bebop des années 40, le cool jazz et le hard bop des années 50, le free jazz des années 60, jusqu'au jazz fusion des années 70.</p>
      
      <img src="https://images.unsplash.com/photo-1511192336575-5a79af67d629?q=80&w=500&auto=format&fit=crop" alt="Musicien de jazz" />
      
      <h2>Albums incontournables pour débuter</h2>
      <ul>
        <li><strong>"Kind of Blue"</strong> de Miles Davis (1959) - Un chef-d'œuvre accessible</li>
        <li><strong>"Time Out"</strong> de Dave Brubeck (1959) - Le jazz atypique avec "Take Five"</li>
        <li><strong>"A Love Supreme"</strong> de John Coltrane (1965) - Une expérience spirituelle</li>
        <li><strong>"Blue Train"</strong> de John Coltrane (1957) - Le hard bop parfait</li>
      </ul>
      
      <h2>Comment écouter du jazz</h2>
      <p>Contrairement à d'autres genres, le jazz récompense l'écoute attentive. Portez attention aux solos improvisés, aux interactions entre les musiciens, aux changements de rythme. Chaque écoute peut révéler de nouveaux détails.</p>
      
      <p>Le jazz est un voyage sans fin. Plus vous écoutez, plus vous découvrez. Laissez-vous emporter par cette musique qui célèbre la liberté, l'expression personnelle et la collaboration artistique.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1511192336575-5a79af67d629?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '7',
      name: 'Miles Notes',
      avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
    },
    tags: ['musique', 'jazz', 'culture'],
    engagement: {
      likes: 190,
      views: 5800,
      shares: 35
    },
    publishedAt: '2024-07-19T08:45:00Z'
  },
  
  // Article 8 - Bienfaits du sport
  {
    id: '8',
    type: 'article',
    slug: 'les-bienfaits-du-sport',
    category: 'Santé',
    title: 'Les multiples bienfaits du sport sur la santé',
    excerpt: 'Activité physique régulière : un allié indispensable pour votre bien-être physique et mental.',
    contentHtml: `
      <p>L'activité physique régulière est l'un des meilleurs investissements que vous puissiez faire pour votre santé. Les bénéfices du sport s'étendent bien au-delà de l'amélioration de la condition physique, touchant aussi la santé mentale et la qualité de vie globale.</p>
      
      <h2>Bienfaits physiques immédiats</h2>
      <p>Dès les premières minutes d'activité, votre organisme commence à réagir positivement. La circulation sanguine s'améliore, les endorphines sont libérées, et votre métabolisme s'accélère. Ces effets immédiats contribuent à une sensation de bien-être instantanée.</p>
      
      <h3>Renforcement cardiovasculaire</h3>
      <p>Le sport renforce le cœur et améliore l'efficacité du système cardiovasculaire. Une séance régulière d'activité physique réduit le risque de maladies cardiaques, d'accidents vasculaires cérébraux et d'hypertension artérielle.</p>
      
      <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=500&auto=format&fit=crop" alt="Personne faisant du sport" />
      
      <h2>Impact sur la santé mentale</h2>
      <ul>
        <li><strong>Réduction du stress :</strong> L'exercice physique diminue les niveaux de cortisol, l'hormone du stress</li>
        <li><strong>Amélioration de l'humeur :</strong> Les endorphines créent un effet naturel anti-dépresseur</li>
        <li><strong>Boost de confiance :</strong> Atteindre ses objectifs sportifs renforce l'estime de soi</li>
        <li><strong>Meilleur sommeil :</strong> L'activité physique régulière améliore la qualité du sommeil</li>
      </ul>
      
      <h2>Recommandations pour débuter</h2>
      <p>L'OMS recommande au moins 150 minutes d'activité physique modérée par semaine. Commencez progressivement, choisissez une activité que vous aimez, et surtout, soyez régulier. Marcher, nager, danser, faire du vélo - toute forme de mouvement compte.</p>
      
      <p>Le sport n'est pas une corvée, c'est un cadeau que vous faites à votre corps et votre esprit. Chaque pas, chaque mouvement, chaque goutte de sueur est un investissement dans votre avenir plus sain et plus heureux.</p>
    `,
    engagement: {
      likes: 450,
      views: 12000,
      shares: 90
    },
    publishedAt: '2024-07-22T07:00:00Z'
  },
  {
    id: '9',
    type: 'article',
    slug: 'photographie-pour-debutants',
    category: 'Photographie',
    title: 'La photographie pour les nuls : conseils de pro',
    excerpt: 'Apprenez les bases de la photographie et commencez à prendre des clichés exceptionnels avec nos conseils simples et efficaces.',
    contentHtml: `
      <p>La photographie est un art accessible à tous, mais maîtriser les bases techniques peut transformer vos clichés ordinaires en images exceptionnelles. Que vous utilisiez un smartphone ou un appareil reflex, ces principes fondamentaux s'appliquent à tous.</p>
      
      <h2>La règle des tiers</h2>
      <p>Cette règle de composition essentielle consiste à diviser votre image en neuf sections égales à l'aide de deux lignes horizontales et deux lignes verticales. Placez vos éléments importants le long de ces lignes ou à leurs intersections pour créer une composition équilibrée et visuellement intéressante.</p>
      
      <h3>Maîtriser la lumière</h3>
      <p>La lumière est l'élément le plus crucial en photographie. Le "golden hour" (première et dernière heure de lumière du jour) offre une lumière chaude et douce parfaite pour les portraits et paysages. Évitez la lumière du midi qui crée des ombres dures.</p>
      
      <img src="https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=500&auto=format&fit=crop" alt="Appareil photo" />
      
      <h2>Les réglages essentiels</h2>
      <ul>
        <li><strong>ISO :</strong> Plus il est bas, moins il y a de grain. Utilisez 100-400 en plein jour</li>
        <li><strong>Ouverture :</strong> f/1.4-f/2.8 pour le flou d'arrière-plan, f/8-f/11 pour la netteté globale</li>
        <li><strong>Vitesse :</strong> Au moins 1/60s pour éviter le flou de mouvement</li>
        <li><strong>Mise au point :</strong> Toujours sur les yeux pour les portraits</li>
      </ul>
      
      <h2>Photographier avec son smartphone</h2>
      <p>Nettoyez régulièrement l'objectif, activez la grille pour la règle des tiers, utilisez le mode HDR pour les paysages, et n'hésitez pas à vous rapprocher plutôt que de zoomer. L'édition légère peut aussi grandement améliorer vos photos.</p>
      
      <p>La photographie s'apprend par la pratique. Ne vous découragez pas si vos premières photos ne sont pas parfaites. Chaque image que vous prenez est une opportunité d'apprendre et de progresser. Le plus important est de garder votre curiosité visuelle et de continuer à explorer le monde à travers votre objectif.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '9',
      name: 'Anna Clic',
      avatar: 'https://randomuser.me/api/portraits/women/9.jpg'
    },
    tags: ['photographie', 'debutant', 'creativite'],
    engagement: {
      likes: 280,
      views: 8500,
      shares: 55
    },
    publishedAt: '2024-07-20T16:20:00Z'
  },
  {
    id: '10',
    type: 'article',
    slug: 'le-futur-du-travail',
    category: 'Société',
    title: 'Télétravail, IA, semaine de 4 jours : quel est le futur du travail ?',
    excerpt: 'Le monde du travail est en pleine mutation. Explorons les tendances qui dessinent les emplois de demain.',
    contentHtml: `
      <p>Le monde du travail connaît une transformation sans précédent. Le télétravail massif, l'intelligence artificielle, les semaines raccourcies et l'automatisation redéfinissent fondamentalement notre rapport au travail et à la vie professionnelle.</p>
      
      <h2>La révolution du télétravail</h2>
      <p>La pandémie a accéléré l'adoption du télétravail de façon spectaculaire. Aujourd'hui, de nombreuses entreprises adoptent des modèles hybrides, offrant flexibilité aux employés tout en maintenant un lien physique avec le bureau. Cette transformation impacte l'immobilier de bureaux, les transports urbains et l'équilibre vie professionnelle-vie personnelle.</p>
      
      <h3>L'intelligence artificielle au service du travail</h3>
      <p>L'IA n'est plus une menace mais un assistant puissant. Elle automatise les tâches répétitives, analyse des données complexes, et libère du temps pour des activités à plus forte valeur ajoutée. Les métiers évoluent vers plus de créativité, d'empathie et de pensée stratégique.</p>
      
      <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500&auto=format&fit=crop" alt="Bureau moderne" />
      
      <h2>La semaine de 4 jours : mythe ou réalité ?</h2>
      <ul>
        <li><strong>Pilotes réussis :</strong> Des entreprises mondiales testent avec succès le modèle 4 jours</li>
        <li><strong>Productivité maintenue :</strong> Certains cas montrent une productivité stable voire améliorée</li>
        <li><strong>Santé mentale améliorée :</strong> Moins de stress, plus de temps personnel</li>
        <li><strong>Défis organisationnels :</strong> Planification client, couverture des services</li>
      </ul>
      
      <h2>Les nouveaux métiers de demain</h2>
      <p>Des postes émergents apparaissent : spécialistes en éthique de l'IA, designers d'expérience virtuelle, coachs en bien-être digital, analysts de données comportementales. La formation continue devient essentielle pour rester pertinent dans un marché du travail en constante évolution.</p>
      
      <p>Le futur du travail n'est pas à craindre mais à façonner. En adaptant nos compétences, nos attentes et nos organisations, nous pouvons créer un monde professionnel plus humain, plus flexible et plus épanouissant. Le travail de demain sera celui que nous choisirons de construire aujourd'hui.</p>
    `,
    heroSrc: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=500&auto=format&fit=crop',
    heroLqip: 'LGF5?x_3.T_3.T_3_3_3',
    author: {
      id: '10',
      name: 'Sophie RH',
      avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
    },
    tags: ['travail', 'futur', 'societe', 'technologie'],
    engagement: {
      likes: 380,
      views: 11000,
      shares: 75
    },
    publishedAt: '2024-07-22T13:00:00Z'
  }
];