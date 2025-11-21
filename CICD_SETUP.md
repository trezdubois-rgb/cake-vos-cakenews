# Configuration CI/CD & Monitoring

## GitHub Actions

### Workflows Configurés

#### 1. CI Workflow (`.github/workflows/ci.yml`)
- **Déclenchement**: Push et Pull Requests sur `main` et `develop`
- **Actions**:
  - Tests sur Node 18.x et 20.x
  - Linting
  - Tests unitaires avec coverage
  - Build de production
  - Upload coverage vers Codecov
  - Lighthouse CI pour performance

#### 2. Deploy Workflow (`.github/workflows/deploy.yml`)
- **Déclenchement**: Push sur `main` ou manuel
- **Actions**:
  - Tests
  - Build de production
  - Déploiement automatique vers Vercel

### Secrets GitHub Requis

Configurez ces secrets dans Settings > Secrets and variables > Actions:

```
CODECOV_TOKEN=<votre_token_codecov>
VERCEL_TOKEN=<votre_token_vercel>
VERCEL_ORG_ID=<votre_org_id>
VERCEL_PROJECT_ID=<votre_project_id>
VITE_SUPABASE_URL=<votre_supabase_url>
VITE_SUPABASE_ANON_KEY=<votre_supabase_key>
```

---

## Environnements

### Fichiers de Configuration

- `.env.development.example` - Template pour développement
- `.env.production.example` - Template pour production

### Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `VITE_SUPABASE_URL` | URL Supabase | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Clé publique Supabase | ✅ |
| `VITE_SENTRY_DSN` | DSN Sentry pour error tracking | ⚠️ Production |
| `VITE_ENVIRONMENT` | Environnement (dev/staging/prod) | ⚠️ |

### Setup Local

1. Copiez le fichier exemple:
```bash
cp .env.development.example .env.local
```

2. Remplissez les valeurs:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. Lancez le serveur de développement:
```bash
npm run dev
```

---

## Monitoring avec Sentry

### Configuration

Sentry est configuré dans `src/main.tsx` et s'active automatiquement en production si `VITE_SENTRY_DSN` est défini.

### Fonctionnalités Activées

- **Error Tracking**: Capture automatique des erreurs JavaScript
- **Performance Monitoring**: 10% des transactions tracées
- **Session Replay**: 10% des sessions normales, 100% des sessions avec erreurs

### Setup Sentry

1. Créez un compte sur [sentry.io](https://sentry.io)
2. Créez un nouveau projet React
3. Copiez le DSN
4. Ajoutez-le aux secrets GitHub et `.env.production`

---

## SEO & Meta Tags

### Composants Disponibles

#### `<SEO />` - Meta tags génériques
```tsx
import { SEO } from '@/components/SEO';

<SEO
  title="Ma Page"
  description="Description de ma page"
  image="/image.jpg"
  url="/ma-page"
/>
```

#### `<ArticleSEO />` - Meta tags pour articles
```tsx
import { ArticleSEO } from '@/components/SEO';

<ArticleSEO
  title={article.title}
  excerpt={article.excerpt}
  heroImage={article.hero_image_url}
  publishedAt={article.published_at}
  authorName={article.author_name}
  tags={article.tags}
  slug={article.id}
/>
```

### Meta Tags Générés

- Title & Description
- Open Graph (Facebook)
- Twitter Cards
- Canonical URLs
- Article metadata (pour type="article")

---

## Scripts NPM

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:staging": "vite build --mode staging",
  "build:prod": "vite build --mode production",
  "preview": "vite preview",
  "test": "jest",
  "lint": "eslint ."
}
```

---

## Déploiement

### Automatique (via GitHub Actions)

1. Push sur `main` déclenche le déploiement automatique
2. Les tests doivent passer
3. Le build doit réussir
4. Déploiement vers Vercel

### Manuel

```bash
# Build de production
npm run build:prod

# Preview local
npm run preview

# Déployer avec Vercel CLI
npx vercel --prod
```

---

## Métriques & Performance

### Lighthouse CI

Chaque Pull Request déclenche automatiquement Lighthouse CI qui vérifie:
- Performance
- Accessibility
- Best Practices
- SEO

Les résultats sont publiés dans les commentaires de la PR.

### Objectifs

- Performance Score: > 90
- Accessibility Score: > 95
- Best Practices Score: > 90
- SEO Score: > 95

---

## Troubleshooting

### Build Fails

1. Vérifiez les variables d'environnement
2. Assurez-vous que toutes les dépendances sont installées: `npm ci`
3. Vérifiez les erreurs TypeScript: `npm run build`

### Tests Fail

1. Exécutez les tests localement: `npm test`
2. Vérifiez les mocks Supabase
3. Assurez-vous que Jest est configuré correctement

### Deployment Fails

1. Vérifiez les secrets GitHub
2. Vérifiez les logs dans Actions
3. Testez le build localement: `npm run build:prod`

---

## Prochaines Étapes

- [ ] Configurer Codecov pour coverage reports
- [ ] Ajouter plus de tests E2E
- [ ] Configurer staging environment
- [ ] Ajouter performance budgets
- [ ] Implémenter feature flags
