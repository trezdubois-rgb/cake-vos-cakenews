# Project Structure - Gutenberg Integration

## 📁 Complete File Structure

```
cake-vos-cakenews-main/
│
├── src/
│   ├── components/
│   │   ├── editor/
│   │   │   └── GutenbergEditor.tsx          ← Main editor component
│   │   │
│   │   ├── article/
│   │   │   ├── GutenbergRenderer.tsx        ← Renders Gutenberg HTML
│   │   │   └── ArticleWithGutenberg.tsx     ← Full article display
│   │   │
│   │   ├── feed/
│   │   │   ├── FeedContainer.tsx            ← Feed container (existing)
│   │   │   └── FeedItem.tsx                 ← Feed item (existing, renders HTML)
│   │   │
│   │   └── ... (other components)
│   │
│   ├── pages/
│   │   ├── GutenbergDemo.tsx                ← Demo page (/gutenberg-demo)
│   │   ├── ArticleEditor.tsx                ← Article editor page
│   │   ├── ArticleViewGutenberg.tsx         ← Article view page
│   │   ├── AdminArticles.tsx                ← Admin panel
│   │   └── ... (other pages)
│   │
│   ├── api/
│   │   ├── articles.ts                      ← API client
│   │   └── handlers/
│   │       └── articlesHandler.ts           ← Mock backend handlers
│   │
│   ├── data/
│   │   └── articles.ts                      ← Sample articles (existing)
│   │
│   ├── lib/
│   │   ├── sanitize.ts                      ← HTML sanitization (existing)
│   │   └── gutenberg.ts                     ← Gutenberg utilities (existing)
│   │
│   ├── App.tsx                              ← Updated with routes
│   ├── main.tsx                             ← Entry point (existing)
│   └── ... (other files)
│
├── public/
│   └── ... (static assets)
│
├── Documentation/
│   ├── GUTENBERG_README.md                  ← Quick start guide
│   ├── GUTENBERG_INTEGRATION.md             ← Complete integration guide
│   ├── GUTENBERG_FEED_INTEGRATION.md        ← Feed integration
│   ├── GUTENBERG_SETUP_SUMMARY.md           ← Setup overview
│   ├── TESTING_GUTENBERG.md                 ← Testing guide
│   ├── BACKEND_INTEGRATION.md               ← Backend setup
│   ├── USAGE_EXAMPLES.md                    ← Code examples
│   ├── FINAL_SUMMARY.md                     ← Project summary
│   ├── PROJECT_STRUCTURE.md                 ← This file
│   └── DEPLOYMENT_GUIDE.md                  ← Deployment guide (existing)
│
├── vite.config.ts                           ← Updated with PWA config
├── package.json                             ← Updated with Gutenberg packages
├── tsconfig.json                            ← TypeScript config (existing)
├── tailwind.config.js                       ← Tailwind config (existing)
└── ... (other config files)
```

## 📊 Component Hierarchy

```
App
├── Router
│   ├── /gutenberg-demo
│   │   └── GutenbergDemo
│   │       └── GutenbergEditor
│   │
│   ├── /article-gutenberg/:id
│   │   └── ArticleViewGutenberg
│   │       └── ArticleWithGutenberg
│   │           ├── Hero Image
│   │           ├── Article Metadata
│   │           ├── GutenbergRenderer
│   │           ├── Tags
│   │           ├── Engagement Stats
│   │           └── Related Articles
│   │
│   ├── /admin/articles
│   │   └── AdminArticles
│   │       ├── Search Bar
│   │       ├── Category Filter
│   │       ├── Articles Table
│   │       └── CRUD Buttons
│   │
│   ├── /mon-flux
│   │   └── MonFlux
│   │       └── FeedContainer
│   │           └── FeedItem (renders contentHtml)
│   │
│   └── ... (other routes)
```

## 🔄 Data Flow

```
User Input
    ↓
GutenbergEditor
    ↓
Block Data + HTML
    ↓
onSave Handler
    ↓
API Call (createArticle/updateArticle)
    ↓
Backend Storage
    ↓
Fetch Articles (getArticles)
    ↓
FeedContainer
    ↓
FeedItem (renders HTML)
    ↓
User Sees Article
```

## 📦 Dependencies Added

### WordPress Packages
```json
{
  "@wordpress/block-editor": "^12.0.0",
  "@wordpress/blocks": "^12.0.0",
  "@wordpress/components": "^25.0.0",
  "@wordpress/data": "^9.0.0",
  "@wordpress/element": "^5.0.0",
  "@wordpress/i18n": "^4.0.0",
  "@wordpress/rich-text": "^6.0.0",
  "@wordpress/block-library": "^8.0.0"
}
```

## 🎯 Key Files Explained

### GutenbergEditor.tsx
- Main editor component
- Handles block initialization
- Manages content state
- Provides save functionality
- Shows preview

