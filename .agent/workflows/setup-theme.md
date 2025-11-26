---
description: Setup and test the theme system
---

# Theme System Setup Workflow

This workflow guides you through setting up and testing the theme management system.

## Prerequisites
- Supabase CLI installed (`npm install -g supabase`)
- Project configured with Supabase

## Steps

### 1. Start Supabase Local Instance
```bash
npx supabase start
```
This will start a local Supabase instance with PostgreSQL on port 54322.

// turbo
### 2. Apply Theme Settings Migration
```bash
npx supabase migration up
```
This creates the `theme_settings` table with RLS policies.

### 3. Verify Migration Success
```bash
npx supabase db reset --db-url postgresql://postgres:postgres@localhost:54322/postgres
```
Or check in Supabase Studio: http://localhost:54323

// turbo
### 4. Start Dev Server
```bash
npm run dev
```

### 5. Manual Testing Checklist
- [ ] Navigate to `/admin/design`
- [ ] Change primary color (e.g., from blue to red)
- [ ] Click "Appliquer les changements"
- [ ] Verify color changes appear globally (header, buttons, etc.)
- [ ] Reload page → color should persist
- [ ] Click "Réinitialiser" → should revert to default blue
- [ ] Test different fonts from dropdown
- [ ] Test theme mode toggle (Light/Dark/System)
- [ ] Test border radius selector

### 6. Error Scenarios to Test
- [ ] Stop Supabase (`npx supabase stop`)
- [ ] Try to save theme → should show error toast
- [ ] Verify app still works with default theme
- [ ] Restart Supabase → theme should reload from DB

## Troubleshooting

### Migration Fails
```bash
# Reset database and try again
npx supabase db reset
npx supabase migration up
```

### Table Already Exists
```bash
# Check if migration already ran
npx supabase migration list
```

### Port 54322 Already in Use
```bash
# Stop existing Supabase instance
npx supabase stop
npx supabase start
```

## Success Criteria
✅ Theme settings persist after page reload  
✅ Changes apply globally across all components  
✅ Error handling graceful when DB unavailable  
✅ Reset button restores defaults  
✅ Google Fonts load dynamically
