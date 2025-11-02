const fs = require('fs');
const path = require('path');

// Fonction pour échapper les apostrophes et guillemets dans le JSX
function fixUnescapedEntities(content) {
  let fixed = content;
  
  // Remplacer les apostrophes dans les chaînes JSX (entre > et <)
  // Pattern: >texte avec ' ou " <
  fixed = fixed.replace(/>([^<]*)'([^<]*)</g, (match, before, after) => {
    return `>${before}&apos;${after}<`;
  });
  
  fixed = fixed.replace(/>([^<]*)"([^<]*)</g, (match, before, after) => {
    // Ne pas remplacer si c'est déjà une entité HTML
    if (before.endsWith('&') || after.startsWith('quot;') || after.startsWith('ldquo;') || after.startsWith('rdquo;')) {
      return match;
    }
    return `>${before}&quot;${after}<`;
  });
  
  return fixed;
}

// Fonction pour traiter un fichier
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixUnescapedEntities(content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour parcourir récursivement les fichiers
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        walkDir(filePath, callback);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      callback(filePath);
    }
  });
}

// Main
console.log('🔍 Searching for unescaped entities in TSX/JSX files...\n');

let fixedCount = 0;
const srcDir = path.join(__dirname, '..', 'src');

walkDir(srcDir, (filePath) => {
  if (processFile(filePath)) {
    fixedCount++;
  }
});

console.log(`\n✨ Fixed ${fixedCount} files`);