### GutenbergRenderer.tsx
- Renders Gutenberg HTML
- Applies WordPress styles
- Sanitizes content
- Mobile responsive

### ArticleWithGutenberg.tsx
- Complete article display
- Shows hero image
- Displays metadata
- Renders content
- Shows related articles

### articles.ts (API Client)
- `createArticle()` - Create new article
- `updateArticle()` - Update existing
- `getArticle()` - Get single article
- `getArticles()` - Get all articles
- `deleteArticle()` - Delete article
- `searchArticles()` - Search articles
- `getArticlesByCategory()` - Filter by category
- `getArticlesByTag()` - Filter by tag

### articlesHandler.ts (Mock Backend)
- In-memory storage
- Simulates API responses
- Handles all CRUD operations
- Ready to replace with real backend

## 🔗 Route Configuration

```typescript
// src/App.tsx
<Routes>
  <Route path="/gutenberg-demo" element={<GutenbergDemo />} />
  <Route path="/article-gutenberg/:id" element={<ArticleViewGutenberg />} />
  <Route path="/admin/articles" element={<AdminArticles />} />
  <Route path="/mon-flux" element={<MonFlux />} />
  {/* ... other routes */}
</Routes>
```

## 🔐 Security Layers

```
User Input
    ↓
GutenbergEditor (validates blocks)
    ↓
HTML Output (WordPress format)
    ↓
Backend Validation (recommended)
    ↓
Database Storage
    ↓
Fetch from Database
    ↓
sanitizeHtml() function
    ↓
Display in FeedItem
```

## 📈 Performance Considerations

### Bundle Size
- Gutenberg: ~500-700 KB (gzip)
- Total: ~1.3 MB (gzip)

### Code Splitting Opportunities
- Lazy load GutenbergEditor
- Lazy load AdminArticles
- Lazy load ArticleViewGutenberg

### Optimization Tips
1. Use dynamic imports for admin pages
2. Lazy load images in articles
3. Cache API responses
4. Use service worker (PWA)

## 🧪 Testing Structure

```
Tests/
├── Components/
│   ├── GutenbergEditor.test.tsx
│   ├── GutenbergRenderer.test.tsx
│   └── ArticleWithGutenberg.test.tsx
│
├── Pages/
│   ├── GutenbergDemo.test.tsx
│   ├── ArticleViewGutenberg.test.tsx
│   └── AdminArticles.test.tsx
│
├── API/
│   ├── articles.test.ts
│   └── articlesHandler.test.ts
│
└── Integration/
    ├── Feed Integration.test.tsx
    └── Article Creation.test.tsx
```

## 🚀 Deployment Structure

```
Production Build
├── dist/
│   ├── index.html
│   ├── assets/
│   │   ├── index-*.css
│   │   ├── index-*.js (main bundle)
│   │   └── index-*.js (Gutenberg bundle)
│   ├── sw.js (Service Worker)
│   ├── workbox-*.js
│   └── manifest.webmanifest
│
└── Environment Variables
    ├── VITE_API_URL
    ├── VITE_APP_NAME
    └── VITE_APP_VERSION
```

## 📋 Configuration Files

### vite.config.ts
- Vite build configuration
- React plugin
- PWA plugin with increased cache limit
- Path aliases

### package.json
- Dependencies (WordPress packages)
- Scripts (build, dev, lint)
- Version information

### tsconfig.json
- TypeScript configuration
- Path aliases
- Strict mode enabled

### tailwind.config.js
- Tailwind CSS configuration
- Custom theme
- Prose plugin for article styling

## 🔄 Integration Points

### With Existing Feed System
- FeedItem renders `contentHtml`
- Uses existing sanitization
- Maintains existing styling
- Compatible with engagement features

### With Existing Auth System
- Uses existing user context
- Respects permissions
- Maintains session management

### With Existing Database
- Articles table structure
- User relationships
- Engagement tracking

## 📚 Documentation Map

```
Start Here
    ↓
GUTENBERG_README.md (Quick Start)
    ↓
Choose Your Path:
├─→ GUTENBERG_INTEGRATION.md (Complete Guide)
├─→ TESTING_GUTENBERG.md (Testing)
├─→ BACKEND_INTEGRATION.md (Backend Setup)
├─→ USAGE_EXAMPLES.md (Code Examples)
└─→ DEPLOYMENT_GUIDE.md (Deployment)
```

## ✅ Checklist for New Developers

- [ ] Read GUTENBERG_README.md
- [ ] Run `npm run dev`
- [ ] Visit `/gutenberg-demo`
- [ ] Create a test article
- [ ] View in feed
- [ ] Review component source code
- [ ] Check USAGE_EXAMPLES.md
- [ ] Read BACKEND_INTEGRATION.md
- [ ] Connect to backend
- [ ] Deploy to production

---

**This structure is production-ready and scalable!**

