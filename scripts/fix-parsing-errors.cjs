const fs = require('fs');
const path = require('path');

/**
 * Script pour corriger les erreurs de parsing (apostrophes mal échappées)
 * Corrige les patterns comme &apos; dans le code JavaScript/TypeScript
 */

const filesToFix = [
  'src/components/article/BlockRenderer.tsx',
  'src/components/article/CommentDialog.tsx',
  'src/components/article/CommentSection.tsx',
  'src/components/editor/BlockEditor.tsx',
  'src/components/editor/BlockTypeSelector.tsx',
  'src/components/editor/WordPressEditor.tsx',
  'src/components/header/HeaderBuilder.tsx',
  'src/components/layout/SearchDialog.tsx',
  'src/components/notifications/NotificationBadge.tsx',
  'src/components/notifications/NotificationsList.tsx',
  'src/components/puzzle/SimplePuzzle.tsx',
  'src/components/puzzle/SlidingPuzzle.tsx',
  'src/components/ui/accordion.tsx',
  'src/components/ui/alert-dialog.tsx',
  'src/components/ui/alert.tsx',
  'src/components/ui/breadcrumb.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/carousel.tsx',
  'src/components/ui/chart.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/drawer.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/input-otp.tsx',
  'src/components/ui/pagination.tsx',
  'src/components/ui/sheet.tsx',
  'src/components/ui/sidebar.tsx',
  'src/components/ui/table.tsx',
  'src/components/widgets/PremiumWidgets.tsx',
  'src/components/widgets/StickyWidgets.tsx',
  'src/contexts/GamificationContext.tsx',
  'src/data/articles.ts',
  'src/lib/imageCompression.ts',
  'src/pages/AdminAuth.tsx',
  'src/pages/Article.tsx',
  'src/pages/Auth.tsx',
  'src/pages/Login.tsx',
  'src/pages/Messages.tsx',
  'src/pages/Profil.tsx',
  'src/pages/Signup.tsx',
  'src/pages/admin/ArticleEditor.tsx',
  'src/pages/admin/MediaLibrary.tsx',
  'src/pages/admin/ThemeManager.tsx',
  'src/pages/admin/UsersManager.tsx',
  'src/utils/createDefaultUsers.ts',
];

function fixFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return false;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Corrections des patterns problématiques
    
    // 1. Corriger &apos; dans le code JavaScript (pas dans JSX)
    // Pattern: case 'video&apos;: → case 'video':
    content = content.replace(/case\s+'([^']*?)&apos;([^']*?)'/g, "case '$1'$2'");
    
    // 2. Corriger &quot; dans les attributs
    // Pattern: path="/&quot; → path="/"
    content = content.replace(/=\s*"([^"]*?)&quot;([^"]*?)"/g, '="$1"$2"');
    
    // 3. Corriger les guillemets mal fermés dans les strings
    // Pattern: 'text&apos; → 'text'
    content = content.replace(/'([^']*?)&apos;([^']*?)'/g, "'$1'$2'");
    
    // 4. Corriger les strings non terminées avec &quot;
    content = content.replace(/"([^"]*?)&quot;([^"]*?)"/g, '"$1"$2"');
    
    // 5. Corriger les patterns spécifiques trouvés
    // className="...&quot;
    content = content.replace(/className="([^"]*?)&quot;/g, 'className="$1"');
    
    // path="/admin&quot;
    content = content.replace(/path="([^"]*?)&quot;/g, 'path="$1"');
    
    // 6. Corriger les apostrophes dans les strings TypeScript
    // const x = '&apos;
    content = content.replace(/=\s*'&apos;/g, "=''");
    content = content.replace(/=\s*"&apos;/g, '=""');
    
    // 7. Corriger les patterns dans les JSX
    // <div className="...&quot;>
    content = content.replace(/className="([^"]*?)&quot;>/g, 'className="$1">');
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  Aucun changement: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Correction des erreurs de parsing...\n');

let fixedCount = 0;
let errorCount = 0;

filesToFix.forEach(file => {
  const result = fixFile(file);
  if (result === true) {
    fixedCount++;
  } else if (result === false && fs.existsSync(path.join(process.cwd(), file))) {
    // Fichier existe mais pas de changement
  } else {
    errorCount++;
  }
});

console.log(`\n📊 Résumé:`);
console.log(`   ✅ Fichiers corrigés: ${fixedCount}`);
console.log(`   ℹ️  Fichiers sans changement: ${filesToFix.length - fixedCount - errorCount}`);
console.log(`   ❌ Erreurs: ${errorCount}`);
console.log(`\n✨ Terminé!`);

